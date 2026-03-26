import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { generateOAuthHeader, GARMIN_API } from '../_shared/garmin-oauth.ts';
import { getServiceClient, corsHeaders } from '../_shared/supabase-client.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const oauthToken = url.searchParams.get('oauth_token');
    const oauthVerifier = url.searchParams.get('oauth_verifier');

    if (!oauthToken || !oauthVerifier) {
      return new Response('Missing oauth_token or oauth_verifier', { status: 400 });
    }

    const consumerKey = Deno.env.get('GARMIN_CONSUMER_KEY')!;
    const consumerSecret = Deno.env.get('GARMIN_CONSUMER_SECRET')!;
    const appUrl = Deno.env.get('APP_URL') || 'http://localhost:5173';

    // Step 1: Retrieve stored state
    const supabase = getServiceClient();
    const { data: state, error: stateError } = await supabase
      .from('garmin_oauth_states')
      .select('*')
      .eq('oauth_token', oauthToken)
      .single();

    if (stateError || !state) {
      console.error('OAuth state not found:', stateError);
      return Response.redirect(`${appUrl}/profile?garmin=error&reason=state_not_found`, 302);
    }

    // Step 2: Exchange for access token
    const authHeader = await generateOAuthHeader(
      'POST',
      GARMIN_API.ACCESS_TOKEN,
      {
        consumerKey,
        consumerSecret,
        token: oauthToken,
        tokenSecret: state.oauth_token_secret,
        verifier: oauthVerifier,
      }
    );

    const response = await fetch(GARMIN_API.ACCESS_TOKEN, {
      method: 'POST',
      headers: { Authorization: authHeader },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Garmin access token exchange failed:', body);
      return Response.redirect(`${appUrl}/profile?garmin=error&reason=token_exchange_failed`, 302);
    }

    const body = await response.text();
    const params = new URLSearchParams(body);
    const accessToken = params.get('oauth_token')!;
    const accessTokenSecret = params.get('oauth_token_secret')!;

    // Step 3: Get Garmin user ID
    let garminUserId: string | null = null;
    try {
      const userIdHeader = await generateOAuthHeader(
        'GET',
        GARMIN_API.USER_ID,
        { consumerKey, consumerSecret, token: accessToken, tokenSecret: accessTokenSecret }
      );
      const userIdRes = await fetch(GARMIN_API.USER_ID, {
        headers: { Authorization: userIdHeader },
      });
      if (userIdRes.ok) {
        const userData = await userIdRes.json();
        garminUserId = userData.userId || null;
      }
    } catch (e) {
      console.warn('Could not fetch Garmin user ID:', e);
    }

    // Step 4: Store connection (upsert)
    await supabase.from('garmin_connections').upsert(
      {
        user_id: state.user_id,
        garmin_user_id: garminUserId,
        access_token: accessToken,
        access_token_secret: accessTokenSecret,
        is_active: true,
        connected_at: new Date().toISOString(),
        disconnected_at: null,
      },
      { onConflict: 'user_id' }
    );

    // Step 5: Clean up oauth state
    await supabase.from('garmin_oauth_states').delete().eq('oauth_token', oauthToken);

    // Step 6: Trigger backfill for last 7 days (async, non-blocking)
    const sevenDaysAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
    const now = Math.floor(Date.now() / 1000);
    const backfillEndpoints = [
      GARMIN_API.BACKFILL_DAILIES,
      GARMIN_API.BACKFILL_SLEEP,
      GARMIN_API.BACKFILL_STRESS,
    ];

    for (const endpoint of backfillEndpoints) {
      try {
        const backfillUrl = `${endpoint}?summaryStartTimeInSeconds=${sevenDaysAgo}&summaryEndTimeInSeconds=${now}`;
        const backfillHeader = await generateOAuthHeader(
          'GET',
          endpoint,
          { consumerKey, consumerSecret, token: accessToken, tokenSecret: accessTokenSecret },
          {
            summaryStartTimeInSeconds: sevenDaysAgo.toString(),
            summaryEndTimeInSeconds: now.toString(),
          }
        );
        await fetch(backfillUrl, { headers: { Authorization: backfillHeader } });
      } catch (e) {
        console.warn('Backfill request failed for', endpoint, e);
      }
    }

    // Step 7: Redirect to app
    return Response.redirect(`${appUrl}/profile?garmin=connected`, 302);
  } catch (err) {
    console.error('Error in garmin-auth-callback:', err);
    const appUrl = Deno.env.get('APP_URL') || 'http://localhost:5173';
    return Response.redirect(`${appUrl}/profile?garmin=error`, 302);
  }
});
