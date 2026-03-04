import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all user data in correct order (respecting FK constraints)
    // RLS ensures only own data is deleted
    await supabase.from('journal_entry_tag').delete().filter(
      'journal_entry_id', 'in',
      `(select id from journal_entry where user_id = '${user.id}')`
    );
    await supabase.from('attachment').delete().eq('user_id', user.id);
    await supabase.from('journal_entry').delete().eq('user_id', user.id);
    await supabase.from('weekly_report').delete().eq('user_id', user.id);
    await supabase.from('position_snapshot').delete().eq('user_id', user.id);
    await supabase.from('trade').delete().eq('user_id', user.id);
    await supabase.from('import_job').delete().eq('user_id', user.id);
    await supabase.from('sync_lock').delete().eq('user_id', user.id);
    await supabase.from('oauth_state').delete().eq('user_id', user.id);
    await supabase.from('broker_connection').delete().eq('user_id', user.id);
    await supabase.from('tag_def').delete().eq('user_id', user.id);
    await supabase.from('consent_log').delete().eq('user_id', user.id);
    await supabase.from('audit_event').delete().eq('user_id', user.id);
    await supabase.from('user_settings').delete().eq('user_id', user.id);
    await supabase.from('app_user').delete().eq('id', user.id);

    // Log final audit before deletion (may fail after app_user deleted, that's ok)
    // Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json({ success: true, message: 'Account and all data deleted' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
