'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { BookCheck, Plus, Save, Trash2 } from 'lucide-react';
import type { UserPlaybook, UserPlaybookStep, StepCategory } from '@/types';

const CATEGORIES: { value: StepCategory; label: string; color: string }[] = [
  { value: 'setup', label: 'Setup', color: 'text-cyan-500' },
  { value: 'entry', label: 'Entry', color: 'text-green-500' },
  { value: 'risk', label: 'Risk', color: 'text-red-500' },
  { value: 'exit', label: 'Exit', color: 'text-amber-500' },
  { value: 'psych', label: 'Psych', color: 'text-purple-500' },
  { value: 'general', label: 'General', color: 'text-[#6b6b8a]' },
];

interface PlaybookEditorProps {
  playbookId: string;
}

export function PlaybookEditor({ playbookId }: PlaybookEditorProps) {
  const [playbook, setPlaybook] = useState<UserPlaybook | null>(null);
  const [steps, setSteps] = useState<UserPlaybookStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const [{ data: pb }, { data: st }] = await Promise.all([
        supabase.from('user_playbook').select('*').eq('id', playbookId).single(),
        supabase.from('user_playbook_step').select('*').eq('playbook_id', playbookId).order('step_order'),
      ]);

      if (pb) {
        const playbook = pb as unknown as UserPlaybook;
        setPlaybook(playbook);
        setTitle(playbook.title);
        setDescription(playbook.description);
      }
      setSteps((st as unknown as UserPlaybookStep[]) || []);
      setLoading(false);
    }
    fetchData();
  }, [playbookId]);

  const handleSaveMeta = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from('user_playbook').update({
      title,
      description,
      updated_at: new Date().toISOString(),
    }).eq('id', playbookId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddStep = async () => {
    const supabase = createClient();
    const nextOrder = (steps.at(-1)?.step_order ?? 0) + 1;

    const { data } = await supabase.from('user_playbook_step').insert({
      playbook_id: playbookId,
      step_order: nextOrder,
      category: 'general',
      step_text: 'New step — click to edit',
      required: true,
    }).select('*').single();

    if (data) {
      setSteps([...steps, data as unknown as UserPlaybookStep]);
    }
  };

  const handleUpdateStep = async (id: string, patch: Partial<UserPlaybookStep>) => {
    const supabase = createClient();
    await supabase.from('user_playbook_step').update(patch).eq('id', id);
    setSteps(steps.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const handleDeleteStep = async (id: string) => {
    const supabase = createClient();
    await supabase.from('user_playbook_step').delete().eq('id', id);
    setSteps(steps.filter((s) => s.id !== id));
  };

  if (loading) {
    return <GlassCard className="p-8 text-center"><p className="text-sm text-[#6b6b8a]">Loading playbook...</p></GlassCard>;
  }

  if (!playbook) {
    return <GlassCard className="p-8 text-center"><p className="text-sm text-[#6b6b8a]">Playbook not found</p></GlassCard>;
  }

  return (
    <div className="space-y-6">
      {/* Metadata */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookCheck size={18} className="text-green-500" />
          <h2 className="text-lg font-semibold text-[#d4d4e8]">Playbook Details</h2>
          <div className="flex gap-1.5 ml-auto">
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-[#6b6b8a]">{playbook.market}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-[#6b6b8a]">{playbook.level}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1.5">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Playbook title"
              className="w-full px-4 py-2.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] outline-none focus:border-green-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your playbook"
              className="w-full px-4 py-2.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] outline-none focus:border-green-500/30 resize-none min-h-[60px]"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveMeta}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-50"
            >
              <Save size={12} />
              {saving ? 'Saving...' : 'Save'}
            </button>
            {saved && <span className="text-xs text-green-500">Saved!</span>}
          </div>
        </div>
      </GlassCard>

      {/* Steps */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#d4d4e8]">Checklist Steps ({steps.length})</h3>
          <button
            onClick={handleAddStep}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-green-500 border border-green-500/20 bg-transparent cursor-pointer hover:bg-green-500/10 transition-all"
          >
            <Plus size={12} />
            Add Step
          </button>
        </div>

        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="p-4 rounded-lg bg-[#11111a] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono text-[#4a4a6a]">#{step.step_order}</span>
                <select
                  value={step.category}
                  onChange={(e) => handleUpdateStep(step.id, { category: e.target.value as StepCategory })}
                  aria-label="Step category"
                  className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.06] text-[#6b6b8a] outline-none cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <label className="flex items-center gap-1 text-[10px] text-[#4a4a6a] ml-auto cursor-pointer">
                  <input
                    type="checkbox"
                    checked={step.required}
                    onChange={(e) => handleUpdateStep(step.id, { required: e.currentTarget.checked })}
                    className="accent-green-500 w-3 h-3 cursor-pointer"
                  />
                  required
                </label>
                <button
                  onClick={() => handleDeleteStep(step.id)}
                  title="Delete step"
                  className="text-red-500/60 hover:text-red-500 bg-transparent border-none cursor-pointer p-1 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <input
                value={step.step_text}
                onChange={(e) => handleUpdateStep(step.id, { step_text: e.target.value })}
                placeholder="Step description"
                className="w-full px-3 py-2 rounded bg-[#0a0a0f] border border-white/[0.04] text-sm text-[#d4d4e8] outline-none focus:border-green-500/20"
              />
            </div>
          ))}

          {steps.length === 0 && (
            <p className="text-xs text-[#4a4a6a] text-center py-4">No steps yet. Add one above.</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
