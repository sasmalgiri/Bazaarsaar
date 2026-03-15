import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight, BookOpen, BarChart3, Shield, Brain, BookCheck,
  Upload, CheckCircle2, AlertTriangle, GraduationCap,
  Heart, Lock, XCircle, CheckCircle, MapPin,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bazzarsaar.com';

export const metadata: Metadata = {
  title: 'BazaarSaar | बाज़ारसार — Free Trade Journal for Indian Beginners',
  description:
    'BazaarSaar is a free trade journal for Indian stock market beginners. Learn from your own trades, not YouTube tips. Track emotions, build discipline, and understand why you lose money. Hindi + English. Works with Zerodha, Groww, Angel One.',
  keywords: [
    'trade journal India',
    'trading journal app',
    'trading journal for beginners',
    'trading journal for Zerodha',
    'stock trading journal',
    'beginner trading India',
    'learn trading India',
    'trading discipline app',
    'emotion tracking trading',
    'Zerodha trade journal',
    'Groww trade journal',
    'Angel One trade journal',
    'trading mistakes tracker',
    'weekly trade review',
    'Indian stock market journal',
    'bazaarsaar',
    'bazzarsaar',
    'बाज़ारसार',
    'ट्रेडिंग जर्नल',
  ],
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'BazaarSaar',
    title: 'BazaarSaar — Free Trade Journal for Indian Beginners',
    description:
      'Stop losing money to emotions. Journal your trades, learn from mistakes, build discipline. 100% free. Hindi + English.',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'BazaarSaar - Trade Journal for Indian Beginners' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BazaarSaar — Free Trade Journal for Indian Beginners',
    description: 'Stop losing money to emotions. Free trade journal with Hindi + English. Works with Zerodha, Groww, Angel One.',
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
    'Free trade journal and learning platform for Indian stock market beginners. Journal emotions, track discipline, detect mistake patterns, and learn trading basics in Hindi and English.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'Trade journaling with emotion tracking',
    'Trading checklists (playbooks) with adherence scoring',
    'Automated weekly performance reviews',
    'Behavioral pattern and mistake detection',
    'Free trading education in Hindi and English',
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
        text: 'BazaarSaar is a free trade journal for Indian stock market beginners. It helps you write down why you took each trade, how you felt, and whether you followed your rules. Over time, it shows you patterns — like which emotions make you lose money. It is not a trading platform and does not give tips or advice.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is BazaarSaar really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, 100% free. No premium plan, no hidden charges, no courses to sell. BazaarSaar makes money from nothing — it is a community project built to help Indian traders improve their discipline.',
      },
    },
    {
      '@type': 'Question',
      name: 'I am a complete beginner. Can I use BazaarSaar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. BazaarSaar is built specifically for beginners. Everything is explained in simple Hindi and English. No jargon. The Learn section teaches you trading basics from zero — what is a stock, what is stop-loss, how to manage risk.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which brokers does BazaarSaar work with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BazaarSaar supports CSV import from Zerodha, Groww, Angel One, and Upstox. It also supports direct API sync with Zerodha for automatic trade imports. You can also add trades manually.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does BazaarSaar give trading tips or tell me what to buy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. BazaarSaar never tells you what to buy or sell. It is a journaling tool that helps you understand your own behavior. It shows you data about YOUR trades — when you made money, when you lost, and what emotions were driving your decisions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a trade journal and why do I need one?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A trade journal is like a diary for your trades. After each trade, you write down why you bought, how you felt, and what happened. Professional traders have used journals for decades. Without one, you repeat the same mistakes. With one, you can see your patterns and improve.',
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

        {/* ─── Hero ─── */}
        <header className="flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#fafaff] tracking-tight mb-2">
            BazaarSaar
          </h1>
          <p className="text-lg text-amber-500/80 mb-4" lang="hi">
            बाज़ारसार
          </p>

          <h2 className="text-xl md:text-2xl text-[#d4d4e8] max-w-2xl mb-2 font-semibold leading-snug">
            Losing money in the stock market?<br />
            <span className="text-green-500">You&apos;re not alone — and it&apos;s not your fault.</span>
          </h2>
          <p className="text-sm text-amber-500/70 max-w-xl mb-4" lang="hi">
            शेयर बाज़ार में पैसे डूब रहे हैं? आप अकेले नहीं हैं — और ये आपकी ग़लती नहीं है।
          </p>

          <p className="text-sm text-[#9090aa] max-w-xl mb-2 leading-relaxed">
            Most beginners lose money because <strong className="text-[#d4d4e8]">no one teaches them to track their mistakes</strong>.
            YouTube teaches you &quot;strategies&quot; — BazaarSaar teaches you to <strong className="text-[#d4d4e8]">understand yourself</strong>.
          </p>
          <p className="text-sm text-amber-500/60 max-w-xl mb-6" lang="hi">
            YouTube &quot;strategies&quot; सिखाता है — BazaarSaar आपको ख़ुद को समझना सिखाता है।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-[#0d0d14] bg-green-500 hover:bg-green-400 transition-colors no-underline"
            >
              Start Free — शुरू करें
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-[#d4d4e8] border border-white/[0.1] hover:bg-white/[0.06] transition-colors no-underline"
            >
              Sign In
            </Link>
          </div>

          <p className="text-xs text-green-500/80 font-medium mb-2">
            100% Free — No hidden charges, no premium plan, no courses to sell
          </p>
          <p className="text-[11px] text-[#4a4a6a]">
            Works with Zerodha, Groww, Angel One &amp; Upstox
          </p>
        </header>

        {/* ─── SEBI Reality Check ─── */}
        <section className="px-6 py-10 border-t border-white/[0.06]" aria-label="SEBI data">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-red-500" />
              <h2 className="text-lg font-bold text-[#fafaff]">The Reality No YouTuber Tells You</h2>
            </div>
            <p className="text-xs text-amber-500/70 text-center mb-6" lang="hi">
              वो सच जो कोई YouTuber नहीं बताता
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/[0.04] text-center">
                <p className="text-3xl font-bold font-mono text-red-500">93%</p>
                <p className="text-xs text-[#6b6b8a] mt-1">of F&amp;O traders lose money</p>
                <p className="text-[10px] text-amber-500/60 mt-0.5" lang="hi">F&amp;O ट्रेडर्स पैसे हारते हैं</p>
              </div>
              <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/[0.04] text-center">
                <p className="text-3xl font-bold font-mono text-red-500">₹1.8L Cr</p>
                <p className="text-xs text-[#6b6b8a] mt-1">lost by retail traders (3 years)</p>
                <p className="text-[10px] text-amber-500/60 mt-0.5" lang="hi">3 साल में कुल नुकसान</p>
              </div>
              <div className="p-4 rounded-xl border border-amber-500/10 bg-amber-500/[0.04] text-center">
                <p className="text-3xl font-bold font-mono text-amber-500">72%</p>
                <p className="text-xs text-[#6b6b8a] mt-1">of losers are from small cities</p>
                <p className="text-[10px] text-amber-500/60 mt-0.5" lang="hi">छोटे शहरों से हैं</p>
              </div>
              <div className="p-4 rounded-xl border border-amber-500/10 bg-amber-500/[0.04] text-center">
                <p className="text-3xl font-bold font-mono text-amber-500">Avg ₹2L</p>
                <p className="text-xs text-[#6b6b8a] mt-1">lost per person per year</p>
                <p className="text-[10px] text-amber-500/60 mt-0.5" lang="hi">प्रति व्यक्ति प्रति वर्ष नुकसान</p>
              </div>
            </div>

            <p className="text-[10px] text-[#4a4a6a] text-center mt-4">
              Source: SEBI study on profit &amp; loss of individual traders dealing in equity F&amp;O segment (Jan 2024)
            </p>
          </div>
        </section>

        {/* ─── YouTube Myths vs Reality ─── */}
        <section className="px-6 py-12 border-t border-white/[0.06]" aria-label="YouTube myths vs reality">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Brain size={18} className="text-amber-500" />
              <h2 className="text-lg font-bold text-[#fafaff]">What YouTube Teaches vs What Actually Works</h2>
            </div>
            <p className="text-xs text-amber-500/70 text-center mb-8" lang="hi">
              YouTube क्या सिखाता है vs असलियत में क्या काम करता है
            </p>

            <div className="space-y-4">
              <MythRow
                myth="&quot;Learn this one strategy and make ₹1 lakh/month&quot;"
                mythHi="&quot;ये एक strategy सीखो और महीने का ₹1 लाख कमाओ&quot;"
                reality="No single strategy works forever. What works is discipline — following your rules, managing risk, and learning from mistakes."
                realityHi="कोई एक strategy हमेशा काम नहीं करती। अनुशासन काम करता है — नियम मानो, risk manage करो, ग़लतियों से सीखो।"
              />
              <MythRow
                myth="&quot;Options trading is easy money — just buy calls/puts&quot;"
                mythHi="&quot;Options में आसानी से पैसे बनते हैं&quot;"
                reality="SEBI data: 93% of F&O traders LOSE money. Options are the hardest instrument. Start with stocks if you're new."
                realityHi="SEBI डेटा: 93% F&O ट्रेडर्स पैसे हारते हैं। नए हैं तो stocks से शुरू करें।"
              />
              <MythRow
                myth="&quot;Quit your job — trade full time from day one&quot;"
                mythHi="&quot;नौकरी छोड़ो — पहले दिन से full-time trade करो&quot;"
                reality="Even profitable traders take 2-3 years to become consistent. Keep your income. Trade with money you can afford to lose."
                realityHi="अच्छे traders को भी 2-3 साल लगते हैं। नौकरी रखें। सिर्फ़ वो पैसा लगाएं जो डूब भी जाए तो चलेगा।"
              />
              <MythRow
                myth="&quot;Just follow my calls — 90% accuracy!&quot;"
                mythHi="&quot;मेरे calls follow करो — 90% accuracy!&quot;"
                reality="Tip providers show winning trades, hide losses. You can't build a career following someone else's tips. You need your own system."
                realityHi="Tip देने वाले जीतते trades दिखाते हैं, हारते छुपाते हैं। दूसरों के tips से career नहीं बनता।"
              />
            </div>

            <div className="mt-8 p-5 rounded-xl border border-green-500/10 bg-green-500/[0.04] text-center">
              <p className="text-sm text-[#d4d4e8] font-medium mb-1">
                BazaarSaar doesn&apos;t sell dreams. We show you the mirror.
              </p>
              <p className="text-xs text-amber-500/70" lang="hi">
                BazaarSaar सपने नहीं बेचता। हम आपको आईना दिखाते हैं।
              </p>
            </div>
          </div>
        </section>

        {/* ─── Your Road: Zero to Confident ─── */}
        <section className="px-6 py-14 border-t border-white/[0.06]" aria-label="Your journey roadmap">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin size={18} className="text-green-500" />
              <h2 className="text-lg font-bold text-[#fafaff]">Your Road: From Zero to Confident Trader</h2>
            </div>
            <p className="text-xs text-amber-500/70 text-center mb-10" lang="hi">
              आपका रास्ता: शून्य से आत्मविश्वासी ट्रेडर तक
            </p>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/40 via-amber-500/40 to-cyan-500/40 hidden sm:block" />

              <div className="space-y-8">
                <RoadStep
                  step={1}
                  color="green"
                  title="Learn the Basics"
                  titleHi="बुनियादी बातें सीखें"
                  desc="What is a stock? What is stop-loss? How does the market work? Our free Learn section explains everything in simple Hindi + English — no jargon."
                  descHi="शेयर क्या है? Stop-loss क्या है? बाज़ार कैसे काम करता है? हमारा Learn section सब कुछ आसान हिंदी + English में समझाता है।"
                  action="Start Learning"
                  href="/learn"
                />
                <RoadStep
                  step={2}
                  color="green"
                  title="Open a Broker Account"
                  titleHi="ब्रोकर अकाउंट खोलें"
                  desc="Choose any broker — Zerodha, Groww, Angel One, or Upstox. Start with a small amount you can afford to lose. BazaarSaar connects with all of them."
                  descHi="कोई भी broker चुनें। छोटी रक़म से शुरू करें जो डूब जाए तो चलेगा। BazaarSaar सबसे जुड़ता है।"
                />
                <RoadStep
                  step={3}
                  color="amber"
                  title="Make Your First Trades & Write About Them"
                  titleHi="पहले trades करें और उनके बारे में लिखें"
                  desc="After each trade, write in BazaarSaar: Why did I buy? How was I feeling? Did I follow my rules? This is called 'journaling' — it's like a trading diary."
                  descHi="हर trade के बाद BazaarSaar में लिखें: मैंने क्यों ख़रीदा? मेरा mood कैसा था? क्या मैंने अपने नियम माने? इसे 'journaling' कहते हैं।"
                  action="Start Journaling"
                  href="/auth/signup"
                />
                <RoadStep
                  step={4}
                  color="amber"
                  title="Follow a Checklist Before Every Trade"
                  titleHi="हर trade से पहले checklist follow करें"
                  desc="Just like a pilot checks instruments before flying, check your trading rules before every trade. BazaarSaar gives you ready-made checklists (we call them 'playbooks')."
                  descHi="जैसे pilot उड़ान से पहले instruments check करता है, वैसे हर trade से पहले अपने नियम check करें। BazaarSaar में ready-made checklists मिलेंगी।"
                  action="See Checklists"
                  href="/playbooks"
                />
                <RoadStep
                  step={5}
                  color="cyan"
                  title="Review Your Week Every Sunday"
                  titleHi="हर रविवार अपने हफ़्ते की समीक्षा करें"
                  desc="Every Sunday, spend 15 minutes looking at your week. How many trades did you win? Did emotions like fear or greed cost you money? BazaarSaar generates this report automatically."
                  descHi="हर रविवार 15 मिनट दें। कितने trades जीते? क्या डर या लालच ने पैसे डुबोए? BazaarSaar ये report अपने-आप बनाता है।"
                  action="See Weekly Review"
                  href="/review/weekly"
                />
                <RoadStep
                  step={6}
                  color="cyan"
                  title="See Your Patterns & Improve"
                  titleHi="अपने patterns देखें और सुधारें"
                  desc="After 10+ trades, BazaarSaar shows you exactly which emotions and habits make you lose money — and which ones help you win. No guessing. Real data from YOUR trades."
                  descHi="10+ trades के बाद, BazaarSaar बताएगा कि कौन सी भावनाएं और आदतें पैसे डुबोती हैं — और कौन सी जिताती हैं। अंदाज़ा नहीं, आपके अपने trades का असली डेटा।"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── What BazaarSaar Does (Features in Simple Language) ─── */}
        <section className="px-6 py-14 border-t border-white/[0.06]" aria-label="Features">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-bold text-[#fafaff] text-center mb-2">
              What BazaarSaar Gives You (All Free)
            </h2>
            <p className="text-xs text-amber-500/70 text-center mb-10" lang="hi">
              BazaarSaar आपको क्या देता है (सब मुफ़्त)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureCard
                icon={<BookOpen size={22} className="text-green-500" />}
                title="Trade Diary (ट्रेड डायरी)"
                description="Write why you took each trade and how you felt. Like a personal diary, but for trading. Helps you stop repeating mistakes."
              />
              <FeatureCard
                icon={<Brain size={22} className="text-amber-500" />}
                title="Mistake Finder (ग़लती खोजक)"
                description="BazaarSaar tells you: 'You lose 70% of trades when you feel FOMO.' See which emotions cost you money — with real data."
              />
              <FeatureCard
                icon={<BookCheck size={22} className="text-cyan-500" />}
                title="Trading Checklists (चेकलिस्ट)"
                description="Like a recipe for cooking — step-by-step rules to follow before every trade. Pick a ready-made checklist or create your own."
              />
              <FeatureCard
                icon={<BarChart3 size={22} className="text-purple-500" />}
                title="Weekly Report Card (साप्ताहिक रिपोर्ट)"
                description="Every Sunday, see your week: wins, losses, emotions, and what to improve. Auto-generated. Takes 15 minutes to review."
              />
              <FeatureCard
                icon={<Upload size={22} className="text-[#9090aa]" />}
                title="Import from Your Broker"
                description="Connect Zerodha API or upload CSV from Groww, Angel One, Upstox. Your trades are auto-imported — no manual typing."
              />
              <FeatureCard
                icon={<GraduationCap size={22} className="text-green-500" />}
                title="Learn from Zero (शून्य से सीखें)"
                description="Don't know anything about trading? Our Learn section teaches basics in Hindi + English. No paid courses. YouTube myths debunked."
              />
            </div>
          </div>
        </section>

        {/* ─── Trust Signals ─── */}
        <section className="px-6 py-12 border-t border-white/[0.06]" aria-label="Trust signals">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-[#fafaff] text-center mb-2">
              Why Trust BazaarSaar?
            </h2>
            <p className="text-xs text-amber-500/70 text-center mb-8" lang="hi">
              BazaarSaar पर भरोसा क्यों करें?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <TrustCard
                icon={<Heart size={20} className="text-green-500" />}
                title="100% Free Forever"
                titleHi="हमेशा मुफ़्त"
                desc="No premium plan. No hidden charges. No paid courses. We don't sell anything."
              />
              <TrustCard
                icon={<XCircle size={20} className="text-red-500" />}
                title="No Tips, No Advice"
                titleHi="कोई tips नहीं, कोई सलाह नहीं"
                desc="We never tell you what to buy or sell. We only help you understand your OWN trading behavior."
              />
              <TrustCard
                icon={<Lock size={20} className="text-amber-500" />}
                title="Your Data is Yours"
                titleHi="आपका डेटा आपका"
                desc="Export or delete your data anytime. DPDP compliant. We don't sell your data to anyone."
              />
              <TrustCard
                icon={<Shield size={20} className="text-cyan-500" />}
                title="SEBI Honest"
                titleHi="SEBI के प्रति ईमानदार"
                desc="We show you the real SEBI data — 93% lose in F&O. No false promises. No &quot;easy money&quot; claims."
              />
            </div>
          </div>
        </section>

        {/* ─── How It Works (Simple Steps) ─── */}
        <section className="px-6 py-14 border-t border-white/[0.06]" aria-label="How it works">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-bold text-[#fafaff] text-center mb-2">
              How to Start (Takes 2 Minutes)
            </h2>
            <p className="text-xs text-amber-500/70 text-center mb-10" lang="hi">
              कैसे शुरू करें (2 मिनट लगेंगे)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <StepCard step={1} title="Sign Up for Free" titleHi="मुफ़्त साइन अप करें" description="Just email and password. No phone number, no KYC, no credit card. Takes 30 seconds." />
              <StepCard step={2} title="Import or Add Trades" titleHi="Trades import या add करें" description="Connect your Zerodha, upload CSV, or type trades manually. Your choice." />
              <StepCard step={3} title="Write & Learn" titleHi="लिखें और सीखें" description="After each trade, write why you took it and how you felt. In 2 weeks, you'll see your patterns." />
            </div>
          </div>
        </section>

        {/* ─── Who Is This For ─── */}
        <section className="px-6 py-12 border-t border-white/[0.06]" aria-label="Who is this for">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-lg font-bold text-[#fafaff] mb-2">
              BazaarSaar Is For You If...
            </h2>
            <p className="text-xs text-amber-500/70 mb-8" lang="hi">
              BazaarSaar आपके लिए है अगर...
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <WhoCard text="You just started trading and feel lost" textHi="आपने अभी trading शुरू की है और confused हैं" />
              <WhoCard text="You keep losing money but don't know why" textHi="पैसे डूब रहे हैं लेकिन पता नहीं क्यों" />
              <WhoCard text="You learned from YouTube but still can't profit" textHi="YouTube से सीखा लेकिन फ़ायदा नहीं हो रहा" />
              <WhoCard text="You trade based on emotions (FOMO, revenge)" textHi="भावनाओं (FOMO, बदला) से trade करते हैं" />
              <WhoCard text="You want to improve but don't know how" textHi="सुधरना चाहते हैं लेकिन तरीक़ा नहीं पता" />
              <WhoCard text="You want honest tools, not paid tips groups" textHi="ईमानदार tools चाहिए, paid tips groups नहीं" />
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="px-6 py-16 border-t border-white/[0.06]" aria-label="Frequently asked questions">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-[#fafaff] text-center mb-2">
              Common Questions
            </h2>
            <p className="text-xs text-amber-500/70 text-center mb-8" lang="hi">
              अक्सर पूछे जाने वाले सवाल
            </p>
            <div className="space-y-4">
              <FaqItem
                question="What is a trade journal? / ट्रेड जर्नल क्या है?"
                answer="A trade journal is like a diary for your trades. After each trade, you write: Why did I buy? How was I feeling? What happened? Professional traders have kept journals for decades. It's the #1 tool for improving. / ट्रेड जर्नल आपके trades की डायरी है। हर trade के बाद लिखें: मैंने क्यों ख़रीदा? मेरा mood कैसा था? क्या हुआ?"
              />
              <FaqItem
                question="I don't know anything about trading. Can I still use this? / मुझे trading कुछ नहीं आती। क्या फिर भी use कर सकता हूँ?"
                answer="Yes! BazaarSaar is built for complete beginners. Our Learn section teaches everything from zero — what is a stock, what is stop-loss, how brokers work. All in simple Hindi and English. / हाँ! BazaarSaar beginners के लिए बना है। Learn section में सब कुछ शून्य से सिखाया गया है — शेयर क्या है, stop-loss क्या है, broker कैसे काम करता है।"
              />
              <FaqItem
                question="Is this really free? What's the catch? / ये सच में मुफ़्त है? पकड़ क्या है?"
                answer="100% free. No premium plan, no hidden charges, no courses to sell. BazaarSaar is a community project. We believe every Indian trader deserves honest tools, not expensive courses. / पूरी तरह मुफ़्त। कोई premium plan नहीं, कोई छिपे charges नहीं। हम मानते हैं हर Indian trader को ईमानदार tools मिलने चाहिए।"
              />
              <FaqItem
                question="Will BazaarSaar tell me what stocks to buy? / क्या BazaarSaar बताएगा कौन सा शेयर ख़रीदें?"
                answer="No. BazaarSaar NEVER gives buy/sell tips. We help you understand YOUR OWN behavior — which emotions make you lose money, which habits help you win. The answers are in your data, not in someone else's tips. / नहीं। BazaarSaar कभी tips नहीं देता। हम आपको आपका अपना व्यवहार समझने में मदद करते हैं।"
              />
              <FaqItem
                question="Which brokers work with BazaarSaar? / कौन से brokers BazaarSaar के साथ काम करते हैं?"
                answer="Zerodha (API auto-sync + CSV), Groww (CSV), Angel One (CSV), and Upstox (CSV). You can also add trades manually. We auto-detect your broker's format. / Zerodha (API auto-sync + CSV), Groww (CSV), Angel One (CSV), और Upstox (CSV)। आप manually भी trades add कर सकते हैं।"
              />
              <FaqItem
                question="What if I don't use any broker yet? / अगर मैं अभी कोई broker use नहीं करता?"
                answer="You can still sign up and start with the Learn section. Read the basics, understand how the market works, and when you're ready, open a broker account and start journaling. / आप फिर भी sign up करें और Learn section से शुरू करें। बुनियादी बातें पढ़ें, बाज़ार समझें, और जब तैयार हों तो broker account खोलें।"
              />
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="px-6 py-16 border-t border-white/[0.06] text-center">
          <h2 className="text-2xl font-bold text-[#fafaff] mb-2">
            Stop Guessing. Start Understanding.
          </h2>
          <p className="text-sm text-amber-500/70 mb-4" lang="hi">
            अंदाज़ा लगाना बंद करें। समझना शुरू करें।
          </p>
          <p className="text-sm text-[#6b6b8a] mb-8 max-w-md mx-auto">
            Every professional trader journals their trades. Start yours today — for free.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-[#0d0d14] bg-green-500 hover:bg-green-400 transition-colors no-underline"
          >
            Start Free — शुरू करें
            <ArrowRight size={16} />
          </Link>
          <p className="text-[11px] text-[#4a4a6a] mt-4">
            No credit card. No phone number. Just email and go.
          </p>
        </section>

        {/* ─── Footer ─── */}
        <footer className="border-t border-white/[0.06] px-6 py-6 text-center">
          <p className="text-[11px] text-[#4a4a6a] max-w-2xl mx-auto mb-3">
            BazaarSaar is a journaling and learning tool — not a trading platform.
            We do not provide investment advice, tips, or recommendations.
            Trading in securities market is subject to market risks. SEBI registration is not required for journaling tools.
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

/* ─── Sub-components ─── */

function MythRow({ myth, mythHi, reality, realityHi }: { myth: string; mythHi: string; reality: string; realityHi: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/[0.03]">
        <div className="flex items-start gap-2 mb-1">
          <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
          <span className="text-[10px] text-red-400 uppercase tracking-wider font-medium">YouTube Says</span>
        </div>
        <p className="text-sm text-[#d4d4e8] leading-relaxed" dangerouslySetInnerHTML={{ __html: myth }} />
        <p className="text-[11px] text-amber-500/60 mt-1" lang="hi" dangerouslySetInnerHTML={{ __html: mythHi }} />
      </div>
      <div className="p-4 rounded-xl border border-green-500/10 bg-green-500/[0.03]">
        <div className="flex items-start gap-2 mb-1">
          <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
          <span className="text-[10px] text-green-400 uppercase tracking-wider font-medium">Reality</span>
        </div>
        <p className="text-sm text-[#d4d4e8] leading-relaxed">{reality}</p>
        <p className="text-[11px] text-amber-500/60 mt-1" lang="hi">{realityHi}</p>
      </div>
    </div>
  );
}

function RoadStep({ step, color, title, titleHi, desc, descHi, action, href }: {
  step: number; color: string; title: string; titleHi: string; desc: string; descHi: string; action?: string; href?: string;
}) {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-500' },
  };
  const c = colorMap[color] || colorMap.green;

  return (
    <div className="flex gap-4 sm:gap-6">
      <div className={`w-12 h-12 rounded-full ${c.bg} border ${c.border} flex items-center justify-center shrink-0 z-10`}>
        <span className={`${c.text} font-bold text-sm`}>{step}</span>
      </div>
      <div className="flex-1 pb-2">
        <h3 className="text-sm font-semibold text-[#d4d4e8] mb-0.5">{title}</h3>
        <p className="text-[11px] text-amber-500/60 mb-2" lang="hi">{titleHi}</p>
        <p className="text-xs text-[#6b6b8a] leading-relaxed mb-1">{desc}</p>
        <p className="text-[11px] text-amber-500/50 leading-relaxed" lang="hi">{descHi}</p>
        {action && href && (
          <Link
            href={href}
            className={`inline-flex items-center gap-1 mt-3 text-xs font-medium ${c.text} hover:underline no-underline`}
          >
            {action} <ArrowRight size={12} />
          </Link>
        )}
      </div>
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

function TrustCard({ icon, title, titleHi, desc }: { icon: React.ReactNode; title: string; titleHi: string; desc: string }) {
  return (
    <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <h3 className="text-sm font-semibold text-[#d4d4e8] mb-0.5">{title}</h3>
      <p className="text-[10px] text-amber-500/60 mb-2" lang="hi">{titleHi}</p>
      <p className="text-xs text-[#6b6b8a] leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ step, title, titleHi, description }: { step: number; title: string; titleHi: string; description: string }) {
  return (
    <div>
      <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-3">
        <span className="text-green-500 font-bold text-sm">{step}</span>
      </div>
      <h3 className="text-sm font-semibold text-[#d4d4e8] mb-0.5">{title}</h3>
      <p className="text-[10px] text-amber-500/60 mb-2" lang="hi">{titleHi}</p>
      <p className="text-xs text-[#6b6b8a] leading-relaxed">{description}</p>
    </div>
  );
}

function WhoCard({ text, textHi }: { text: string; textHi: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
      <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm text-[#d4d4e8]">{text}</p>
        <p className="text-[11px] text-amber-500/60" lang="hi">{textHi}</p>
      </div>
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
