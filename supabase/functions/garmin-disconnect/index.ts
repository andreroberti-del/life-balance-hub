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

    const supabase = getServiceClient();
    const consumerKey = Deno.env.get('GARMIN_CONSUMER_KEY')!;
    const consumerSecret = Deno.env.get('GARMIN_CONSUMER_SECRET')!;

    // Get current connection
    const { data: connection } = await supabase
      .from('garmin_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (connection) {
      // Deregister with Garmin
      try {
        const authHeader = await generateOAuthHeader(
          'DELETE',
          GARMIN_API.DEREGISTRATION,
          {
            consumerKey,
            consumerSecret,
            token: connection.access_token,
            tokenSecret: connection.access_token_secret,
          }
        );
        await fetch(GARMIN_API.DEREGISTRATION, {
          method: 'DELETE',
          headers: { Authorization: authHeader },
        });
      } catch (e) {
        console.warn('Garmin deregistration failed (non-blocking):', e);
      }

      // Soft-delete connection
      await supabase.from('garmin_connections').update({
        is_active: false,
        disconnected_at: new Date().toISOString(),
      }).eq('user_id', userId);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in garmin-disconnect:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
