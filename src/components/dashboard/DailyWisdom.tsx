'use client';

import { useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface Wisdom {
  text: string;
  textHi: string;
  category: 'myth' | 'sebi' | 'discipline' | 'psychology' | 'risk';
}

const WISDOMS: Wisdom[] = [
  // SEBI Facts
  { text: '93% of F&O traders lost money between FY22-24. Learn before you trade.', textHi: 'FY22-24 में 93% F&O traders ने पैसे गंवाए। Trade करने से पहले सीखें।', category: 'sebi' },
  { text: 'Average F&O trader lost ₹1.1 lakh in FY25. Know your costs before you start.', textHi: 'FY25 में औसत F&O trader ने ₹1.1 लाख गंवाए। शुरू करने से पहले खर्चे जानें।', category: 'sebi' },
  { text: 'Only 1% of traders made more than ₹1 lakh profit after all costs. Be realistic.', textHi: 'सभी खर्चों के बाद सिर्फ 1% traders ने ₹1 लाख से ज़्यादा कमाया। यथार्थवादी बनें।', category: 'sebi' },
  { text: '72% of F&O traders are from small towns. SEBI data shows they lose the most.', textHi: '72% F&O traders छोटे शहरों से हैं। SEBI data बताता है कि वे सबसे ज़्यादा गंवाते हैं।', category: 'sebi' },

  // Myth Busters
  { text: 'Myth: "90% win rate = profitable." Reality: Win rate without risk-reward ratio is meaningless.', textHi: 'Myth: "90% win rate = profitable।" सच: Risk-reward ratio बिना win rate बेमतलब है।', category: 'myth' },
  { text: 'Myth: "Zero brokerage = free trading." Reality: STT, stamp duty, GST, exchange charges still apply on every trade.', textHi: 'Myth: "Zero brokerage = free trading।" सच: STT, stamp duty, GST, exchange charges हर trade पर लगते हैं।', category: 'myth' },
  { text: 'Myth: "Full-time trading is easy." Reality: Most "full-time traders" earn from courses & YouTube ads, not trading.', textHi: 'Myth: "Full-time trading आसान है।" सच: ज़्यादातर "full-time traders" courses और YouTube ads से कमाते हैं।', category: 'myth' },
  { text: 'Myth: "Paper trading proves strategy works." Reality: Without real emotions, paper trading win rates drop 30-40% in live trading.', textHi: 'Myth: "Paper trading strategy prove करती है।" सच: असली भावनाओं बिना, live trading में win rate 30-40% गिर जाती है।', category: 'myth' },

  // Discipline
  { text: 'Tip: Set your stop-loss BEFORE entering the trade. Never move it further away once set.', textHi: 'Tip: Trade में enter करने से पहले stop-loss लगाएं। लगाने के बाद कभी दूर न करें।', category: 'discipline' },
  { text: 'The weekly review is the #1 habit of profitable traders. 15 minutes every Sunday can change your results.', textHi: 'साप्ताहिक समीक्षा profitable traders की #1 आदत है। हर रविवार 15 मिनट आपके नतीजे बदल सकते हैं।', category: 'discipline' },
  { text: 'No setup = no trade. "Let me just see what happens" is not a trading plan.', textHi: 'कोई setup नहीं = कोई trade नहीं। "देखते हैं क्या होता है" trading plan नहीं है।', category: 'discipline' },
  { text: 'Quality over quantity. 1-2 well-planned trades beat 10 random ones every time.', textHi: 'Quantity से ज़्यादा quality। 1-2 planned trades हमेशा 10 random trades को हराते हैं।', category: 'discipline' },

  // Psychology
  { text: 'Revenge trading is the #1 account destroyer. Hit your daily loss limit? Close the app and walk away.', textHi: 'Revenge trading #1 account destroyer है। Daily loss limit hit? App बंद करें, दूर चलें।', category: 'psychology' },
  { text: 'FOMO (Fear of Missing Out) makes you buy at the top. Ask: "Would I buy this stock at THIS price if I had zero positions?"', textHi: 'FOMO top पर खरीदवाता है। पूछें: "अगर मेरे पास कोई position न हो, तो क्या इस price पर खरीदूंगा?"', category: 'psychology' },
  { text: 'After 3 consecutive wins, reduce your position size. Overconfidence after a streak causes the biggest single-trade losses.', textHi: '3 लगातार जीत के बाद position size कम करें। Streak के बाद overconfidence सबसे बड़ा single-trade नुकसान करवाती है।', category: 'psychology' },

  // Risk
  { text: 'Never risk more than 1-2% of your capital on a single trade. Protect what you have.', textHi: 'एक trade पर पूंजी का 1-2% से ज़्यादा जोखिम न लें। जो है उसे बचाएं।', category: 'risk' },
  { text: '50% loss needs 100% gain to recover. Risk management matters more than strategy.', textHi: '50% नुकसान से उबरने के लिए 100% मुनाफ़ा चाहिए। Risk management strategy से ज़्यादा ज़रूरी है।', category: 'risk' },
  { text: 'A simple ₹5,000/month SIP in Nifty 50 index fund beats 93% of F&O traders. Think about that.', textHi: 'Nifty 50 index fund में ₹5,000/महीना SIP 93% F&O traders से बेहतर है। सोचिए।', category: 'risk' },
];

const CATEGORY_COLORS: Record<Wisdom['category'], string> = {
  myth: 'text-red-400',
  sebi: 'text-amber-400',
  discipline: 'text-green-400',
  psychology: 'text-pink-400',
  risk: 'text-blue-400',
};

const CATEGORY_LABELS: Record<Wisdom['category'], string> = {
  myth: 'Myth Buster',
  sebi: 'SEBI Fact',
  discipline: 'Discipline',
  psychology: 'Psychology',
  risk: 'Risk Management',
};

export function DailyWisdom() {
  const wisdom = useMemo(() => {
    // Rotate daily based on date
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return WISDOMS[dayOfYear % WISDOMS.length];
  }, []);

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-amber-400" />
        <h3 className="text-xs font-semibold text-[#d4d4e8] uppercase tracking-wider">Daily Trading Wisdom</h3>
        <span className={`text-[9px] px-2 py-0.5 rounded-full border border-white/[0.06] ${CATEGORY_COLORS[wisdom.category]}`}>
          {CATEGORY_LABELS[wisdom.category]}
        </span>
      </div>

      <p className="text-sm text-[#d4d4e8] leading-relaxed mb-2">{wisdom.text}</p>
      <p className="text-xs text-amber-500/70 leading-relaxed mb-3" lang="hi">{wisdom.textHi}</p>

      <Link
        href="/learn"
        className="inline-flex items-center gap-1 text-[11px] text-green-500 no-underline hover:text-green-400 transition-colors"
      >
        Learn more <ArrowRight size={10} />
      </Link>
    </GlassCard>
  );
}
