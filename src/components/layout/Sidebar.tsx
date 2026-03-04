'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Eye, Zap, FileText, Scale, Shield, BookOpen } from 'lucide-react';
import { usePersonaStore } from '@/lib/store/personaStore';
import { PERSONA_CONFIGS } from '@/lib/persona/definitions';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard', label: 'Watchlist', icon: Eye },
  { href: '/dashboard', label: 'Signals', icon: Zap },
  { href: '/dashboard', label: 'Daily Pack', icon: FileText },
];

const LEGAL_ITEMS = [
  { href: '/terms', label: 'Terms', icon: Scale },
  { href: '/privacy', label: 'Privacy', icon: Shield },
  { href: '/disclaimer', label: 'Disclaimer', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { persona } = usePersonaStore();
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
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline transition-colors',
                  isActive
                    ? 'bg-white/[0.08] text-[#fafaff]'
                    : 'text-[#6b6b8a] hover:text-[#b0b0c8] hover:bg-white/[0.04]'
                )}
              >
                <item.icon size={18} />
                {item.label}
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
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-[#4a4a6a] hover:text-[#6b6b8a] no-underline transition-colors"
            >
              <item.icon size={12} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
