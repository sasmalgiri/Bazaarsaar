'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { SEBIDisclaimer } from '@/components/ui/SEBIDisclaimer';
import { BookOpen, Save, Star, BookCheck } from 'lucide-react';
import type { EmotionTag, UserPlaybook, UserPlaybookStep } from '@/types';

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

      // Fetch journal entry + user playbooks in parallel
      const [{ data: journal }, { data: userPlaybooks }] = await Promise.all([
        supabase.from('journal_entry').select('*').eq('user_id', user.id).eq('trade_id', tradeId).single(),
        supabase.from('user_playbook').select('*').eq('user_id', user.id).order('title'),
      ]);

      if (userPlaybooks) setPlaybooks(userPlaybooks as unknown as UserPlaybook[]);

      if (journal) {
        setExistingId(journal.id);
        setThesis(journal.thesis || '');
        setInvalidation(journal.invalidation || '');
        setEmotion(journal.emotion || '');
        setChecklistFollowed(journal.checklist_followed || false);
        setNotes(journal.notes || '');
        setRating(journal.rating || 0);

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

        {/* Save */}
        <div className="flex items-center gap-3 pt-2">
          <button
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
