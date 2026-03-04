import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { encrypt } from '@/lib/crypto';
import { createHash } from 'crypto';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { request_token, state } = await req.json();
    if (!request_token || !state) {
      return NextResponse.json({ error: 'Missing request_token or state' }, { status: 400 });
    }

    // Verify CSRF state
    const { data: oauthState } = await supabase
      .from('oauth_state')
      .select('*')
      .eq('state', state)
      .eq('user_id', user.id)
      .single();

    if (!oauthState || new Date(oauthState.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired state' }, { status: 400 });
    }

    // Clean up used state
    await supabase.from('oauth_state').delete().eq('state', state);

    // Exchange request_token for access_token
    const apiKey = process.env.ZERODHA_API_KEY!;
    const apiSecret = process.env.ZERODHA_API_SECRET!;

    // Generate checksum: SHA-256(api_key + request_token + api_secret)
    const checksum = createHash('sha256')
      .update(apiKey + request_token + apiSecret)
      .digest('hex');

    const tokenResponse = await fetch('https://api.kite.trade/session/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        api_key: apiKey,
        request_token,
        checksum,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.status !== 'success') {
      return NextResponse.json({ error: tokenData.message || 'Token exchange failed' }, { status: 400 });
    }

    const accessToken = tokenData.data.access_token;
    const admin = createAdminClient();
    const encryptedToken = encrypt(accessToken);

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

    await admin.from('broker_connection').upsert({
      user_id: user.id,
      broker: 'zerodha',
      status: 'active',
      encrypted_access_token: encryptedToken,
      token_expires_at: tokenExpiresAt,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,broker' });

    // Log audit event
    await admin.from('audit_event').insert({
      user_id: user.id,
      action: 'broker_connected',
      detail: { broker: 'zerodha' },
    });

    return NextResponse.json({ success: true, expires_at: tokenExpiresAt });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
