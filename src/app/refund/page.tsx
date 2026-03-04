import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy',
};

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
      <Link href="/dashboard" className="text-xs text-[#4a4a6a] hover:text-[#6b6b8a] no-underline mb-8 block">&larr; Back to Dashboard</Link>
      <h1 className="text-3xl font-bold text-[#fafaff] mb-8">Refund Policy</h1>
      <div className="space-y-6 text-sm text-[#b0b0c8] leading-relaxed">
        <p className="text-xs text-[#6b6b8a]">Last updated: March 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">Beta Period</h2>
          <p>BazaarSaar is currently in beta and is available free of charge. No payments are being collected at this time.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">Future Paid Plans</h2>
          <p>When paid plans are introduced (planned at &#x20B9;99&ndash;&#x20B9;149/month), we will offer:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>7-day free trial for all new subscribers</li>
            <li>Full refund within 7 days of first payment if you are not satisfied</li>
            <li>No refunds for partial months after the 7-day period</li>
            <li>Cancel anytime &mdash; no lock-in period</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">Contact</h2>
          <p>For billing inquiries, contact us at support@bazaarsaar.com.</p>
        </section>
      </div>
    </div>
  );
}
