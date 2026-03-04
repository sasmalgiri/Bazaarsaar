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
    const templateId = String(body?.template_id ?? '');
    if (!templateId) {
      return new Response(JSON.stringify({ error: 'Missing template_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = getServiceClient();

    const { data: pt } = await admin
      .from('playbook_template')
      .select('*')
      .eq('id', templateId)
      .single();

    if (!pt) {
      return new Response(JSON.stringify({ error: 'Template not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: up } = await admin.from('user_playbook').insert({
      user_id: user.id,
      template_id: pt.id,
      title: pt.title,
      description: pt.description,
      market: pt.market,
      level: pt.level,
    }).select('id').single();

    if (!up) {
      return new Response(JSON.stringify({ error: 'Failed to create playbook' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const playbookId = up.id as string;

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

    return new Response(JSON.stringify({ ok: true, playbook_id: playbookId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
