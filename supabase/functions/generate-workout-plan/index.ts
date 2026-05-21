import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { getServiceClient, getUserFromRequest, corsHeaders } from '../_shared/supabase-client.ts';
import { callAI, getProvider } from '../_shared/ai-provider.ts';

interface WizardData {
  objective: string;
  current_weight?: number;
  current_body_fat?: number;
  target_weight?: number;
  target_body_fat?: number;
  deadline_days?: number;
  workouts_per_week?: number;
  experience_level?: 'beginner' | 'intermediate' | 'advanced';
  equipment?: 'gym' | 'home' | 'outdoor' | 'hybrid';
}

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

    if (!getProvider()) {
      return new Response(JSON.stringify({
        error: 'AI service not configured. Add GEMINI_API_KEY (free) or ANTHROPIC_API_KEY (paid) to Supabase secrets.',
        fallback_plan: defaultFallbackPlan(),
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const wizardData: WizardData = await req.json();
    const supabase = getServiceClient();

    const profileRes = await supabase.from('profiles').select('age, gender, height_cm, activity_level').eq('id', userId).maybeSingle();
    const profile = profileRes.data;

    const prompt = `Você é um personal trainer certificado pela NSCA, especialista em treino baseado em ciência.

Gere um plano de treino estruturado de 1 semana baseado nos dados:

PERFIL:
- Idade: ${profile?.age || 'não informada'}
- Gênero: ${profile?.gender || 'não informado'}
- Altura: ${profile?.height_cm || 'não informada'} cm
- Nível de atividade atual: ${profile?.activity_level || 'não informado'}

OBJETIVO: ${wizardData.objective}
- Peso atual: ${wizardData.current_weight || 'não informado'} kg
- BF% atual: ${wizardData.current_body_fat || 'não informado'}%
- Peso alvo: ${wizardData.target_weight || 'não informado'} kg
- BF% alvo: ${wizardData.target_body_fat || 'não informado'}%
- Prazo: ${wizardData.deadline_days || 90} dias

PARÂMETROS:
- Treinos por semana: ${wizardData.workouts_per_week || 3}
- Nível: ${wizardData.experience_level || 'beginner'}
- Equipamento: ${wizardData.equipment || 'gym'}

Retorne EXATAMENTE em JSON com a estrutura abaixo. Sem texto antes ou depois. Sem markdown. Apenas JSON puro:

{
  "name_pt": "Plano de [objetivo] - [nível]",
  "weekly_summary_pt": "Resumo motivacional curto de 1-2 frases sobre o foco do plano",
  "weekly_calorie_target": número estimado de kcal a queimar semanalmente,
  "days": [
    {
      "day_of_week": "monday|tuesday|...",
      "name_pt": "Nome do treino (ex: Peito & Tríceps)",
      "focus_pt": "Foco em uma frase",
      "duration_minutes": número,
      "estimated_calories": número,
      "exercises": [
        {
          "name_pt": "Nome do exercício",
          "sets": número,
          "reps": "string (ex: 8-12 ou 30s)",
          "rest_seconds": número,
          "suggested_weight_pt": "string (ex: 60-70% 1RM ou peso corporal)",
          "how_to_pt": "Como executar em 1 frase",
          "muscle_groups": ["array de músculos primários"]
        }
      ]
    }
  ],
  "zeno_tip_pt": "Dica final do ZENO em 1-2 frases sobre como maximizar resultado, conectando treino com nutrição anti-inflamatória"
}

Considere os princípios:
- Iniciantes: 3x/semana full-body, exercícios compostos, foco em forma
- Intermediários: split ABC ou push/pull/legs
- Avançados: split mais granular, periodização
- Sempre inclua aquecimento implícito no primeiro exercício
- Se equipamento=home: usar peso corporal + bandas
- Se equipamento=outdoor: caminhada/corrida + bodyweight
- Retorne entre 3 e 5 exercícios por dia
- Sem emojis em nenhum campo`;

    const aiResult = await callAI({
      system: 'Você é um personal trainer NSCA certificado. Retorne sempre JSON puro, sem markdown, sem texto extra.',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000,
      model_tier: 'best',
      json_mode: true,
    });

    if (aiResult.error) {
      return new Response(JSON.stringify({
        error: 'AI service unavailable',
        details: aiResult.error,
        fallback_plan: defaultFallbackPlan(),
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let plan;
    try {
      const cleaned = aiResult.text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      plan = JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse AI JSON:', e, aiResult.text);
      return new Response(JSON.stringify({
        error: 'AI returned invalid JSON',
        raw: aiResult.text,
        fallback_plan: defaultFallbackPlan(),
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabase.from('workout_plans').update({ is_active: false }).eq('user_id', userId).eq('is_active', true);

    const { data: saved } = await supabase
      .from('workout_plans')
      .insert({
        user_id: userId,
        objective: wizardData.objective,
        current_weight: wizardData.current_weight,
        current_body_fat: wizardData.current_body_fat,
        target_weight: wizardData.target_weight,
        target_body_fat: wizardData.target_body_fat,
        deadline_days: wizardData.deadline_days,
        workouts_per_week: wizardData.workouts_per_week || 3,
        experience_level: wizardData.experience_level || 'beginner',
        equipment: wizardData.equipment || 'gym',
        plan_json: plan,
        generated_by: aiResult.provider,
      })
      .select()
      .maybeSingle();

    return new Response(JSON.stringify({
      plan, saved, provider: aiResult.provider, model_used: aiResult.model_used,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in generate-workout-plan:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', message: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function defaultFallbackPlan() {
  return {
    name_pt: 'Plano padrão (sem IA)',
    weekly_summary_pt: 'Plano genérico full-body para 3x na semana. Configure GEMINI_API_KEY pra personalização real.',
    weekly_calorie_target: 1500,
    days: [
      {
        day_of_week: 'monday',
        name_pt: 'Full Body A',
        focus_pt: 'Movimentos compostos, foco em força base',
        duration_minutes: 45,
        estimated_calories: 350,
        exercises: [
          { name_pt: 'Agachamento livre', sets: 3, reps: '8-12', rest_seconds: 90, suggested_weight_pt: 'Peso corporal ou moderado', how_to_pt: 'Pés ao nível dos ombros, descer até paralelo, peito ereto', muscle_groups: ['quadríceps', 'glúteos'] },
          { name_pt: 'Supino reto', sets: 3, reps: '8-12', rest_seconds: 90, suggested_weight_pt: '60-70% 1RM', how_to_pt: 'Escápula retraída, descer barra ao peito controlado', muscle_groups: ['peito', 'tríceps'] },
          { name_pt: 'Remada curvada', sets: 3, reps: '8-12', rest_seconds: 90, suggested_weight_pt: 'Moderado', how_to_pt: 'Tronco a 45°, puxar barra ao abdômen', muscle_groups: ['costas', 'bíceps'] },
        ],
      },
    ],
    zeno_tip_pt: 'Configure GEMINI_API_KEY (grátis) ou ANTHROPIC_API_KEY (pago) pra plano personalizado.',
  };
}
