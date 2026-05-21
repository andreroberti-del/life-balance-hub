import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { getServiceClient, getUserFromRequest, corsHeaders } from '../_shared/supabase-client.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const userId = getUserFromRequest(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: 'AI service not configured. Add ANTHROPIC_API_KEY to Supabase secrets.' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message } = await req.json();
    const supabase = getServiceClient();

    // Gather user context using CORRECT table names
    const [
      profileRes,
      metricsRes,
      scansRes,
      levelRes,
      emotionalRes,
      gratitudeRes,
      courseProgressRes,
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('health_metrics').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(14),
      supabase.from('scans').select('product_name, score, verdict, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
      supabase.from('user_levels').select('total_xp, current_level, level_up_count').eq('user_id', userId).maybeSingle(),
      supabase.from('emotional_checkins').select('mood, stress, anxiety, energy, check_date').eq('user_id', userId).order('check_date', { ascending: false }).limit(7),
      supabase.from('gratitude_entries').select('item_1, item_2, item_3, entry_date').eq('user_id', userId).order('entry_date', { ascending: false }).limit(7),
      supabase.from('user_course_progress').select('course_id, progress_pct, status').eq('user_id', userId).order('updated_at', { ascending: false }).limit(5),
    ]);

    const profile = profileRes.data;
    const metrics = metricsRes.data || [];
    const scans = scansRes.data || [];
    const level = levelRes.data;
    const emotional = emotionalRes.data || [];
    const gratitude = gratitudeRes.data || [];
    const courseProgress = courseProgressRes.data || [];

    // Calculate streak from health_metrics
    let streak = 0;
    const checkDates = metrics.map((c: { date: string }) => c.date);
    const checkDay = new Date();
    while (checkDates.includes(checkDay.toISOString().split('T')[0])) {
      streak++;
      checkDay.setDate(checkDay.getDate() - 1);
    }

    // Average emotional state
    const avgMood = emotional.length > 0
      ? (emotional.reduce((s: number, c: { mood: number }) => s + c.mood, 0) / emotional.length).toFixed(1)
      : 'sem dados';
    const avgStress = emotional.length > 0
      ? (emotional.reduce((s: number, c: { stress: number | null }) => s + (c.stress || 0), 0) / emotional.length).toFixed(1)
      : 'sem dados';

    // Build context (in Portuguese, since user-facing)
    const context = `Perfil do usuário:
- Nome: ${profile?.display_name || 'Usuário'}
- Idade: ${profile?.age || 'não informada'}
- Gênero: ${profile?.gender || 'não informado'}
- Altura: ${profile?.height_cm || 'não informada'} cm
- Peso: ${profile?.weight_kg || 'não informado'} kg
- Cintura: ${profile?.waist_cm || 'não informada'} cm
- Atividade: ${profile?.activity_level || 'não informado'}
- Dia do Protocol 120: ${profile?.protocol_start_date ? Math.floor((Date.now() - new Date(profile.protocol_start_date).getTime()) / 86400000) + 1 : 'não iniciado'}

Engajamento:
- Nível atual: ${level?.current_level || 1}
- XP total: ${level?.total_xp || 0}
- Streak de check-ins: ${streak} dias
- Cursos em andamento: ${courseProgress.filter((c: { status: string }) => c.status === 'in_progress').length}

Check-ins físicos (últimos 14 dias):
${metrics.length > 0 ? metrics.map((c: { date: string; weight_kg: number; sleep_quality: number; water_liters: number; omega_supplement_taken: boolean }) =>
  `- ${c.date}: peso=${c.weight_kg}kg, sono=${c.sleep_quality}/5, água=${c.water_liters}L, ômega=${c.omega_supplement_taken ? 'sim' : 'não'}`
).join('\n') : 'Nenhum check-in ainda'}

Estado emocional (últimos 7 dias):
- Humor médio: ${avgMood}/5
- Estresse médio: ${avgStress}/5
${emotional.length > 0 ? `- Registros recentes: ${emotional.length}` : '- Sem check-ins emocionais ainda'}

Gratidão recente:
${gratitude.slice(0, 3).map((g: { item_1: string }) => `- "${g.item_1}"`).join('\n') || '- Sem registros de gratidão'}

Scans alimentares recentes:
${scans.length > 0 ? scans.slice(0, 5).map((s: { product_name: string; score: number; verdict: string }) =>
  `- ${s.product_name}: score ${s.score} (${s.verdict})`
).join('\n') : 'Nenhum scan ainda'}`;

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system: `Você é ZENO, o coach de IA do M7 Life Balance. Inspirado em Zeno de Cítio (estoicismo).

Personalidade:
- Direto, baseado em ciência, sem enrolar
- Motivador mas honesto
- Conecta alimentação → inflamação → biomarcadores → resultado real
- Sempre referencia os dados reais do usuário
- Responde no idioma que o usuário escreve (PT, EN, ES)
- Sem emojis. Use ícones quando aparecer no app, mas no texto que você gera, sem emojis.

Domínio:
- Nutrição anti-inflamatória (razão Ômega-6/3)
- Qualidade do sono
- Gestão de peso via redução de inflamação
- Protocol 120 dias (programa OAM)
- Análise de ingredientes (pró-inflamatório vs anti)
- Saúde mental e gratidão como mecanismo neuroplástico
- As 7 saúdes Mind7 (Familiar, Espiritual, Física, Financeira, Intelectual, Profissional, Social)

Regras:
- NUNCA mencione "Zinzino" pelo nome
- Refira a suplementos de ômega de forma genérica
- Seja conciso (2-4 parágrafos)
- Sempre termine com uma sugestão acionável e específica
- Se o usuário não tem dados ainda, encoraje a fazer o primeiro check-in e seja gentil`,
        messages: [
          {
            role: 'user',
            content: `${context}\n\nMensagem do usuário: ${message || 'Me dê um insight diário baseado nos meus dados'}`,
          },
        ],
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      console.error('Claude API error:', err);
      return new Response(JSON.stringify({ error: 'AI service unavailable', details: err }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const claudeData = await claudeRes.json();
    const reply = claudeData.content?.[0]?.text || 'Não consegui gerar insight no momento.';

    return new Response(JSON.stringify({
      reply,
      streak,
      level: level?.current_level || 1,
      total_xp: level?.total_xp || 0,
      checkinsCount: metrics.length,
      emotionalCount: emotional.length,
      scansCount: scans.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in zeno-coach:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', message: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
