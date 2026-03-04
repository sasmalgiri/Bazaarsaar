import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  let dbStatus = 'error';

  try {
    const admin = createAdminClient();
    const { error } = await admin.from('app_user').select('id').limit(1);
    dbStatus = error ? 'error' : 'ok';
  } catch {
    dbStatus = 'unreachable';
  }

  return NextResponse.json({
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION || 'local',
    services: {
      frontend: 'ok',
      database: dbStatus,
    },
  });
}
