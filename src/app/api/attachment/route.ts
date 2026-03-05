import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

/**
 * POST /api/attachment — Upload a screenshot to a journal entry.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const journalEntryId = formData.get('journal_entry_id') as string | null;

    if (!file || !journalEntryId) {
      return NextResponse.json({ error: 'file and journal_entry_id required' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only PNG, JPEG, WebP, GIF allowed' }, { status: 400 });
    }

    // Verify journal entry belongs to user
    const { data: journal } = await supabase
      .from('journal_entry')
      .select('id')
      .eq('id', journalEntryId)
      .eq('user_id', user.id)
      .single();

    if (!journal) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }

    const admin = createAdminClient();
    const ext = file.name.split('.').pop() || 'png';
    const storagePath = `${user.id}/${journalEntryId}/${Date.now()}.${ext}`;

    const buffer = await file.arrayBuffer();
    const { error: uploadError } = await admin.storage
      .from('attachments')
      .upload(storagePath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Insert attachment record
    const { data: attachment, error: insertError } = await admin.from('attachment').insert({
      user_id: user.id,
      journal_entry_id: journalEntryId,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    }).select().single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = admin.storage.from('attachments').getPublicUrl(storagePath);

    return NextResponse.json({
      id: attachment.id,
      url: urlData.publicUrl,
      file_name: file.name,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

/**
 * GET /api/attachment?journal_entry_id=xxx — List attachments for a journal entry.
 */
export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const journalEntryId = url.searchParams.get('journal_entry_id');
    if (!journalEntryId) return NextResponse.json({ error: 'journal_entry_id required' }, { status: 400 });

    const { data: attachments } = await supabase
      .from('attachment')
      .select('id, storage_path, file_name, mime_type, size_bytes, created_at')
      .eq('user_id', user.id)
      .eq('journal_entry_id', journalEntryId)
      .order('created_at');

    const admin = createAdminClient();
    const result = (attachments || []).map((a: { id: string; storage_path: string; file_name: string; mime_type: string; size_bytes: number; created_at: string }) => {
      const { data: urlData } = admin.storage.from('attachments').getPublicUrl(a.storage_path);
      return { ...a, url: urlData.publicUrl };
    });

    return NextResponse.json({ attachments: result });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

/**
 * DELETE /api/attachment?id=xxx — Delete an attachment.
 */
export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const { data: attachment } = await supabase
      .from('attachment')
      .select('id, storage_path')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!attachment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const admin = createAdminClient();
    await admin.storage.from('attachments').remove([attachment.storage_path]);
    await admin.from('attachment').delete().eq('id', id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
