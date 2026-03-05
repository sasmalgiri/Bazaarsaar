'use client';

import { useEffect, useState, useCallback } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { SEBIDisclaimer } from '@/components/ui/SEBIDisclaimer';
import { BookOpen, Save, Star, BookCheck, ImagePlus, X, Loader2 } from 'lucide-react';
import type { EmotionTag, UserPlaybook, UserPlaybookStep } from '@/types';

interface Attachment {
  id: string;
  url: string;
  file_name: string;
}

const EMOTIONS: { value: EmotionTag; label: string; emoji: string }[] = [
  { value: 'confident', label: 'Confident', emoji: '\uD83D\uDE0E' },
  { value: 'neutral', label: 'Neutral', emoji: '\uD83D\uDE10' },
  { value: 'fearful', label: 'Fearful', emoji: '\uD83D\uDE28' },
  { value: 'greedy', label: 'Greedy', emoji: '\uD83E\uDD11' },
  { value: 'fomo', label: 'FOMO', emoji: '\uD83D\uDE30' },
  { value: 'revenge', label: 'Revenge', emoji: '\uD83D\uDE21' },
];

interface TradeJournalEditorProps {
  tradeId: string;
}

export function TradeJournalEditor({ tradeId }: TradeJournalEditorProps) {
  const [thesis, setThesis] = useState('');
  const [invalidation, setInvalidation] = useState('');
  const [emotion, setEmotion] = useState<EmotionTag | ''>('');
  const [checklistFollowed, setChecklistFollowed] = useState(false);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  // Tags
  const [availableTags, setAvailableTags] = useState<{ id: string; label: string; color: string }[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagLabel, setNewTagLabel] = useState('');

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);

  // Playbook + checklist state
  const [playbooks, setPlaybooks] = useState<UserPlaybook[]>([]);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>('');
  const [playbookSteps, setPlaybookSteps] = useState<UserPlaybookStep[]>([]);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchJournal() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch journal entry + user playbooks + tags in parallel
      const [{ data: journal }, { data: userPlaybooks }, { data: tags }] = await Promise.all([
        supabase.from('journal_entry').select('*').eq('user_id', user.id).eq('trade_id', tradeId).single(),
        supabase.from('user_playbook').select('*').eq('user_id', user.id).order('title'),
        supabase.from('tag_def').select('id, label, color').eq('user_id', user.id).order('label'),
      ]);

      if (userPlaybooks) setPlaybooks(userPlaybooks as unknown as UserPlaybook[]);
      if (tags) setAvailableTags(tags as { id: string; label: string; color: string }[]);

      if (journal) {
        setExistingId(journal.id);
        setThesis(journal.thesis || '');
        setInvalidation(journal.invalidation || '');
        setEmotion(journal.emotion || '');
        setChecklistFollowed(journal.checklist_followed || false);
        setNotes(journal.notes || '');
        setRating(journal.rating || 0);

        // Load existing tags for this journal entry
        const { data: entryTags } = await supabase
          .from('journal_entry_tag')
          .select('tag_id')
          .eq('journal_entry_id', journal.id);
        if (entryTags) setSelectedTagIds(entryTags.map((t: { tag_id: string }) => t.tag_id));

        if (journal.playbook_id) {
          setSelectedPlaybookId(journal.playbook_id);
          // Load steps + checks
          const [{ data: steps }, { data: checks }] = await Promise.all([
            supabase.from('user_playbook_step').select('*').eq('playbook_id', journal.playbook_id).order('step_order'),
            supabase.from('journal_check').select('*').eq('journal_entry_id', journal.id),
          ]);
          if (steps) setPlaybookSteps(steps as unknown as UserPlaybookStep[]);
          if (checks) {
            const map: Record<string, boolean> = {};
            (checks as { step_id: string; checked: boolean }[]).forEach((c) => { map[c.step_id] = c.checked; });
            setCheckedSteps(map);
          }
        }
      }
    }
    fetchJournal();
  }, [tradeId]);

  // Fetch attachments when journal entry is loaded
  const fetchAttachments = useCallback(async (journalId: string) => {
    try {
      const res = await fetch(`/api/attachment?journal_entry_id=${journalId}`);
      const data = await res.json();
      if (data.attachments) setAttachments(data.attachments);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (existingId) fetchAttachments(existingId);
  }, [existingId, fetchAttachments]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !existingId) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('journal_entry_id', existingId);

      const res = await fetch('/api/attachment', { method: 'POST', body: form });
      const data = await res.json();

      if (data.id) {
        setAttachments((prev) => [...prev, { id: data.id, url: data.url, file_name: data.file_name }]);
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteAttachment = async (id: string) => {
    await fetch(`/api/attachment?id=${id}`, { method: 'DELETE' });
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // When playbook selection changes, load its steps
  const handlePlaybookChange = async (playbookId: string) => {
    setSelectedPlaybookId(playbookId);
    setPlaybookSteps([]);
    setCheckedSteps({});
    if (!playbookId) return;

    const supabase = createClient();
    const { data } = await supabase.from('user_playbook_step').select('*').eq('playbook_id', playbookId).order('step_order');
    if (data) setPlaybookSteps(data as unknown as UserPlaybookStep[]);
  };

  const toggleStep = (stepId: string) => {
    setCheckedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleCreateTag = async () => {
    const label = newTagLabel.trim();
    if (!label) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase.from('tag_def').insert({
      user_id: user.id,
      tag_type: 'custom',
      label,
      color: '#22c55e',
    }).select('id, label, color').single();

    if (data) {
      setAvailableTags((prev) => [...prev, data as { id: string; label: string; color: string }]);
      setSelectedTagIds((prev) => [...prev, data.id]);
      setNewTagLabel('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const entry = {
      user_id: user.id,
      trade_id: tradeId,
      playbook_id: selectedPlaybookId || null,
      thesis: thesis || null,
      invalidation: invalidation || null,
      emotion: emotion || null,
      checklist_followed: checklistFollowed,
      notes: notes || null,
      rating: rating || null,
      updated_at: new Date().toISOString(),
    };

    let journalId = existingId;

    if (existingId) {
      await supabase.from('journal_entry').update(entry).eq('id', existingId);
    } else {
      const { data } = await supabase.from('journal_entry').insert(entry).select().single();
      if (data) {
        setExistingId(data.id);
        journalId = data.id;
      }
    }

    // Save checklist checks
    if (journalId && playbookSteps.length > 0) {
      const checks = playbookSteps.map((step) => ({
        journal_entry_id: journalId,
        step_id: step.id,
        checked: !!checkedSteps[step.id],
        updated_at: new Date().toISOString(),
      }));
      await supabase.from('journal_check').upsert(checks, { onConflict: 'journal_entry_id,step_id' });
    }

    // Save tags — delete existing and re-insert
    if (journalId) {
      await supabase.from('journal_entry_tag').delete().eq('journal_entry_id', journalId);
      if (selectedTagIds.length > 0) {
        const tagRows = selectedTagIds.map((tagId) => ({
          journal_entry_id: journalId,
          tag_id: tagId,
        }));
        await supabase.from('journal_entry_tag').insert(tagRows);
      }
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={18} className="text-green-500" />
        <h3 className="text-lg font-semibold text-[#d4d4e8]">Trade Journal</h3>
        {existingId && <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-0.5 rounded">Saved</span>}
      </div>

      <div className="space-y-5">
        {/* Thesis */}
        <div>
          <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-2">
            Trade Thesis
          </label>
          <textarea
            value={thesis}
            onChange={(e) => setThesis(e.target.value)}
            placeholder="Why did you take this trade? What was your reasoning?"
            className="w-full px-4 py-3 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30 resize-none min-h-[80px]"
          />
        </div>

        {/* Invalidation */}
        <div>
          <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-2">
            Invalidation
          </label>
          <textarea
            value={invalidation}
            onChange={(e) => setInvalidation(e.target.value)}
            placeholder="What would make this trade wrong? When would you exit?"
            className="w-full px-4 py-3 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30 resize-none min-h-[60px]"
          />
        </div>

        {/* Emotion */}
        <div>
          <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-2">
            Emotional State
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((em) => (
              <button
                key={em.value}
                type="button"
                onClick={() => setEmotion(emotion === em.value ? '' : em.value)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border cursor-pointer transition-all ${
                  emotion === em.value
                    ? 'border-green-500/40 bg-green-500/10 text-green-500'
                    : 'border-white/[0.06] bg-[#11111a] text-[#6b6b8a] hover:bg-white/[0.04]'
                }`}
              >
                <span>{em.emoji}</span>
                {em.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs border cursor-pointer transition-all ${
                  selectedTagIds.includes(tag.id)
                    ? 'border-green-500/40 bg-green-500/10 text-green-500'
                    : 'border-white/[0.06] bg-[#11111a] text-[#6b6b8a] hover:bg-white/[0.04]'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTagLabel}
              onChange={(e) => setNewTagLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
              placeholder="New tag..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-xs text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30"
            />
            <button
              type="button"
              onClick={handleCreateTag}
              disabled={!newTagLabel.trim()}
              className="px-3 py-1.5 rounded-lg text-xs text-green-500 border border-green-500/20 bg-transparent cursor-pointer hover:bg-green-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>

        {/* Playbook Selection */}
        {playbooks.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-2">
              Playbook
            </label>
            <select
              value={selectedPlaybookId}
              onChange={(e) => handlePlaybookChange(e.target.value)}
              aria-label="Select playbook"
              className="w-full px-4 py-2.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] outline-none focus:border-green-500/30 cursor-pointer"
            >
              <option value="">None</option>
              {playbooks.map((pb) => (
                <option key={pb.id} value={pb.id}>{pb.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* Playbook Checklist */}
        {playbookSteps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookCheck size={14} className="text-green-500" />
              <label className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider">
                Checklist ({Object.values(checkedSteps).filter(Boolean).length}/{playbookSteps.length})
              </label>
            </div>
            <div className="space-y-2">
              {playbookSteps.map((step) => (
                <label
                  key={step.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-[#11111a] border border-white/[0.04] cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!checkedSteps[step.id]}
                    onChange={() => toggleStep(step.id)}
                    className="accent-green-500 w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm ${checkedSteps[step.id] ? 'text-[#6b6b8a] line-through' : 'text-[#d4d4e8]'}`}>
                      {step.step_text}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#4a4a6a] capitalize">{step.category}</span>
                      {step.required && <span className="text-[10px] text-amber-500/70">required</span>}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Checklist */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checklistFollowed}
            onChange={(e) => setChecklistFollowed(e.currentTarget.checked)}
            className="accent-green-500 w-4 h-4 cursor-pointer"
          />
          <span className="text-sm text-[#d4d4e8]">I followed my trading checklist</span>
        </label>

        {/* Rating */}
        <div>
          <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-2">
            Trade Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                onClick={() => setRating(rating === star ? 0 : star)}
                className="bg-transparent border-none cursor-pointer p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={20}
                  className={star <= rating ? 'text-amber-500 fill-amber-500' : 'text-[#32324a]'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-2">
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any other observations, learnings, or reminders..."
            className="w-full px-4 py-3 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30 resize-none min-h-[60px]"
          />
        </div>

        {/* Screenshots */}
        <div>
          <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-2">
            Screenshots
          </label>

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachments.map((a) => (
                <div key={a.id} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.url}
                    alt={a.file_name}
                    className="w-20 h-20 rounded-lg object-cover border border-white/[0.06]"
                  />
                  <button
                    type="button"
                    title="Remove screenshot"
                    onClick={() => handleDeleteAttachment(a.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 border-none cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {existingId ? (
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-white/[0.06] bg-[#11111a] text-[#6b6b8a] hover:bg-white/[0.04] cursor-pointer transition-colors">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
              {uploading ? 'Uploading...' : 'Add Screenshot'}
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
          ) : (
            <p className="text-[10px] text-[#4a4a6a]">Save journal first to attach screenshots.</p>
          )}
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Journal'}
          </button>
          {saved && <span className="text-xs text-green-500">Journal entry saved successfully</span>}
        </div>
      </div>

      <SEBIDisclaimer type="journal" />
    </GlassCard>
  );
}
