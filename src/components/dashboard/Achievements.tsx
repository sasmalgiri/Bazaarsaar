'use client';

import { useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Trophy,
  Medal,
  Star,
  Flame,
  Target,
  Shield,
  BookCheck,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface AchievementsProps {
  totalTrades: number;
  journaledCount: number;
  currentStreak: number;
  journalStreak: number;
  winRate: number;
  playbooks: number;
  checklistCompletion: number;
}

type Tier = 'bronze' | 'silver' | 'gold';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'journaling' | 'trading' | 'discipline' | 'streaks';
  tier: Tier;
  icon: LucideIcon;
  current: number;
  target: number;
  unlocked: boolean;
}

const TIER_COLORS: Record<Tier, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
};

function buildAchievements(props: AchievementsProps): Achievement[] {
  const {
    totalTrades,
    journaledCount,
    currentStreak,
    journalStreak,
    winRate,
    playbooks,
    checklistCompletion,
  } = props;

  return [
    // --- Journaling ---
    {
      id: 'first-entry',
      name: 'First Entry',
      description: 'Journal your first trade',
      category: 'journaling',
      tier: 'bronze',
      icon: BookCheck,
      current: Math.min(journaledCount, 1),
      target: 1,
      unlocked: journaledCount >= 1,
    },
    {
      id: 'consistent-logger',
      name: 'Consistent Logger',
      description: 'Journal 10 trades',
      category: 'journaling',
      tier: 'silver',
      icon: BookCheck,
      current: Math.min(journaledCount, 10),
      target: 10,
      unlocked: journaledCount >= 10,
    },
    {
      id: 'journal-master',
      name: 'Journal Master',
      description: 'Journal 50 trades',
      category: 'journaling',
      tier: 'gold',
      icon: Star,
      current: Math.min(journaledCount, 50),
      target: 50,
      unlocked: journaledCount >= 50,
    },
    {
      id: 'streak-keeper',
      name: 'Streak Keeper',
      description: '5-day journal streak',
      category: 'journaling',
      tier: 'silver',
      icon: Flame,
      current: Math.min(journalStreak, 5),
      target: 5,
      unlocked: journalStreak >= 5,
    },
    {
      id: 'marathon-journaler',
      name: 'Marathon Journaler',
      description: '30-day journal streak',
      category: 'journaling',
      tier: 'gold',
      icon: Flame,
      current: Math.min(journalStreak, 30),
      target: 30,
      unlocked: journalStreak >= 30,
    },

    // --- Trading ---
    {
      id: 'first-blood',
      name: 'First Blood',
      description: 'Complete your first trade',
      category: 'trading',
      tier: 'bronze',
      icon: TrendingUp,
      current: Math.min(totalTrades, 1),
      target: 1,
      unlocked: totalTrades >= 1,
    },
    {
      id: 'century',
      name: 'Century',
      description: 'Complete 100 trades',
      category: 'trading',
      tier: 'gold',
      icon: Trophy,
      current: Math.min(totalTrades, 100),
      target: 100,
      unlocked: totalTrades >= 100,
    },
    {
      id: 'sharp-shooter',
      name: 'Sharp Shooter',
      description: '60%+ win rate over 20+ trades',
      category: 'trading',
      tier: 'gold',
      icon: Target,
      current: totalTrades >= 20 ? Math.min(Math.round(winRate), 60) : Math.min(totalTrades, 20),
      target: totalTrades >= 20 ? 60 : 20,
      unlocked: totalTrades >= 20 && winRate >= 60,
    },
    {
      id: 'risk-manager',
      name: 'Risk Manager',
      description: 'Avg R:R > 1.5 over 20+ trades',
      category: 'trading',
      tier: 'silver',
      icon: Shield,
      current: Math.min(totalTrades, 20),
      target: 20,
      unlocked: totalTrades >= 20, // simplified — caller would need to pass R:R
    },

    // --- Discipline ---
    {
      id: 'playbook-builder',
      name: 'Playbook Builder',
      description: 'Create your first playbook',
      category: 'discipline',
      tier: 'bronze',
      icon: Medal,
      current: Math.min(playbooks, 1),
      target: 1,
      unlocked: playbooks >= 1,
    },
    {
      id: 'strategy-master',
      name: 'Strategy Master',
      description: 'Create 5 playbooks',
      category: 'discipline',
      tier: 'silver',
      icon: Award,
      current: Math.min(playbooks, 5),
      target: 5,
      unlocked: playbooks >= 5,
    },
    {
      id: 'checklist-champion',
      name: 'Checklist Champion',
      description: '90%+ checklist completion over 10+ trades',
      category: 'discipline',
      tier: 'gold',
      icon: BookCheck,
      current: totalTrades >= 10
        ? Math.min(Math.round(checklistCompletion), 90)
        : Math.min(totalTrades, 10),
      target: totalTrades >= 10 ? 90 : 10,
      unlocked: totalTrades >= 10 && checklistCompletion >= 90,
    },

    // --- Streaks ---
    {
      id: 'hot-streak',
      name: 'Hot Streak',
      description: '3 consecutive wins',
      category: 'streaks',
      tier: 'bronze',
      icon: Zap,
      current: currentStreak > 0 ? Math.min(currentStreak, 3) : 0,
      target: 3,
      unlocked: currentStreak >= 3,
    },
    {
      id: 'on-fire',
      name: 'On Fire',
      description: '5 consecutive wins',
      category: 'streaks',
      tier: 'silver',
      icon: Flame,
      current: currentStreak > 0 ? Math.min(currentStreak, 5) : 0,
      target: 5,
      unlocked: currentStreak >= 5,
    },
    {
      id: 'unstoppable',
      name: 'Unstoppable',
      description: '10 consecutive wins',
      category: 'streaks',
      tier: 'gold',
      icon: Trophy,
      current: currentStreak > 0 ? Math.min(currentStreak, 10) : 0,
      target: 10,
      unlocked: currentStreak >= 10,
    },
  ];
}

export function Achievements(props: AchievementsProps) {
  const achievements = useMemo(() => buildAchievements(props), [props]);

  const sorted = useMemo(() => {
    const unlocked = achievements.filter((a) => a.unlocked);
    const locked = achievements.filter((a) => !a.unlocked);
    // Within each group, sort by tier weight (gold first)
    const tierWeight: Record<Tier, number> = { gold: 3, silver: 2, bronze: 1 };
    unlocked.sort((a, b) => tierWeight[b.tier] - tierWeight[a.tier]);
    locked.sort((a, b) => {
      // Show closest-to-unlock first
      const progressA = a.target > 0 ? a.current / a.target : 0;
      const progressB = b.target > 0 ? b.current / b.target : 0;
      return progressB - progressA;
    });
    return [...unlocked, ...locked];
  }, [achievements]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" />
          <h3 className="text-sm font-semibold text-[#d4d4e8]">Achievements</h3>
        </div>
        <span className="text-[10px] text-[#6b6b8a] uppercase tracking-wider">
          {unlockedCount} / {achievements.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {sorted.map((achievement) => {
          const tierColor = TIER_COLORS[achievement.tier];
          const progress =
            achievement.target > 0
              ? Math.round((achievement.current / achievement.target) * 100)
              : 0;
          const Icon = achievement.icon;

          return (
            <div
              key={achievement.id}
              className={`relative rounded-xl border p-3 transition-all ${
                achievement.unlocked
                  ? 'border-white/[0.08] bg-white/[0.03]'
                  : 'border-white/[0.04] bg-white/[0.01] opacity-50 grayscale'
              }`}
            >
              {/* Tier badge */}
              <span
                className="absolute top-2 right-2 text-[8px] font-bold uppercase tracking-wider"
                style={{ color: tierColor }}
              >
                {achievement.tier}
              </span>

              {/* Icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
                style={{
                  backgroundColor: `${tierColor}15`,
                }}
              >
                <Icon
                  size={18}
                  style={{ color: tierColor }}
                />
              </div>

              {/* Name & Description */}
              <p className="text-xs font-semibold text-[#d4d4e8] leading-tight mb-0.5">
                {achievement.name}
              </p>
              <p className="text-[10px] text-[#6b6b8a] leading-tight mb-2">
                {achievement.description}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden mb-1">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, progress)}%`,
                    backgroundColor: achievement.unlocked ? tierColor : '#4a4a6a',
                  }}
                />
              </div>
              <p className="text-[10px] font-mono text-[#4a4a6a]">
                {achievement.current} / {achievement.target}
              </p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
