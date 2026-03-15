'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Eye, ArrowLeftRight, CalendarCheck, Settings, Scale, Shield, BookOpen, BookCheck, FlaskConical, Brain, Sun } from 'lucide-react';
import { usePersonaStore } from '@/lib/store/personaStore';
import { PERSONA_CONFIGS } from '@/lib/persona/definitions';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { TranslationKey } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

const NAV_ITEMS: { href: string; labelKey: TranslationKey; icon: typeof LayoutDashboard }[] = [
  { href: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/morning-checklist', labelKey: 'nav.morningChecklist', icon: Sun },
  { href: '/trades', labelKey: 'nav.trades', icon: ArrowLeftRight },
  { href: '/playbooks', labelKey: 'nav.playbooks', icon: BookCheck },
  { href: '/review/weekly', labelKey: 'nav.weeklyReview', icon: CalendarCheck },
  { href: '/datalab', labelKey: 'nav.datalab', icon: FlaskConical },
  { href: '/dashboard/watchlist', labelKey: 'nav.watchlist', icon: Eye },
  { href: '/settings', labelKey: 'nav.settings', icon: Settings },
];

const LEGAL_ITEMS: { href: string; labelKey: TranslationKey; icon: typeof Scale }[] = [
  { href: '/terms', labelKey: 'nav.terms', icon: Scale },
  { href: '/privacy', labelKey: 'nav.privacy', icon: Shield },
  { href: '/disclaimer', labelKey: 'nav.disclaimer', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { persona } = usePersonaStore();
  const { t } = useTranslation();
  const config = persona ? PERSONA_CONFIGS[persona] : null;

  return (
    <aside className="w-64 h-screen flex flex-col bg-[#0d0d14] border-r border-white/[0.06] shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-2 no-underline">
          <span className="text-xl font-bold text-[#fafaff] tracking-tight">BazaarSaar</span>
          <span className="text-xs text-[#4a4a6a]">{'\u092C\u093E\u091C\u093C\u093E\u0930\u0938\u093E\u0930'}</span>
        </Link>
      </div>

      {/* Persona Badge */}
      {config && (
        <div className="px-5 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <div>
              <div className="text-sm font-medium text-[#d4d4e8]">{config.label}</div>
              <div className="text-[10px] text-[#4a4a6a]">{config.labelHindi}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.labelKey}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline transition-colors',
                  isActive
                    ? 'bg-white/[0.08] text-[#fafaff]'
                    : 'text-[#6b6b8a] hover:text-[#b0b0c8] hover:bg-white/[0.04]'
                )}
              >
                <item.icon size={18} />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Legal Links */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="space-y-0.5">
          {LEGAL_ITEMS.map((item) => (
            <Link
              key={item.labelKey}
              href={item.href}
              className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-[#4a4a6a] hover:text-[#6b6b8a] no-underline transition-colors"
            >
              <item.icon size={12} />
              {t(item.labelKey)}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
