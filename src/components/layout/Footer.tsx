import Link from 'next/link';
import { SEBIDisclaimer } from '@/components/ui/SEBIDisclaimer';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-4 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        <SEBIDisclaimer variant="footer" />
        <div className="flex items-center justify-between mt-3">
          <span className="text-[11px] text-[#4a4a6a]">
            &copy; {new Date().getFullYear()} BazaarSaar. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-[11px] text-[#4a4a6a] hover:text-[#6b6b8a] no-underline">Terms</Link>
            <Link href="/privacy" className="text-[11px] text-[#4a4a6a] hover:text-[#6b6b8a] no-underline">Privacy</Link>
            <Link href="/disclaimer" className="text-[11px] text-[#4a4a6a] hover:text-[#6b6b8a] no-underline">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
