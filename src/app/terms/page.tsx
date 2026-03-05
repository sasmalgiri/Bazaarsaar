import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
      <Link href="/dashboard" className="text-xs text-[#4a4a6a] hover:text-[#6b6b8a] no-underline mb-8 block">&larr; Back to Dashboard</Link>
      <h1 className="text-3xl font-bold text-[#fafaff] mb-8">Terms of Service</h1>
      <div className="space-y-6 text-sm text-[#b0b0c8] leading-relaxed">
        <p className="text-xs text-[#6b6b8a]">Last updated: March 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using BazaarSaar (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">2. Not Investment Advice</h2>
          <p>BazaarSaar is a software analytics tool. The Service does NOT provide investment advice, recommendations, or personalized financial guidance. No content on this platform should be construed as a recommendation to buy, sell, or hold any security.</p>
          <p className="mt-2">BazaarSaar is not registered with SEBI as a Research Analyst or Investment Adviser. Always consult a SEBI-registered professional before making investment decisions.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">3. Educational Purpose</h2>
          <p>All journal analytics, weekly reports, and trade data on BazaarSaar are for informational and educational purposes only. Past performance is not indicative of future results.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">4. Market Risk Disclosure</h2>
          <p>Investments in securities market are subject to market risks. Read all the related documents carefully before investing. Trading in derivatives (futures and options) involves substantial risk of loss and is not suitable for every investor.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">5. Data Accuracy</h2>
          <p>While we strive to provide accurate data, BazaarSaar makes no warranties about the accuracy, completeness, or timeliness of any data displayed. Data is sourced from third-party providers and may contain errors or delays.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">6. User Responsibility</h2>
          <p>You are solely responsible for all trading and investment decisions you make. BazaarSaar shall not be liable for any losses, damages, or costs arising from your use of the Service or reliance on any information provided.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">7. Account Security</h2>
          <p>You are responsible for maintaining the security of your account credentials. BazaarSaar is not responsible for unauthorized access to your account.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, BazaarSaar and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">9. Paid Plans, Billing, and Cancellation</h2>
          <p>If you subscribe to a paid plan, you agree to pay the fees presented at checkout (including any applicable taxes). Subscriptions typically renew automatically until cancelled.</p>
          <p className="mt-2">You can cancel at any time; cancellation takes effect at the end of your current billing period unless stated otherwise at checkout.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">10. Refunds</h2>
          <p>Refund eligibility (if any) depends on the plan and the region where you purchase. Please refer to our Refund Policy for the current terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">11. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
        </section>

        <div className="sebi-disclaimer mt-8">
          <p>Investments in securities market are subject to market risks. Read all the related documents carefully before investing. BazaarSaar is not registered with SEBI as a Research Analyst (RA) or Investment Adviser (IA).</p>
        </div>
      </div>
    </div>
  );
}
