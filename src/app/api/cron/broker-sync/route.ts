import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { decrypt } from '@/lib/crypto';

/**
 * Cron: auto-sync trades for all active broker connections.
 * Runs weekdays at 16:00 UTC (9:30 PM IST — after market close).
 * Uses Kite Connect /orders endpoint (today's completed orders).
 * Idempotent via upsert on user_id + broker_order_id.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
    const apiKey = process.env.ZERODHA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ZERODHA_API_KEY not configured' }, { status: 500 });
    }

    // Find all active connections with non-expired tokens
    const { data: connections } = await admin
      .from('broker_connection')
      .select('id, user_id, encrypted_access_token, token_expires_at')
      .eq('status', 'active')
      .eq('broker', 'zerodha')
      .gt('token_expires_at', new Date().toISOString());

    if (!connections || connections.length === 0) {
      return NextResponse.json({ ok: true, message: 'No active connections', synced: 0 });
    }

    let synced = 0;
    let failed = 0;

    for (const conn of connections) {
      try {
        // Check sync lock — skip if locked
        const { data: lock } = await admin
          .from('sync_lock')
          .select('expires_at')
          .eq('user_id', conn.user_id)
          .single();

        if (lock && new Date(lock.expires_at) > new Date()) continue;

        // Acquire lock
        await admin.from('sync_lock').upsert({
          user_id: conn.user_id,
          locked_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
        });

        try {
          const accessToken = decrypt(conn.encrypted_access_token);

          const ordersRes = await fetch('https://api.kite.trade/orders', {
            headers: {
              'X-Kite-Version': '3',
              'Authorization': `token ${apiKey}:${accessToken}`,
            },
          });

          const ordersData = await ordersRes.json();
          if (ordersData.status !== 'success') {
            failed++;
            continue;
          }

          const completedOrders = (ordersData.data || []).filter(
            (o: Record<string, string>) => o.status === 'COMPLETE'
          );

          if (completedOrders.length === 0) {
            synced++;
            continue;
          }

          // Create import job
          const { data: importJob } = await admin.from('import_job').insert({
            user_id: conn.user_id,
            source: 'zerodha_api',
            status: 'processing',
            started_at: new Date().toISOString(),
          }).select().single();

          // Batch upsert
          const records = completedOrders.map((order: Record<string, string | number>) => ({
            user_id: conn.user_id,
            broker_connection_id: conn.id,
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

          const { count } = await admin.from('trade').upsert(records, {
            onConflict: 'user_id,broker_order_id',
            count: 'exact',
          });

          await admin.from('import_job').update({
            status: 'done',
            total_rows: completedOrders.length,
            imported_rows: count ?? completedOrders.length,
            completed_at: new Date().toISOString(),
          }).eq('id', importJob!.id);

          await admin.from('broker_connection').update({
            last_sync_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }).eq('id', conn.id);

          await admin.from('audit_event').insert({
            user_id: conn.user_id,
            action: 'auto_broker_sync',
            detail: { broker: 'zerodha', imported: count ?? completedOrders.length },
          });

          synced++;
        } finally {
          await admin.from('sync_lock').delete().eq('user_id', conn.user_id);
        }
      } catch {
        failed++;
      }
    }

    return NextResponse.json({ ok: true, synced, failed, total: connections.length });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
