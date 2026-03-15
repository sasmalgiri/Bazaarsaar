'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';
import {
  Lightbulb, Upload, BookOpen, CalendarCheck, ChevronDown, ChevronUp,
  ArrowRight, X, Sun, Eye, Brain, Settings, CheckCircle2
} from 'lucide-react';

interface BeginnerGuideProps {
  hasTrades: boolean;
  totalTrades: number;
}

const FIRST_TIME_STEPS = [
  {
    num: 1,
    icon: Sun,
    title: 'Fill your Morning Checklist',
    titleHi: 'सुबह की Checklist भरें',
    desc: 'Before the market opens (9:15 AM), answer a few simple questions about your mood and plan for today. Takes 2 minutes.',
    descHi: 'बाज़ार खुलने से पहले (सुबह 9:15), अपने mood और आज के plan के बारे में कुछ आसान सवालों के जवाब दें। 2 मिनट लगेंगे।',
    href: '/morning-checklist',
    cta: 'Fill Checklist',
    color: 'amber',
  },
  {
    num: 2,
    icon: Upload,
    title: 'Import your trades (or add one manually)',
    titleHi: 'अपने trades लाएं (या एक manually जोड़ें)',
    desc: 'Connect your Zerodha account or upload an Excel/CSV file. Don\'t have trades yet? Use the + button at the bottom right to add your first one.',
    descHi: 'Zerodha account जोड़ें या Excel/CSV file upload करें। अभी trades नहीं हैं? नीचे दाएं + बटन से पहला trade जोड़ें।',
    href: '/settings',
    cta: 'Go to Settings',
    color: 'green',
  },
  {
    num: 3,
    icon: Eye,
    title: 'Check your Watchlist',
    titleHi: 'अपनी Watchlist देखें',
    desc: 'See the stocks you picked during setup. You can add or remove stocks anytime. This is your "favorites" list — just for watching prices.',
    descHi: 'Setup में चुने गए stocks देखें। कभी भी stocks जोड़-हटा सकते हैं। यह आपकी "favorites" list है — सिर्फ़ prices देखने के लिए।',
    href: '/dashboard/watchlist',
    cta: 'View Watchlist',
    color: 'cyan',
  },
  {
    num: 4,
    icon: Brain,
    title: 'Learn the basics',
    titleHi: 'बुनियादी बातें सीखें',
    desc: 'New to the stock market? Our Learn section explains everything step by step — what are stocks, how to read charts, common mistakes, and more.',
    descHi: 'शेयर बाज़ार में नए हैं? Learn section में सब कुछ step by step समझाया गया है — stocks क्या हैं, charts कैसे पढ़ें, आम ग़लतियां, आदि।',
    href: '/learn',
    cta: 'Start Learning',
    color: 'purple',
  },
];

const RETURNING_STEPS = [
  {
    num: 1,
    icon: Sun,
    title: 'Fill today\'s Morning Checklist',
    titleHi: 'आज की Morning Checklist भरें',
    href: '/morning-checklist',
    cta: 'Fill Checklist',
  },
  {
    num: 2,
    icon: BookOpen,
    title: 'Write a note on your latest trade',
    titleHi: 'अपने latest trade पर नोट लिखें',
    href: '/trades',
    cta: 'Go to Trades',
  },
  {
    num: 3,
    icon: CalendarCheck,
    title: 'Check your Weekly Report Card',
    titleHi: 'अपनी Weekly Report Card देखें',
    href: '/review/weekly',
    cta: 'View Report',
  },
];

export function BeginnerGuide({ hasTrades, totalTrades }: BeginnerGuideProps) {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(true);

  // Don't show after 20 trades
  if (totalTrades > 20 || dismissed) return null;

  const isFirstTime = !hasTrades;
  const steps = isFirstTime ? FIRST_TIME_STEPS : RETURNING_STEPS;

  return (
    <div className="mb-5">
      <GlassCard className={`p-6 border-l-4 ${isFirstTime ? 'border-amber-500/60' : 'border-green-500/40'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isFirstTime ? 'bg-amber-500/10' : 'bg-green-500/10'}`}>
              <Lightbulb size={18} className={isFirstTime ? 'text-amber-500' : 'text-green-500'} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#fafaff]">
                {isFirstTime ? 'Welcome! Here\'s where to start 👋' : 'What to do today'}
              </h2>
              <p className="text-[11px] text-amber-500/60" lang="hi">
                {isFirstTime ? 'स्वागत है! यहां से शुरू करें 👋' : 'आज क्या करें'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 rounded bg-transparent border-none cursor-pointer text-[#6b6b8a] hover:text-[#d4d4e8] transition-colors"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <button
              type="button"
              title="Dismiss guide"
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded bg-transparent border-none cursor-pointer text-[#4a4a6a] hover:text-[#d4d4e8] transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {isFirstTime && expanded && (
          <p className="text-xs text-[#6b6b8a] mb-4 ml-[42px]">
            Don&apos;t feel overwhelmed. Just do <strong className="text-[#d4d4e8]">step 1</strong> today. You can explore the rest later.
            <span className="text-amber-500/50 ml-1" lang="hi">घबराएं नहीं। आज सिर्फ़ step 1 करें। बाकी बाद में करें।</span>
          </p>
        )}

        {expanded && (
          <div className="space-y-3">
            {steps.map((step) => (
              <Link
                key={step.num}
                href={step.href}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all no-underline group"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  isFirstTime ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'
                }`}>
                  {step.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <step.icon size={14} className="text-[#6b6b8a] shrink-0" />
                    <span className="text-sm font-medium text-[#d4d4e8] group-hover:text-[#fafaff] transition-colors">{step.title}</span>
                  </div>
                  <p className="text-[10px] text-amber-500/50 mt-0.5" lang="hi">{step.titleHi}</p>
                  {'desc' in step && (
                    <>
                      <p className="text-xs text-[#6b6b8a] mt-1.5 leading-relaxed">{(step as typeof FIRST_TIME_STEPS[number]).desc}</p>
                      <p className="text-[10px] text-amber-500/40 mt-0.5 leading-relaxed" lang="hi">{(step as typeof FIRST_TIME_STEPS[number]).descHi}</p>
                    </>
                  )}
                </div>
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium text-green-500 border border-green-500/20 bg-transparent group-hover:bg-green-500/10 transition-colors shrink-0 mt-0.5 whitespace-nowrap">
                  {step.cta} <ArrowRight size={10} />
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-green-500" />
              <span className="text-[10px] text-green-500 font-medium">100% FREE. No hidden charges. No premium plan.</span>
            </div>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-[10px] text-[#4a4a6a] bg-transparent border-none cursor-pointer hover:text-[#6b6b8a] underline"
            >
              I know what I&apos;m doing — hide this
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
