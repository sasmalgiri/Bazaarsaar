import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const templateId = String(body?.template_id ?? '');
    if (!templateId) {
      return NextResponse.json({ error: 'Missing template_id' }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data: pt } = await admin
      .from('playbook_template')
      .select('*')
      .eq('id', templateId)
      .single();

    if (!pt) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
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
      return NextResponse.json({ error: 'Failed to create playbook' }, { status: 500 });
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

    return NextResponse.json({ ok: true, playbook_id: playbookId });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
