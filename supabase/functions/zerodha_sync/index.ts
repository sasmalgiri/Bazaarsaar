import { getUserClient, getServiceClient, corsHeaders } from '../_shared/supabase.ts';
import { decrypt } from '../_shared/crypto.ts';

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

    const serviceClient = getServiceClient();

    // Acquire sync lock
    const lockExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min lock
    const { error: lockError } = await serviceClient.from('sync_lock').upsert({
      user_id: user.id,
      locked_at: new Date().toISOString(),
      expires_at: lockExpiry,
    });

    if (lockError) {
      return new Response(JSON.stringify({ error: 'Sync already in progress' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
        return new Response(JSON.stringify({ error: 'No active broker connection' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check token expiry
      if (new Date(connection.token_expires_at) < new Date()) {
        await serviceClient.from('broker_connection').update({
          status: 'expired',
          updated_at: new Date().toISOString(),
        }).eq('id', connection.id);

        return new Response(JSON.stringify({ error: 'Token expired. Please reconnect Zerodha.' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Decrypt access token
      const accessToken = await decrypt(connection.encrypted_access_token);
      const apiKey = Deno.env.get('ZERODHA_API_KEY')!;

      // Create import job
      const { data: importJob } = await serviceClient.from('import_job').insert({
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
        await serviceClient.from('import_job').update({
          status: 'failed',
          error_message: ordersData.message || 'Failed to fetch orders',
          completed_at: new Date().toISOString(),
        }).eq('id', importJob!.id);

        return new Response(JSON.stringify({ error: 'Failed to fetch orders from Zerodha' }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const orders = ordersData.data || [];
      const completedOrders = orders.filter((o: Record<string, string>) => o.status === 'COMPLETE');

      let imported = 0;
      let skipped = 0;

      for (const order of completedOrders) {
        const { error: upsertError } = await serviceClient.from('trade').upsert({
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
        }, { onConflict: 'user_id,broker_order_id' });

        if (upsertError) {
          skipped++;
        } else {
          imported++;
        }
      }

      // Update import job
      await serviceClient.from('import_job').update({
        status: 'done',
        total_rows: completedOrders.length,
        imported_rows: imported,
        skipped_rows: skipped,
        completed_at: new Date().toISOString(),
      }).eq('id', importJob!.id);

      // Update last sync time
      await serviceClient.from('broker_connection').update({
        last_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', connection.id);

      // Log audit
      await serviceClient.from('audit_event').insert({
        user_id: user.id,
        action: 'broker_sync',
        detail: { broker: 'zerodha', imported, skipped, total: completedOrders.length },
      });

      return new Response(JSON.stringify({
        success: true,
        imported,
        skipped,
        total: completedOrders.length,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } finally {
      // Release sync lock
      await serviceClient.from('sync_lock').delete().eq('user_id', user.id);
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
