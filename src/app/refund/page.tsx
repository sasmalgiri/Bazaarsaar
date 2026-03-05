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
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">Subscription Plans</h2>
          <p>BazaarSaar is a paid subscription service for users in India. Pricing is shown at checkout in INR and may include applicable taxes (such as GST) and promotions.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">Trials, Cancellation, and Refunds</h2>
          <p>Unless otherwise stated at checkout, we offer:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>A free trial (where available) for new subscribers</li>
            <li>A full refund within 7 days of the first payment for your first subscription purchase</li>
            <li>No refunds for partial billing periods after the refund window</li>
            <li>Cancel anytime; access continues until the end of your current billing period</li>
          </ul>
          <p className="mt-2">If you purchase through an app store, billing and refunds may be governed by the store&apos;s policies.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">Contact</h2>
          <p>For billing inquiries, contact us at support@bazaarsaar.com.</p>
        </section>
      </div>
    </div>
  );
}
