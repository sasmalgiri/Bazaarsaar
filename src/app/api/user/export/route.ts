import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all user data for DPDP export
    const [
      { data: profile },
      { data: settings },
      { data: trades },
      { data: journals },
      { data: tags },
      { data: reports },
      { data: connections },
      { data: consents },
    ] = await Promise.all([
      supabase.from('app_user').select('*').eq('id', user.id).single(),
      supabase.from('user_settings').select('*').eq('user_id', user.id).single(),
      supabase.from('trade').select('*').eq('user_id', user.id).order('traded_at', { ascending: false }),
      supabase.from('journal_entry').select('*').eq('user_id', user.id),
      supabase.from('tag_def').select('*').eq('user_id', user.id),
      supabase.from('weekly_report').select('*').eq('user_id', user.id).order('week_start', { ascending: false }),
      supabase.from('broker_connection').select('id, broker, status, last_sync_at, created_at').eq('user_id', user.id),
      supabase.from('consent_log').select('*').eq('user_id', user.id),
    ]);

    const exportData = {
      exported_at: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        profile,
        settings,
      },
      trades: trades || [],
      journal_entries: journals || [],
      tags: tags || [],
      weekly_reports: reports || [],
      broker_connections: connections || [],
      consent_log: consents || [],
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="bazaarsaar-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
