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
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message } = await req.json();
    const supabase = getServiceClient();

    // Gather user context
    const [profileRes, checkinsRes, scansRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('daily_checkins').select('*').eq('user_id', userId).order('check_date', { ascending: false }).limit(14),
      supabase.from('scan_results').select('product_name, score, verdict, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
    ]);

    const profile = profileRes.data;
    const checkins = checkinsRes.data || [];
    const scans = scansRes.data || [];

    // Calculate streak
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const checkDates = checkins.map((c: any) => c.check_date);
    let checkDay = new Date();
    while (checkDates.includes(checkDay.toISOString().split('T')[0])) {
      streak++;
      checkDay.setDate(checkDay.getDate() - 1);
    }

    // Build context
    const context = `User Profile:
- Name: ${profile?.display_name || 'User'}
- Age: ${profile?.age || 'unknown'}
- Gender: ${profile?.gender || 'unknown'}
- Height: ${profile?.height_cm || 'unknown'} cm
- Weight: ${profile?.weight_kg || 'unknown'} kg
- Waist: ${profile?.waist_cm || 'unknown'} cm
- Activity: ${profile?.activity_level || 'unknown'}
- Protocol day: ${profile?.protocol_start_date ? Math.floor((Date.now() - new Date(profile.protocol_start_date).getTime()) / 86400000) + 1 : 'not started'}

Recent Check-ins (last 14 days):
${checkins.length > 0 ? checkins.map((c: any) => `- ${c.check_date}: weight=${c.weight}kg, sleep=${c.sleep_quality}/5, water=${c.water_liters}L, omega=${c.took_omega ? 'yes' : 'no'}`).join('\n') : 'No check-ins yet'}

Current streak: ${streak} days

Recent Food Scans:
${scans.length > 0 ? scans.map((s: any) => `- ${s.product_name}: score ${s.score} (${s.verdict})`).join('\n') : 'No scans yet'}`;

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are ZENO, an AI wellness coach inside the Life Balance app. Your name is inspired by Zeno of Citium (Stoicism).

Your personality:
- Direct, science-based, no BS
- Motivating but honest
- Connect food → inflammation → real health data
- Reference the user's actual data when giving advice
- Use emojis sparingly for encouragement
- Respond in the same language the user writes in (Portuguese, English, or Spanish)

Your expertise:
- Anti-inflammatory nutrition (Omega-3/6 ratio)
- Sleep quality optimization
- Weight management through inflammation reduction
- Protocol 120 days (wellness transformation program)
- Food ingredient analysis (inflammatory vs anti-inflammatory)

Rules:
- Never mention "Zinzino" by name
- Refer to omega supplements generically
- Be concise (2-4 paragraphs max)
- Always end with a specific, actionable suggestion`,
        messages: [
          {
            role: 'user',
            content: `${context}\n\nUser message: ${message || 'Give me a daily insight based on my data'}`,
          },
        ],
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      console.error('Claude API error:', err);
      return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const claudeData = await claudeRes.json();
    const reply = claudeData.content?.[0]?.text || 'Unable to generate insight right now.';

    return new Response(JSON.stringify({ reply, streak, checkinsCount: checkins.length, scansCount: scans.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in zeno-coach:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
