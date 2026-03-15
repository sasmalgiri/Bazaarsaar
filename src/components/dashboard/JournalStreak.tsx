'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { Flame, Heart } from 'lucide-react';

export function JournalStreak() {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function calcStreak() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Get journal entries ordered by date
      const { data } = await supabase
        .from('journal_entry')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(90);

      if (!data || data.length === 0) { setLoading(false); return; }

      // Calculate streak: consecutive days with journal entries
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const journalDates = new Set(
        data.map((j: { created_at: string }) => {
          const d = new Date(j.created_at);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      );

      let currentStreak = 0;
      const dayMs = 86400000;

      // Check today and yesterday (allow 1 day grace)
      const todayTs = today.getTime();
      const yesterdayTs = todayTs - dayMs;

      let checkDate = journalDates.has(todayTs) ? todayTs : journalDates.has(yesterdayTs) ? yesterdayTs : -1;

      if (checkDate >= 0) {
        while (journalDates.has(checkDate)) {
          currentStreak++;
          checkDate -= dayMs;
        }
      }

      setStreak(currentStreak);
      setLoading(false);
    }
    calcStreak();
  }, []);

  if (loading || streak === 0) return null;

  const getMessage = () => {
    if (streak >= 30) return { text: 'Legendary discipline!', textHi: 'महान अनुशासन!' };
    if (streak >= 14) return { text: 'Incredible consistency!', textHi: 'अद्भुत निरंतरता!' };
    if (streak >= 7) return { text: 'One full week! Keep going.', textHi: 'पूरा एक हफ़्ता! जारी रखें।' };
    if (streak >= 3) return { text: 'Building the habit. Nice!', textHi: 'आदत बन रही है। बढ़िया!' };
    return { text: 'Great start! Journal again tomorrow.', textHi: 'अच्छी शुरुआत! कल भी journal करें।' };
  };

  const msg = getMessage();

  return (
    <GlassCard className="p-4 flex items-center gap-4 border-l-4 border-orange-500/40">
      <div className="flex items-center gap-2">
        <Flame size={22} className="text-orange-500" />
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-orange-500">{streak}</span>
            <span className="text-xs text-[#6b6b8a]">day streak</span>
          </div>
          <p className="text-[11px] text-[#6b6b8a]">{msg.text}</p>
          <p className="text-[10px] text-amber-500/60" lang="hi">{msg.textHi}</p>
        </div>
      </div>
      {streak >= 7 && (
        <Heart size={14} className="text-orange-500/50 ml-auto" />
      )}
    </GlassCard>
  );
}
