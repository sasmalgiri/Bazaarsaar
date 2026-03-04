'use client';

import { WeeklyReviewUI } from '@/components/review/WeeklyReviewUI';
import { CalendarCheck } from 'lucide-react';

export default function WeeklyReviewPage() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <CalendarCheck size={24} className="text-amber-500" />
        <h1 className="text-2xl font-bold text-[#fafaff]">Weekly Review</h1>
      </div>
      <WeeklyReviewUI />
    </div>
  );
}
