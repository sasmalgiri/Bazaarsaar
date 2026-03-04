import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Cron: mark broker connections as expired when tokens have passed expiry.
 * Runs daily at 00:30 UTC (6:00 AM IST — when Zerodha tokens expire).
 */
export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin = createAdminClient();

    // Find active connections with expired tokens
    const { data: expired } = await admin
      .from('broker_connection')
      .select('id, user_id')
      .eq('status', 'active')
      .lt('token_expires_at', new Date().toISOString());

    if (!expired || expired.length === 0) {
      return NextResponse.json({ ok: true, message: 'No expired connections', updated: 0 });
    }

    const ids = expired.map((c: { id: string }) => c.id);

    await admin
      .from('broker_connection')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .in('id', ids);

    return NextResponse.json({ ok: true, updated: ids.length });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
