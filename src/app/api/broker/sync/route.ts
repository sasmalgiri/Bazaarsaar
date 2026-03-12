import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { decrypt } from '@/lib/crypto';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    // Clear any expired locks first
    await admin.from('sync_lock').delete()
      .eq('user_id', user.id)
      .lt('expires_at', new Date().toISOString());

    // Acquire sync lock — INSERT (not upsert) so it fails if lock exists
    const lockExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const { error: lockError } = await admin.from('sync_lock').insert({
      user_id: user.id,
      locked_at: new Date().toISOString(),
      expires_at: lockExpiry,
    });

    if (lockError) {
      return NextResponse.json({ error: 'Sync already in progress' }, { status: 409 });
    }

    try {
      // Get broker connection
      const { data: connection } = await supabase
        .from('broker_connection')
        .select('*')
        .eq('user_id', user.id)
        .eq('broker', 'zerodha')
        .single();

      if (!connection || connection.status !== 'active') {
        return NextResponse.json({ error: 'No active broker connection' }, { status: 400 });
      }

      // Check token expiry
      if (new Date(connection.token_expires_at) < new Date()) {
        await admin.from('broker_connection').update({
          status: 'expired',
          updated_at: new Date().toISOString(),
        }).eq('id', connection.id);

        return NextResponse.json({ error: 'Token expired. Please reconnect Zerodha.' }, { status: 401 });
      }

      // Decrypt access token
      const accessToken = decrypt(connection.encrypted_access_token);
      const apiKey = process.env.ZERODHA_API_KEY!;

      // Create import job
      const { data: importJob } = await admin.from('import_job').insert({
        user_id: user.id,
        source: 'zerodha_api',
        status: 'processing',
        started_at: new Date().toISOString(),
      }).select().single();

      // Fetch orders from Zerodha
      const ordersRes = await fetch('https://api.kite.trade/orders', {
        headers: {
          'X-Kite-Version': '3',
          'Authorization': `token ${apiKey}:${accessToken}`,
        },
      });

      const ordersData = await ordersRes.json();

      if (ordersData.status !== 'success') {
        await admin.from('import_job').update({
          status: 'failed',
          error_message: ordersData.message || 'Failed to fetch orders',
          completed_at: new Date().toISOString(),
        }).eq('id', importJob!.id);

        return NextResponse.json({ error: 'Failed to fetch orders from Zerodha' }, { status: 502 });
      }

      const orders = ordersData.data || [];
      const completedOrders = orders.filter((o: Record<string, string>) => o.status === 'COMPLETE');

      // Batch upsert in chunks of 500
      const BATCH_SIZE = 500;
      let imported = 0;
      let skipped = 0;

      for (let i = 0; i < completedOrders.length; i += BATCH_SIZE) {
        const chunk = completedOrders.slice(i, i + BATCH_SIZE);
        const records = chunk.map((order: Record<string, string | number>) => ({
          user_id: user.id,
          broker_connection_id: connection.id,
          import_job_id: importJob!.id,
          broker_order_id: order.order_id,
          symbol: order.tradingsymbol,
          exchange: order.exchange,
          segment: order.exchange === 'NSE' || order.exchange === 'BSE' ? 'EQ' : 'FO',
          side: order.transaction_type,
          quantity: order.quantity,
          price: order.average_price,
          order_type: order.order_type,
          status: 'CLOSED',
          traded_at: order.order_timestamp || order.exchange_timestamp,
          import_source: 'zerodha_api',
        }));

        const { error: upsertError, count } = await admin.from('trade').upsert(records, {
          onConflict: 'user_id,broker_order_id',
          count: 'exact',
        });

        if (upsertError) skipped += chunk.length;
        else imported += count ?? chunk.length;
      }

      // Update import job
      await admin.from('import_job').update({
        status: 'done',
        total_rows: completedOrders.length,
        imported_rows: imported,
        skipped_rows: skipped,
        completed_at: new Date().toISOString(),
      }).eq('id', importJob!.id);

      // Update last sync time
      await admin.from('broker_connection').update({
        last_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', connection.id);

      // Log audit
      await admin.from('audit_event').insert({
        user_id: user.id,
        action: 'broker_sync',
        detail: { broker: 'zerodha', imported, skipped, total: completedOrders.length },
      });

      return NextResponse.json({ success: true, imported, skipped, total: completedOrders.length });
    } finally {
      // Release sync lock
      await admin.from('sync_lock').delete().eq('user_id', user.id);
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
