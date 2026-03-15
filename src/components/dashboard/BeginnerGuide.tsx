'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Link from 'next/link';
import {
  Lightbulb, Upload, BookOpen, CalendarCheck, ChevronDown, ChevronUp,
  ArrowRight, Sparkles, X
} from 'lucide-react';

interface BeginnerGuideProps {
  hasTrades: boolean;
  totalTrades: number;
}

export function BeginnerGuide({ hasTrades, totalTrades }: BeginnerGuideProps) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(!hasTrades);

  // Don't show after 20 trades — user is no longer a beginner
  if (totalTrades > 20 || dismissed) return null;

  const steps = [
    {
      done: hasTrades,
      icon: Upload,
      title: t('guide.step1'),
      href: '/settings',
      cta: hasTrades ? undefined : 'Import',
    },
    {
      done: false,
      icon: BookOpen,
      title: t('guide.step2'),
      href: '/trades',
      cta: hasTrades ? 'Journal' : undefined,
    },
    {
      done: false,
      icon: CalendarCheck,
      title: t('guide.step3'),
      href: '/review/weekly',
      cta: 'Review',
    },
  ];

  return (
    <GlassCard className="p-5 mb-5 border-l-4 border-amber-500/40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-amber-500" />
          <h3 className="text-sm font-semibold text-[#d4d4e8]">
            {t('guide.startHere')}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="p-1 rounded bg-transparent border-none cursor-pointer text-[#6b6b8a] hover:text-[#d4d4e8] transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            type="button"
            title="Dismiss guide"
            onClick={() => setDismissed(true)}
            className="p-1 rounded bg-transparent border-none cursor-pointer text-[#4a4a6a] hover:text-[#d4d4e8] transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <>
          {/* 3 Steps */}
          <div className="space-y-2 mb-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  step.done
                    ? 'border-green-500/20 bg-green-500/[0.04]'
                    : 'border-white/[0.06] bg-white/[0.02]'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.done ? 'bg-green-500 text-[#0d0d14]' : 'bg-white/[0.08] text-[#6b6b8a]'
                }`}>
                  {step.done ? '✓' : i + 1}
                </div>
                <step.icon size={14} className={step.done ? 'text-green-500' : 'text-[#6b6b8a]'} />
                <span className={`text-sm flex-1 ${step.done ? 'text-[#6b6b8a] line-through' : 'text-[#d4d4e8]'}`}>
                  {step.title}
                </span>
                {step.cta && (
                  <Link
                    href={step.href}
                    className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium text-green-500 border border-green-500/20 bg-transparent no-underline hover:bg-green-500/10 transition-colors"
                  >
                    {step.cta} <ArrowRight size={10} />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Explainer for beginners */}
          <div className="p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/10">
            <div className="flex items-start gap-2">
              <Sparkles size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#b0b0c8] leading-relaxed">{t('guide.whatIsJournal')}</p>
                <p className="text-[10px] text-green-500 mt-2">{t('guide.freeForever')}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </GlassCard>
  );
}
