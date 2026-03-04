import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch from app_user + user_settings (joined)
    const { data: appUser } = await supabase
      .from('app_user')
      .select('id, email, persona, display_name')
      .eq('id', user.id)
      .single();

    const { data: settings } = await supabase
      .from('user_settings')
      .select('watchlist, language, notifications, onboarding_completed')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      id: user.id,
      email: appUser?.email || user.email,
      persona: appUser?.persona || null,
      display_name: appUser?.display_name || null,
      watchlist: settings?.watchlist || [],
      language: settings?.language || 'en',
      notifications: settings?.notifications ?? true,
      onboarding_completed: settings?.onboarding_completed || false,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Split fields between app_user and user_settings
    const USER_FIELDS = ['persona', 'display_name'];
    const SETTINGS_FIELDS = ['watchlist', 'language', 'notifications', 'onboarding_completed'];

    const userUpdate: Record<string, unknown> = {};
    const settingsUpdate: Record<string, unknown> = {};

    for (const key of USER_FIELDS) {
      if (key in body) userUpdate[key] = body[key];
    }
    for (const key of SETTINGS_FIELDS) {
      if (key in body) settingsUpdate[key] = body[key];
    }

    // Update app_user if needed
    if (Object.keys(userUpdate).length > 0) {
      const { error } = await supabase
        .from('app_user')
        .update({ ...userUpdate, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // Upsert user_settings if needed
    if (Object.keys(settingsUpdate).length > 0) {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settingsUpdate,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
