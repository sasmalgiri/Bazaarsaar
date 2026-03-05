import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/user/consent
 * Logs DPDP consent to consent_log table.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const purposes: string[] = body.purposes || [];

    if (purposes.length === 0) {
      return NextResponse.json({ error: 'No consent purposes provided' }, { status: 400 });
    }

    // Get IP from headers (Vercel forwards it)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
    const userAgent = req.headers.get('user-agent') || null;

    // Insert one row per purpose
    const rows = purposes.map((purpose) => ({
      user_id: user.id,
      purpose,
      granted: true,
      ip_address: ip,
      user_agent: userAgent,
    }));

    const { error } = await supabase.from('consent_log').insert(rows);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, logged: purposes.length });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
