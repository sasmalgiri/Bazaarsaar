import { getUserClient, getServiceClient, corsHeaders } from '../_shared/supabase.ts';
import { encrypt } from '../_shared/crypto.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = getUserClient(authHeader);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { request_token, state } = await req.json();
    if (!request_token || !state) {
      return new Response(JSON.stringify({ error: 'Missing request_token or state' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify CSRF state
    const { data: oauthState } = await supabase
      .from('oauth_state')
      .select('*')
      .eq('state', state)
      .eq('user_id', user.id)
      .single();

    if (!oauthState || new Date(oauthState.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'Invalid or expired state' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Clean up used state
    await supabase.from('oauth_state').delete().eq('state', state);

    // Exchange request_token for access_token
    const apiKey = Deno.env.get('ZERODHA_API_KEY')!;
    const apiSecret = Deno.env.get('ZERODHA_API_SECRET')!;

    // Generate checksum: SHA-256(api_key + request_token + api_secret)
    const checksumInput = new TextEncoder().encode(apiKey + request_token + apiSecret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', checksumInput);
    const checksum = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    const tokenResponse = await fetch('https://api.kite.trade/session/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        api_key: apiKey,
        request_token: request_token,
        checksum: checksum,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.status !== 'success') {
      return new Response(JSON.stringify({ error: tokenData.message || 'Token exchange failed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const accessToken = tokenData.data.access_token;

    // Encrypt and store the token (use service client for upsert)
    const serviceClient = getServiceClient();
    const encryptedToken = await encrypt(accessToken);

    // Zerodha tokens expire at 6 AM IST next day
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);
    const nextSixAM = new Date(istNow);
    nextSixAM.setHours(6, 0, 0, 0);
    if (istNow.getHours() >= 6) {
      nextSixAM.setDate(nextSixAM.getDate() + 1);
    }
    const tokenExpiresAt = new Date(nextSixAM.getTime() - istOffset).toISOString();

    await serviceClient.from('broker_connection').upsert({
      user_id: user.id,
      broker: 'zerodha',
      status: 'active',
      encrypted_access_token: encryptedToken,
      token_expires_at: tokenExpiresAt,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,broker' });

    // Log audit event
    await serviceClient.from('audit_event').insert({
      user_id: user.id,
      action: 'broker_connected',
      detail: { broker: 'zerodha' },
    });

    return new Response(JSON.stringify({ success: true, expires_at: tokenExpiresAt }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
