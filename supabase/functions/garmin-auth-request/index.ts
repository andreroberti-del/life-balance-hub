import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { generateOAuthHeader, GARMIN_API } from '../_shared/garmin-oauth.ts';
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

    const consumerKey = Deno.env.get('GARMIN_CONSUMER_KEY')!;
    const consumerSecret = Deno.env.get('GARMIN_CONSUMER_SECRET')!;
    const appUrl = Deno.env.get('APP_URL') || 'http://localhost:5173';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const callbackUrl = `${supabaseUrl}/functions/v1/garmin-auth-callback`;

    // Step 1: Get request token from Garmin
    const authHeader = await generateOAuthHeader(
      'POST',
      GARMIN_API.REQUEST_TOKEN,
      { consumerKey, consumerSecret },
      { oauth_callback: callbackUrl }
    );

    const response = await fetch(GARMIN_API.REQUEST_TOKEN, {
      method: 'POST',
      headers: { Authorization: authHeader },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Garmin request token failed:', body);
      return new Response(JSON.stringify({ error: 'Failed to get request token from Garmin' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await response.text();
    const params = new URLSearchParams(body);
    const oauthToken = params.get('oauth_token')!;
    const oauthTokenSecret = params.get('oauth_token_secret')!;

    // Step 2: Store oauth state
    const supabase = getServiceClient();
    await supabase.from('garmin_oauth_states').insert({
      oauth_token: oauthToken,
      oauth_token_secret: oauthTokenSecret,
      user_id: userId,
    });

    // Step 3: Return authorization URL
    const authorizationUrl = `${GARMIN_API.AUTHORIZE}?oauth_token=${oauthToken}`;

    return new Response(JSON.stringify({ authorizationUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in garmin-auth-request:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
