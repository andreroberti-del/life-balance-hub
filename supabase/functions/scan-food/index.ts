import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { getServiceClient, getUserFromRequest, corsHeaders } from '../_shared/supabase-client.ts';
import { callAIWithQuota, getProvider } from '../_shared/ai-provider.ts';

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

    if (!getProvider()) {
      return new Response(JSON.stringify({
        error: 'AI service not configured. Add GEMINI_API_KEY (free) or ANTHROPIC_API_KEY (paid) to Supabase secrets.',
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cleanImage = image.replace(/^data:image\/\w+;base64,/, '');
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';
    const supabase = getServiceClient();

    const aiResult = await callAIWithQuota('scan-food', userId, {
      system: 'You are an anti-inflammatory food scanner AI. You analyze ingredient lists from product packaging and return structured JSON analysis.',
      messages: [{
        role: 'user',
        content: `Analyze the ingredient list in this product image.

Return a JSON object with this exact structure:
{
  "product_name": "detected product name or 'Unknown Product'",
  "brand": "detected brand or null",
  "score": number 0-100 (100 = best, anti-inflammatory),
  "verdict": "GOOD" or "MODERATE" or "BAD",
  "summary": "One sentence summary in Portuguese",
  "ingredients": [
    {"name": "ingredient name", "category": "GOOD" or "BAD" or "NEUTRAL", "impact": "brief explanation in Portuguese"}
  ],
  "inflammatory_flags": ["list of inflammatory ingredients found"],
  "good_ingredients": ["list of anti-inflammatory ingredients found"],
  "recommendation": "One sentence recommendation in Portuguese"
}

Scoring rules:
- Soybean oil, canola oil, sunflower oil, palm oil = BAD (high Omega-6, pro-inflammatory)
- High fructose corn syrup (HFCS), corn syrup, glucose-fructose = BAD (metabolic disruption)
- Artificial colors (Red 40, Yellow 5, etc.), MSG = BAD (systemic inflammation)
- Trans fats, hydrogenated oils, partially hydrogenated = BAD
- Sodium nitrite, sodium nitrate (processed meat) = BAD
- Extra virgin olive oil = GOOD (anti-inflammatory)
- Turmeric, ginger, garlic = GOOD (anti-inflammatory)
- Omega-3 (DHA/EPA), wild fish, flaxseed = GOOD
- Avocado, nuts, seeds = GOOD
- Whole grains, legumes = GOOD

Return ONLY the JSON, no markdown, no other text.`,
      }],
      image: { type: 'image', mime_type: mimeType, data: cleanImage },
      max_tokens: 2000,
      model_tier: 'best',
      json_mode: true,
    }, supabase);

    if (aiResult.quota_blocked) {
      return new Response(JSON.stringify({
        error: aiResult.quota_reason || 'Limite diário de scans atingido.',
        quota_blocked: true,
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (aiResult.error) {
      return new Response(JSON.stringify({ error: 'AI analysis failed', details: aiResult.error }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let analysis;
    try {
      const jsonMatch = aiResult.text.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : aiResult.text);
    } catch {
      console.error('Failed to parse AI response:', aiResult.text);
      return new Response(JSON.stringify({ error: 'Failed to parse AI analysis', raw: aiResult.text }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: scanResult, error: scanError } = await supabase
      .from('scans')
      .insert({
        user_id: userId,
        product_name: analysis.product_name || 'Unknown Product',
        brand: analysis.brand || null,
        score: analysis.score || 50,
        verdict: analysis.verdict || 'MODERATE',
        ai_analysis: analysis,
      })
      .select('id')
      .maybeSingle();

    if (scanError) {
      console.error('Database error:', scanError);
    }

    return new Response(JSON.stringify({
      ...analysis,
      scan_id: scanResult?.id,
      provider: aiResult.provider,
      model_used: aiResult.model_used,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in scan-food:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', message: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
