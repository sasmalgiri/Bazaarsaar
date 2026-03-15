'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { createClient } from '@/lib/supabase/client';
import { MessageCircle, X, Send, Check, Users } from 'lucide-react';
import Link from 'next/link';

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'bug' | 'feature' | 'feedback'>('feedback');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Log feedback as audit event
      await supabase.from('audit_event').insert({
        user_id: user?.id || null,
        action: 'feedback_submitted',
        detail: { type, message: message.trim() },
        ip_address: null,
      });

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage('');
        setOpen(false);
      }, 2000);
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 flex items-center gap-2 px-3 py-2.5 rounded-full bg-[#1a1a2e] text-[#6b6b8a] text-xs border border-white/[0.08] cursor-pointer shadow-lg hover:bg-[#22223a] hover:text-[#d4d4e8] transition-all z-40"
      >
        <MessageCircle size={14} />
        Feedback
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 w-80 z-50 animate-fade-in">
      <GlassCard className="p-5 shadow-xl shadow-black/40 border border-white/[0.1]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#d4d4e8]">Send Feedback</h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1 rounded bg-transparent border-none cursor-pointer text-[#6b6b8a] hover:text-[#d4d4e8] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Type selector */}
        <div className="flex gap-2 mb-3">
          {(['bug', 'feature', 'feedback'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer transition-colors capitalize ${
                type === t
                  ? 'border-green-500/40 bg-green-500/10 text-green-500'
                  : 'border-white/[0.06] bg-[#11111a] text-[#6b6b8a] hover:bg-white/[0.04]'
              }`}
            >
              {t === 'bug' ? 'Bug Report' : t === 'feature' ? 'Feature Request' : 'Feedback'}
            </button>
          ))}
        </div>

        {/* Message */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you think... / आपका सुझाव..."
          className="w-full px-3 py-2.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30 resize-none min-h-[80px] mb-3"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={sending || !message.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sent ? <><Check size={14} /> Thank you!</> : sending ? 'Sending...' : <><Send size={14} /> Send Feedback</>}
        </button>

        <Link
          href="/community"
          className="flex items-center justify-center gap-1.5 mt-2 text-[11px] text-[#6b6b8a] hover:text-[#d4d4e8] no-underline transition-colors"
        >
          <Users size={11} />
          Join our community &rarr;
        </Link>
      </GlassCard>
    </div>
  );
}
