import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: connection } = await supabase
      .from('broker_connection')
      .select('status, token_expires_at, last_sync_at')
      .eq('user_id', user.id)
      .eq('broker', 'zerodha')
      .single();

    if (!connection) {
      return NextResponse.json({ connected: false, status: 'disconnected' });
    }

    const isExpired = new Date(connection.token_expires_at) < new Date();
    const effectiveStatus = isExpired ? 'expired' : connection.status;

    return NextResponse.json({
      connected: effectiveStatus === 'active',
      status: effectiveStatus,
      expires_at: connection.token_expires_at,
      last_sync_at: connection.last_sync_at,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
