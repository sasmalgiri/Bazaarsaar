import Link from 'next/link';
import { ArrowRight, BookOpen, BarChart3, Shield, Brain, BookCheck, Target, Upload } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#fafaff] tracking-tight mb-2">
          BazaarSaar
        </h1>
        <p className="text-lg text-[#6b6b8a] mb-1">
          बाज़ारसार
        </p>
        <p className="text-xl md:text-2xl text-[#9090aa] max-w-2xl mb-3">
          The post-trade review &amp; behavioral improvement platform
          for Indian traders.
        </p>
        <p className="text-sm text-[#6b6b8a] max-w-xl mb-8">
          Not another trading terminal. BazaarSaar helps you answer {'"Why am I losing money?"'}
          with emotion tracking, playbook adherence, and mistake pattern detection.
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

        {/* Secondary features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mt-6">
          <FeatureCard
            icon={<Upload size={24} className="text-[#6b6b8a]" />}
            title="Multi-Broker CSV"
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
      </div>

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
