'use client';

import { useParams } from 'next/navigation';
import { PlaybookEditor } from '@/components/playbooks/PlaybookEditor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PlaybookDetailPage() {
  const params = useParams();
  const playbookId = params.id as string;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link href="/playbooks" className="flex items-center gap-1.5 text-xs text-[#6b6b8a] hover:text-[#d4d4e8] no-underline transition-colors mb-4">
        <ArrowLeft size={14} />
        Back to Playbooks
      </Link>
      <PlaybookEditor playbookId={playbookId} />
      <p className="text-[10px] text-[#4a4a6a] text-center mt-4">
        Playbooks are checklists for documentation. Not recommendations.
      </p>
    </div>
  );
}
