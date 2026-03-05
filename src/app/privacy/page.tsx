import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
      <Link href="/dashboard" className="text-xs text-[#4a4a6a] hover:text-[#6b6b8a] no-underline mb-8 block">&larr; Back to Dashboard</Link>
      <h1 className="text-3xl font-bold text-[#fafaff] mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-sm text-[#b0b0c8] leading-relaxed">
        <p className="text-xs text-[#6b6b8a]">Last updated: March 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">1. Data We Collect</h2>
          <p>We collect the following information when you use BazaarSaar:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Email address (for authentication)</li>
            <li>Selected persona and preferences</li>
            <li>Watchlist symbols</li>
            <li>Usage analytics (page views, feature usage)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">2. How We Use Your Data</h2>
          <p>Your data is used solely to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Personalize your dashboard and journal workflows based on your persona</li>
            <li>Generate weekly descriptive analytics reports</li>
            <li>Sync and store your trade data from connected brokers</li>
            <li>Improve the Service</li>
          </ul>
          <p className="mt-2">We do NOT sell, rent, or share your personal data with third parties for marketing purposes.</p>
          <p className="mt-2">
            We may process data using trusted service providers that help us operate the Service (for example, Supabase for authentication/database and Vercel for hosting/analytics). If you choose to connect a broker, we access your data via that broker&apos;s APIs to sync your trades.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">3. Data Storage</h2>
          <p>Your data is stored securely on Supabase (PostgreSQL) with Row Level Security (RLS) enabled. All data is encrypted in transit via TLS.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">3A. Data Retention</h2>
          <p>We retain your data for as long as your account is active and as needed to provide the Service. You can export or delete your data at any time from Settings.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">3B. International Data Transfers</h2>
          <p>We may process and store data in countries other than where you live (for example, where our hosting and database providers operate). We take reasonable steps to protect your data during such transfers.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">4. Cookies</h2>
          <p>We use essential cookies for authentication and session management. We use Vercel Analytics for anonymous, privacy-respecting usage analytics.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Access your personal data</li>
            <li>Request deletion of your account and data</li>
            <li>Export your data</li>
            <li>Withdraw consent by requesting deletion or contacting us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">6. DPDP Act Compliance</h2>
          <p>BazaarSaar is committed to compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">7. Contact</h2>
          <p>For privacy-related inquiries, contact us at privacy@bazaarsaar.com.</p>
        </section>
      </div>
    </div>
  );
}
