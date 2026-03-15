'use client';

import { WeeklyReviewUI } from '@/components/review/WeeklyReviewUI';
import { CalendarCheck } from 'lucide-react';

export default function WeeklyReviewPage() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <CalendarCheck size={24} className="text-amber-500" />
          <h1 className="text-2xl font-bold text-[#fafaff]">Weekly Review</h1>
        </div>
        <p className="text-xs text-[#6b6b8a]">Every Sunday, spend 15 minutes here. See what went right, what went wrong, and what to improve next week.</p>
        <p className="text-xs text-amber-500/70">हर रविवार 15 मिनट यहां बिताएं। क्या सही गया, क्या ग़लत, और अगले हफ़्ते क्या सुधारें।</p>
      </div>
      <WeeklyReviewUI />
    </div>
  );
}
