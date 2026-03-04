import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.ZERODHA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Zerodha API key not configured' }, { status: 500 });
    }

    // Generate CSRF state
    const state = randomBytes(32).toString('hex');

    // Store state with 10-minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await supabase.from('oauth_state').insert({
      state,
      user_id: user.id,
      expires_at: expiresAt,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bazaarsaar.com';
    const redirectUrl = `${appUrl}/auth/zerodha/callback`;
    const loginUrl = `https://kite.zerodha.com/connect/login?v=3&api_key=${apiKey}&redirect_url=${encodeURIComponent(redirectUrl)}&state=${state}`;

    return NextResponse.json({ url: loginUrl, state });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
