'use client';

import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: string;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hover = false, glow, onClick }: GlassCardProps) {
  return (
    <div
      className={cn('glass-card', hover && 'card-hover cursor-pointer', className)}
      style={glow ? { boxShadow: glow } : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
