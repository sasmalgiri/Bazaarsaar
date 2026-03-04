import { getUserClient, getServiceClient, corsHeaders } from '../_shared/supabase.ts';

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

    const body = await req.json().catch(() => ({}));
    const market = String(body?.market ?? '');
    const style = String(body?.style ?? '');
    const risk = String(body?.risk ?? '');

    if (!['EQ', 'FNO'].includes(market)) {
      return new Response(JSON.stringify({ error: 'Invalid market. Must be EQ or FNO.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!['INTRADAY', 'SWING', 'LONGTERM'].includes(style)) {
      return new Response(JSON.stringify({ error: 'Invalid style.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!['LOW', 'MEDIUM', 'HIGH'].includes(risk)) {
      return new Response(JSON.stringify({ error: 'Invalid risk.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = getServiceClient();

    // Upsert guided profile
    await admin.from('guided_profile').upsert({
      user_id: user.id,
      market,
      style,
      risk,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    // Create default watchlist if not exists
    const { data: wl } = await admin.from('watchlist').insert({
      user_id: user.id,
      name: 'My Watchlist',
    }).select('id').maybeSingle();

    // Seed default tags (process-only)
    const defaultTags = [
      { tag_type: 'setup', label: 'breakout' },
      { tag_type: 'setup', label: 'mean_reversion' },
      { tag_type: 'emotion', label: 'calm' },
      { tag_type: 'emotion', label: 'fomo' },
      { tag_type: 'mistake', label: 'overtrading' },
      { tag_type: 'mistake', label: 'late_entry' },
      { tag_type: 'rule', label: 'followed_plan' },
    ];

    for (const t of defaultTags) {
      await admin.from('tag_def').upsert(
        { user_id: user.id, ...t, color: '#22c55e' },
        { onConflict: 'user_id,tag_type,label' }
      );
    }

    // Copy playbook templates: all BEGINNER + (if FNO) PRO
    const orFilter = market === 'FNO' ? 'level.eq.BEGINNER,level.eq.PRO' : 'level.eq.BEGINNER';
    const { data: templates } = await admin
      .from('playbook_template')
      .select('id,title,description,market,level')
      .or(orFilter);

    const createdPlaybooks: string[] = [];

    for (const pt of (templates ?? [])) {
      // Skip FNO templates if user chose EQ
      if (pt.market === 'FNO' && market !== 'FNO') continue;

      const { data: up } = await admin.from('user_playbook').insert({
        user_id: user.id,
        template_id: pt.id,
        title: pt.title,
        description: pt.description,
        market: pt.market,
        level: pt.level,
      }).select('id').single();

      if (!up) continue;
      const playbookId = up.id as string;
      createdPlaybooks.push(playbookId);

      const { data: steps } = await admin
        .from('playbook_template_step')
        .select('step_order,category,step_text,required')
        .eq('template_id', pt.id)
        .order('step_order');

      if (steps?.length) {
        await admin.from('user_playbook_step').insert(
          steps.map((s: Record<string, unknown>) => ({ playbook_id: playbookId, ...s })),
        );
      }
    }

    // Audit event
    await admin.from('audit_event').insert({
      user_id: user.id,
      action: 'guided_setup_applied',
      detail: { market, style, risk, playbooks: createdPlaybooks.length },
    });

    return new Response(JSON.stringify({
      ok: true,
      playbooks_created: createdPlaybooks.length,
      watchlist_created: !!wl?.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
