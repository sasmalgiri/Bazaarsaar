'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Tag, TrendingUp, Brain, AlertTriangle, Sparkles } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  titleHi: string;
  excerpt: string;
  excerptHi: string;
  category: string;
  categoryColor: string;
  readTime: string;
  date: string;
  icon: typeof BookOpen;
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-93-percent-traders-lose',
    title: 'Why 93% of Indian F&O traders lose money (SEBI data explained)',
    titleHi: '93% भारतीय F&O traders पैसे क्यों हारते हैं (SEBI डेटा समझें)',
    excerpt: 'SEBI released shocking data in 2023. We break it down in simple language — what it means for you, why it happens, and how journaling can help you be in the 7%.',
    excerptHi: 'SEBI ने 2023 में चौंकाने वाला डेटा जारी किया। हम इसे आसान भाषा में समझाते हैं — आपके लिए इसका क्या मतलब है, ऐसा क्यों होता है, और journaling कैसे मदद कर सकती है।',
    category: 'Must Read',
    categoryColor: 'bg-red-500/10 text-red-400',
    readTime: '5 min',
    date: '2026-03-10',
    icon: AlertTriangle,
  },
  {
    slug: 'what-is-trade-journal',
    title: 'What is a trade journal and why every trader needs one',
    titleHi: 'Trade journal क्या है और हर trader को क्यों चाहिए',
    excerpt: 'A trade journal is simply a diary of your trades — what you bought, why, how you felt, and what happened. Here\'s how it turns losing traders into winning ones.',
    excerptHi: 'Trade journal बस आपके trades की diary है — क्या खरीदा, क्यों, कैसा feel हुआ, और क्या हुआ। यह कैसे हारने वाले traders को जीतने वाला बनाता है।',
    category: 'Beginner',
    categoryColor: 'bg-green-500/10 text-green-500',
    readTime: '4 min',
    date: '2026-03-08',
    icon: BookOpen,
  },
  {
    slug: 'revenge-trading-how-to-stop',
    title: 'Revenge trading: What it is and how to stop it',
    titleHi: 'Revenge trading: ये क्या है और इसे कैसे रोकें',
    excerpt: 'Lost money and immediately jumped into another trade to "recover"? That\'s revenge trading. It\'s the #1 reason traders blow up their accounts. Here\'s how to break the cycle.',
    excerptHi: 'पैसे गंवाए और "recover" करने के लिए तुरंत दूसरा trade ले लिया? यह revenge trading है। यही कारण है कि traders अपना account उड़ा देते हैं। इस चक्र को कैसे तोड़ें।',
    category: 'Psychology',
    categoryColor: 'bg-purple-500/10 text-purple-400',
    readTime: '6 min',
    date: '2026-03-05',
    icon: Brain,
  },
  {
    slug: 'morning-routine-for-traders',
    title: 'The 15-minute morning routine that changed my trading',
    titleHi: '15 मिनट की सुबह की routine जिसने मेरी trading बदल दी',
    excerpt: 'Most traders jump straight into charts. Profitable traders start with a checklist, set limits, and check their mood. Here\'s the exact routine that works.',
    excerptHi: 'ज़्यादातर traders सीधे charts में कूद पड़ते हैं। profitable traders checklist से शुरू करते हैं, limits तय करते हैं, और mood check करते हैं। यह रहा exact routine।',
    category: 'Process',
    categoryColor: 'bg-amber-500/10 text-amber-500',
    readTime: '4 min',
    date: '2026-03-01',
    icon: Sparkles,
  },
  {
    slug: 'fomo-explained-for-beginners',
    title: 'FOMO in trading: Why you buy at the top (and how to stop)',
    titleHi: 'Trading में FOMO: आप top पर क्यों खरीदते हैं (और कैसे रुकें)',
    excerpt: 'FOMO = Fear Of Missing Out. When a stock is flying up and everyone\'s buying, you feel the urge to jump in. That\'s usually when the smart money is selling. Learn to recognize and resist.',
    excerptHi: 'FOMO = छूट जाने का डर। जब stock तेज़ी से ऊपर जा रहा है और सब खरीद रहे हैं, आप भी कूदना चाहते हैं। लेकिन तभी smart money बेच रही होती है। पहचानना और रुकना सीखें।',
    category: 'Psychology',
    categoryColor: 'bg-purple-500/10 text-purple-400',
    readTime: '5 min',
    date: '2026-02-25',
    icon: Brain,
  },
  {
    slug: 'how-to-read-candlestick-chart',
    title: 'How to read a candlestick chart (explained like you\'re 5)',
    titleHi: 'Candlestick chart कैसे पढ़ें (बिल्कुल आसान भाषा में)',
    excerpt: 'Those red and green bars on charts? They\'re called candlesticks. Each one tells a story: where the price started, how high/low it went, and where it ended. Here\'s the simplest explanation.',
    excerptHi: 'Charts पर वो लाल और हरी bars? उन्हें candlesticks कहते हैं। हर एक एक कहानी बताती है: price कहां शुरू हुई, कितनी ऊपर/नीचे गई, और कहां खत्म हुई।',
    category: 'Beginner',
    categoryColor: 'bg-green-500/10 text-green-500',
    readTime: '7 min',
    date: '2026-02-20',
    icon: TrendingUp,
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={28} className="text-amber-500" />
          <div>
            <h1 className="text-2xl font-bold text-[#fafaff]">Blog & Guides</h1>
            <p className="text-sm text-amber-500/70" lang="hi">ब्लॉग और गाइड</p>
          </div>
        </div>
        <p className="text-sm text-[#6b6b8a]">
          Simple, honest articles about trading, psychology, and building better habits. No hype, no tips, no &quot;guaranteed returns.&quot;
        </p>
        <p className="text-[11px] text-amber-500/50 mt-1" lang="hi">
          Trading, psychology, और बेहतर आदतें बनाने के बारे में सरल, ईमानदार लेख। कोई hype नहीं, कोई tips नहीं।
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', 'Beginner', 'Psychology', 'Process', 'Must Read'].map((cat) => (
          <span
            key={cat}
            className="px-3 py-1.5 rounded-lg text-xs text-[#6b6b8a] border border-white/[0.06] bg-white/[0.02]"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Blog Posts */}
      <div className="space-y-4 mb-8">
        {BLOG_POSTS.map((post) => (
          <GlassCard key={post.slug} className="p-5 hover:border-white/[0.15] transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                <post.icon size={20} className="text-[#6b6b8a] group-hover:text-[#d4d4e8] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                {/* Meta */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${post.categoryColor}`}>
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[#4a4a6a]">
                    <Clock size={10} />
                    {post.readTime} read
                  </span>
                  <span className="text-[10px] text-[#4a4a6a]">
                    {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-base font-semibold text-[#d4d4e8] group-hover:text-[#fafaff] transition-colors mb-0.5 leading-snug">
                  {post.title}
                </h2>
                <p className="text-[11px] text-amber-500/50 mb-2" lang="hi">{post.titleHi}</p>

                {/* Excerpt */}
                <p className="text-xs text-[#6b6b8a] leading-relaxed mb-1">{post.excerpt}</p>
                <p className="text-[10px] text-amber-500/40 leading-relaxed" lang="hi">{post.excerptHi}</p>

                {/* Read more */}
                <span className="inline-flex items-center gap-1 mt-3 text-[11px] font-medium text-green-500 group-hover:underline">
                  Read full article <ArrowRight size={10} />
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Newsletter CTA */}
      <GlassCard className="p-6 text-center mb-8">
        <h3 className="text-base font-bold text-[#fafaff] mb-1">Get new articles in your inbox</h3>
        <p className="text-[11px] text-amber-500/50 mb-3" lang="hi">नए articles अपने inbox में पाएं</p>
        <p className="text-xs text-[#6b6b8a] mb-4 max-w-md mx-auto">
          One email per week. No spam, no tips. Just honest trading knowledge.
          <span className="text-amber-500/40 ml-1" lang="hi">हफ़्ते में एक email। कोई spam नहीं।</span>
        </p>
        <div className="flex items-center gap-2 max-w-sm mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30"
          />
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
