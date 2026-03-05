import type { Metadata } from 'next';
import Link from 'next/link';
import { SEBI_DISCLAIMERS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Disclaimer',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
      <Link href="/dashboard" className="text-xs text-[#4a4a6a] hover:text-[#6b6b8a] no-underline mb-8 block">&larr; Back to Dashboard</Link>
      <h1 className="text-3xl font-bold text-[#fafaff] mb-8">Disclaimer</h1>
      <div className="space-y-6 text-sm text-[#b0b0c8] leading-relaxed">

        <div className="sebi-disclaimer text-base">
          <p className="font-medium mb-2">{SEBI_DISCLAIMERS.general}</p>
          <p className="opacity-80">{SEBI_DISCLAIMERS.generalHindi}</p>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">SEBI Registration Status</h2>
          <p>BazaarSaar is NOT registered with the Securities and Exchange Board of India (SEBI) as:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Research Analyst (RA) under SEBI (Research Analysts) Regulations, 2014</li>
            <li>Investment Adviser (IA) under SEBI (Investment Advisers) Regulations, 2013</li>
            <li>Stock Broker or any other intermediary</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">No Recommendations</h2>
          <p>BazaarSaar does not provide any buy, sell, or hold recommendations. All journal analytics and weekly reports are descriptive summaries of your own trading data and are for personal review purposes only.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">Market Risk</h2>
          <p>Trading and investing in securities involves risk. The value of investments can go down as well as up. Past performance is not a reliable indicator of future results. Trading in derivatives (futures and options) involves substantial risk of loss.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">Data Sources</h2>
          <p>Market data is sourced from publicly available third-party sources (for example, Yahoo Finance). BazaarSaar does not guarantee the accuracy, completeness, or timeliness of data. Data may be delayed.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#d4d4e8] mb-3">User Responsibility</h2>
          <p>Users are solely responsible for their investment decisions. Always consult a SEBI-registered Research Analyst or Investment Adviser before making any investment or trading decisions.</p>
        </section>
      </div>
    </div>
  );
}
