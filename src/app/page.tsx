import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, BookOpen, BarChart3, Shield, Brain, BookCheck, Target, Upload, CheckCircle2, TrendingUp, Users } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bazzarsaar.com';

export const metadata: Metadata = {
  title: 'BazaarSaar | बाज़ारसार - Free Trade Journal & Behavioral Analytics for Indian Traders',
  description:
    'BazaarSaar is a free post-trade review platform for Indian stock traders. Journal emotions, track playbook adherence, detect mistake patterns, and improve trading discipline. Works with Zerodha, Groww, Angel One.',
  keywords: [
    'trade journal India',
    'trading journal app',
    'trading journal for Zerodha',
    'stock trading journal',
    'behavioral analytics trading',
    'playbook checklist trading',
    'emotion tracking trading',
    'trading discipline app',
    'Zerodha trade journal',
    'Groww trade journal',
    'Angel One trade journal',
    'post trade analysis',
    'trading mistake tracker',
    'weekly trade review',
    'Indian stock market journal',
    'bazaarsaar',
    'bazzarsaar',
    'बाज़ारसार',
  ],
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'BazaarSaar',
    title: 'BazaarSaar - Free Trade Journal & Behavioral Analytics for Indian Traders',
    description:
      'Journal emotions, track playbook adherence, detect mistake patterns. The post-trade review platform built for Indian traders.',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'BazaarSaar - Trade Journal for Indian Traders' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BazaarSaar - Trade Journal & Behavioral Analytics',
    description: 'Free post-trade review platform for Indian traders. Works with Zerodha, Groww, Angel One.',
    creator: '@sasmalgiri',
    images: [`${BASE_URL}/og-image.png`],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BazaarSaar',
  alternateName: 'बाज़ारसार',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: BASE_URL,
  description:
    'Free post-trade review and behavioral improvement platform for Indian stock traders. Journal emotions, track playbook adherence, and detect mistake patterns.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'Trade journaling with emotion tracking',
    'Playbook checklists and adherence scoring',
    'Automated weekly performance reviews',
    'Behavioral pattern detection',
    'Zerodha, Groww, Angel One, Upstox CSV import',
    'Zerodha API auto-sync',
    'Data export and DPDP compliance',
  ],
  screenshot: `${BASE_URL}/og-image.png`,
  author: {
    '@type': 'Organization',
    name: 'BazaarSaar',
    url: BASE_URL,
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is BazaarSaar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BazaarSaar is a free post-trade review and behavioral analytics platform built for Indian stock and F&O traders. It helps you journal your trades with emotions, track playbook adherence, and detect patterns in your trading mistakes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is BazaarSaar free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, BazaarSaar is completely free to use. You can journal trades, track playbook adherence, and get weekly reviews at no cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which brokers does BazaarSaar support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BazaarSaar supports CSV import from Zerodha, Groww, Angel One, and Upstox. It also supports direct API sync with Zerodha for automatic trade imports.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does BazaarSaar give trading tips or investment advice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. BazaarSaar is a journaling and analytics tool only. It provides descriptive analysis of your past trades to help you identify behavioral patterns. It does not give buy/sell signals, tips, or investment advice.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does emotion tracking work in BazaarSaar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'When journaling a trade, you tag your emotional state (e.g., FOMO, revenge, fear, confident, calm). Over time, BazaarSaar shows you correlations between emotions and P&L, helping you understand when emotions hurt your performance.',
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen flex flex-col">
        {/* Hero */}
        <header className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#fafaff] tracking-tight mb-2">
            BazaarSaar
          </h1>
          <p className="text-lg text-[#6b6b8a] mb-1" lang="hi">
            बाज़ारसार
          </p>
          <h2 className="text-xl md:text-2xl text-[#9090aa] max-w-2xl mb-1 font-normal">
            Free Trade Journal &amp; Behavioral Analytics for Indian Traders
          </h2>
          <p className="text-sm text-amber-500/80 mb-3" lang="hi">
            मुफ़्त ट्रेड जर्नल — अपनी गलतियों से सीखें, अनुशासन बनाएं
          </p>
          <p className="text-sm text-[#6b6b8a] max-w-xl mb-2">
            Not another trading terminal. BazaarSaar helps you answer {'"Why am I losing money?"'}
            {' '}with emotion tracking, playbook adherence, and mistake pattern detection.
            Works with <strong className="text-[#9090aa]">Zerodha</strong>, <strong className="text-[#9090aa]">Groww</strong>, <strong className="text-[#9090aa]">Angel One</strong> &amp; <strong className="text-[#9090aa]">Upstox</strong>.
          </p>
          <p className="text-xs text-green-500 mb-8 font-medium">
            100% Free — No hidden charges, no premium plan / कोई छिपे शुल्क नहीं, हमेशा मुफ़्त
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#0d0d14] bg-green-500 hover:bg-green-400 transition-colors no-underline"
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-[#d4d4e8] border border-white/[0.1] hover:bg-white/[0.06] transition-colors no-underline"
            >
              Sign In
            </Link>
          </div>

          {/* Feature Grid */}
          <section aria-label="Key features">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl w-full">
              <FeatureCard
                icon={<BookOpen size={24} className="text-green-500" />}
                title="Trade Journal"
                description="Log every trade with thesis, emotions (FOMO, revenge, fear), and screenshots. Build self-awareness."
              />
              <FeatureCard
                icon={<Brain size={24} className="text-amber-500" />}
                title="Mistake Detection"
                description={'"You lose 70% when trading with FOMO." Automatic behavioral pattern recognition from your data.'}
              />
              <FeatureCard
                icon={<BookCheck size={24} className="text-cyan-500" />}
                title="Playbook Adherence"
                description="Create checklists, attach them to trades, and track which rules you actually follow."
              />
              <FeatureCard
                icon={<BarChart3 size={24} className="text-purple-500" />}
                title="Weekly Review"
                description="Auto-generated reports with win rate, emotion distribution, playbook scores, and missed steps."
              />
            </div>
          </section>

          {/* Secondary features */}
          <section aria-label="Additional features" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
              <FeatureCard
                icon={<Upload size={24} className="text-[#6b6b8a]" />}
                title="Multi-Broker CSV Import"
                description="Import from Zerodha, Groww, Angel One, or Upstox. Auto-detects format."
              />
              <FeatureCard
                icon={<Target size={24} className="text-[#6b6b8a]" />}
                title="Playbook Comparison"
                description="See which strategy actually works: win rate and avg P&L per playbook."
              />
              <FeatureCard
                icon={<Shield size={24} className="text-[#6b6b8a]" />}
                title="No Investment Advice"
                description="Descriptive-only analytics. Full data export and delete (DPDP compliant)."
              />
            </div>
          </section>
        </header>

        {/* How It Works */}
        <section className="px-6 py-16 border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#fafaff] text-center mb-10">
              How BazaarSaar Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <StepCard step={1} title="Import Your Trades" description="Connect Zerodha or upload CSV from any broker. All trades are auto-parsed." />
              <StepCard step={2} title="Journal & Tag" description="Add emotions, playbook checklist, and notes to each trade. Takes 30 seconds." />
              <StepCard step={3} title="See Your Patterns" description="Weekly reviews show when emotions cost you money and which playbooks work best." />
            </div>
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="px-6 py-12 border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle2 size={20} className="text-green-500" />
                </div>
                <p className="text-2xl font-bold text-[#fafaff]">100%</p>
                <p className="text-xs text-[#6b6b8a]">Free to use</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp size={20} className="text-cyan-500" />
                </div>
                <p className="text-2xl font-bold text-[#fafaff]">8+</p>
                <p className="text-xs text-[#6b6b8a]">Indian market playbook templates</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Users size={20} className="text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-[#fafaff]">4</p>
                <p className="text-xs text-[#6b6b8a]">Brokers supported</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 py-16 border-t border-white/[0.06]">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#fafaff] text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <FaqItem
                question="What is BazaarSaar?"
                answer="BazaarSaar is a free post-trade review and behavioral analytics platform built for Indian stock and F&O traders. It helps you journal your trades with emotions, track playbook adherence, and detect patterns in your trading mistakes."
              />
              <FaqItem
                question="Is BazaarSaar free to use?"
                answer="Yes, BazaarSaar is completely free to use. You can journal trades, track playbook adherence, and get weekly reviews at no cost."
              />
              <FaqItem
                question="Which brokers does BazaarSaar support?"
                answer="BazaarSaar supports CSV import from Zerodha, Groww, Angel One, and Upstox. It also supports direct API sync with Zerodha for automatic trade imports."
              />
              <FaqItem
                question="Does BazaarSaar give trading tips or investment advice?"
                answer="No. BazaarSaar is a journaling and analytics tool only. It provides descriptive analysis of your past trades to help you identify behavioral patterns. It does not give buy/sell signals, tips, or investment advice."
              />
              <FaqItem
                question="How does emotion tracking work?"
                answer="When journaling a trade, you tag your emotional state (e.g., FOMO, revenge, fear, confident, calm). Over time, BazaarSaar shows you correlations between emotions and P&L, helping you understand when emotions hurt your performance."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 border-t border-white/[0.06] text-center">
          <h2 className="text-2xl font-bold text-[#fafaff] mb-3">
            Start Improving Your Trading Discipline Today
          </h2>
          <p className="text-sm text-[#6b6b8a] mb-6 max-w-md mx-auto">
            Join BazaarSaar for free and start understanding why you win — and why you lose.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-[#0d0d14] bg-green-500 hover:bg-green-400 transition-colors no-underline"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] px-6 py-6 text-center">
          <p className="text-[11px] text-[#4a4a6a] max-w-2xl mx-auto mb-3">
            BazaarSaar is a journaling and behavioral analytics tool — not a trading platform.
            We do not provide investment advice, tips, or recommendations.
            Subject to market risks.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/terms" className="text-[11px] text-[#4a4a6a] hover:text-[#6b6b8a] no-underline">Terms</Link>
            <Link href="/privacy" className="text-[11px] text-[#4a4a6a] hover:text-[#6b6b8a] no-underline">Privacy</Link>
            <Link href="/disclaimer" className="text-[11px] text-[#4a4a6a] hover:text-[#6b6b8a] no-underline">Disclaimer</Link>
            <Link href="/refund" className="text-[11px] text-[#4a4a6a] hover:text-[#6b6b8a] no-underline">Refund</Link>
          </div>
          <p className="text-[10px] text-[#32324a] mt-2">
            &copy; {new Date().getFullYear()} BazaarSaar. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left">
      <div className="mb-3">{icon}</div>
      <h3 className="text-sm font-semibold text-[#d4d4e8] mb-1">{title}</h3>
      <p className="text-xs text-[#6b6b8a] leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div>
      <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-3">
        <span className="text-green-500 font-bold text-sm">{step}</span>
      </div>
      <h3 className="text-sm font-semibold text-[#d4d4e8] mb-1">{title}</h3>
      <p className="text-xs text-[#6b6b8a] leading-relaxed">{description}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border border-white/[0.06] rounded-xl bg-white/[0.02]">
      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-[#d4d4e8] hover:text-[#fafaff] transition-colors">
        {question}
        <span className="text-[#6b6b8a] group-open:rotate-45 transition-transform text-lg">+</span>
      </summary>
      <p className="px-5 pb-4 text-xs text-[#6b6b8a] leading-relaxed">{answer}</p>
    </details>
  );
}
