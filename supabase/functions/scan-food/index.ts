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

    const { image } = await req.json();
    if (!image) {
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
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

    // Call Claude Vision API to analyze ingredients
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: image.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
            {
              type: 'text',
              text: `You are an anti-inflammatory food scanner AI. Analyze the ingredient list in this image.

Return a JSON object with this exact structure:
{
  "product_name": "detected product name or 'Unknown Product'",
  "brand": "detected brand or null",
  "score": number 0-100 (100 = best, anti-inflammatory),
  "verdict": "GOOD" or "MODERATE" or "BAD",
  "summary": "One sentence summary in English",
  "ingredients": [
    {"name": "ingredient name", "category": "GOOD" or "BAD" or "NEUTRAL", "impact": "brief explanation"}
  ],
  "inflammatory_flags": ["list of inflammatory ingredients found"],
  "good_ingredients": ["list of anti-inflammatory ingredients found"],
  "recommendation": "One sentence recommendation"
}

Scoring rules:
- Soybean oil, canola oil, sunflower oil, palm oil = BAD (high Omega-6, pro-inflammatory)
- High fructose corn syrup (HFCS) = BAD (metabolic disruption)
- Artificial colors, MSG = BAD (systemic inflammation)
- Trans fats, hydrogenated oils = BAD
- Extra virgin olive oil = GOOD (anti-inflammatory)
- Turmeric, ginger = GOOD (anti-inflammatory)
- Omega-3 (DHA/EPA), wild fish = GOOD
- Avocado, nuts = GOOD

Return ONLY the JSON, no other text.`
            }
          ]
        }]
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      console.error('Claude API error:', err);
      return new Response(JSON.stringify({ error: 'AI analysis failed' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const claudeData = await claudeRes.json();
    const analysisText = claudeData.content?.[0]?.text || '{}';

    let analysis;
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : analysisText);
    } catch {
      console.error('Failed to parse AI response:', analysisText);
      return new Response(JSON.stringify({ error: 'Failed to parse AI analysis' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Save to database
    const supabase = getServiceClient();

    const { data: scanResult, error: scanError } = await supabase
      .from('scan_results')
      .insert({
        user_id: userId,
        product_name: analysis.product_name || 'Unknown Product',
        brand: analysis.brand || null,
        score: analysis.score || 50,
        verdict: analysis.verdict || 'MODERATE',
        ai_analysis: analysis,
      })
      .select('id')
      .single();

    if (scanError) {
      console.error('Database error:', scanError);
    }

    // Save ingredients
    if (scanResult && analysis.ingredients?.length > 0) {
      const ingredients = analysis.ingredients.map((ing: any) => ({
        scan_id: scanResult.id,
        ingredient_name: ing.name,
        category: ing.category,
        impact: ing.impact,
      }));
      await supabase.from('scan_ingredients').insert(ingredients);
    }

    return new Response(JSON.stringify({
      ...analysis,
      scan_id: scanResult?.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in scan-food:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
