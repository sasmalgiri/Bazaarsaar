'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, Clock, ChevronDown, ChevronUp, TrendingUp, Brain, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  titleHi: string;
  excerpt: string;
  excerptHi: string;
  body: string[];
  bodyHi: string[];
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
    excerpt: 'SEBI released shocking data in 2023. We break it down in simple language.',
    excerptHi: 'SEBI ने 2023 में चौंकाने वाला डेटा जारी किया।',
    body: [
      'In January 2023, SEBI (Securities and Exchange Board of India) published a study of 1 crore+ F&O traders over 3 years (FY19-FY22). The result? 93% of individual F&O traders LOST money. The average loss was ₹1.1 lakh per person per year.',
      'Why does this happen? Three main reasons: (1) Overtrading — taking too many trades without a plan. (2) No risk management — not setting a stop-loss or max daily loss. (3) Emotional decisions — revenge trading after losses, FOMO buying when stocks are already up.',
      'What can you do differently? The 7% who made money had something in common: they followed a process. They had checklists, they journaled their trades, and they set rules BEFORE the market opened.',
      'This is exactly what BazaarSaar helps you build — a disciplined process. Fill your morning checklist, journal every trade, and review your weekly report card. You can\'t control the market, but you CAN control your behavior.',
    ],
    bodyHi: [
      'जनवरी 2023 में, SEBI ने 3 साल (FY19-FY22) में 1 करोड़+ F&O traders का अध्ययन प्रकाशित किया। नतीजा? 93% individual F&O traders ने पैसे गंवाए। औसत नुकसान ₹1.1 लाख प्रति व्यक्ति प्रति वर्ष था।',
      'ऐसा क्यों होता है? तीन मुख्य कारण: (1) Overtrading — बिना plan के बहुत ज़्यादा trades। (2) कोई risk management नहीं — stop-loss या max daily loss तय नहीं करना। (3) भावनात्मक फ़ैसले — नुकसान के बाद revenge trading, stocks ऊपर जा रहे हों तो FOMO से खरीदना।',
      'आप अलग क्या कर सकते हैं? जिन 7% ने पैसे कमाए, उनमें एक बात common थी: वे एक process follow करते थे। उनके पास checklists थीं, वे trades journal करते थे, और बाज़ार खुलने से पहले नियम तय करते थे।',
      'BazaarSaar यही बनाने में मदद करता है — एक अनुशासित process। सुबह की checklist भरें, हर trade journal करें, और weekly report card देखें।',
    ],
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
    excerpt: 'A trade journal is a diary of your trades. Here\'s why it matters.',
    excerptHi: 'Trade journal आपके trades की diary है। यह क्यों ज़रूरी है।',
    body: [
      'A trade journal is simply a record of every trade you take. But it\'s more than just price and quantity — you write down WHY you took the trade, HOW you were feeling, and WHAT you learned.',
      'Think of it like a cricket player reviewing match footage. They don\'t just look at the score — they analyze their technique, their shot selection, their mistakes. A trade journal does the same for your trading.',
      'What to write for each trade: (1) Why did I enter? What was my reason? (2) How was I feeling — calm, anxious, excited, scared? (3) Did I follow my rules/checklist? (4) What was the result? (5) What would I do differently next time?',
      'After 20-30 journaled trades, patterns start appearing. You\'ll notice things like: "I lose money every time I trade when I\'m frustrated" or "My best trades happen when I follow my checklist." These patterns are worth more than any YouTube tip.',
    ],
    bodyHi: [
      'Trade journal बस आपके हर trade का record है। लेकिन यह सिर्फ़ price और quantity से ज़्यादा है — आप लिखते हैं कि trade क्यों लिया, कैसा feel हो रहा था, और क्या सीखा।',
      'इसे ऐसे समझें जैसे एक cricket player match footage review करता है। वह सिर्फ़ score नहीं देखता — technique, shot selection, mistakes analyze करता है। Trade journal आपकी trading के लिए यही करता है।',
      'हर trade के लिए क्या लिखें: (1) क्यों enter किया? कारण क्या था? (2) कैसा feel हो रहा था — शांत, चिंतित, उत्साहित, डरा हुआ? (3) क्या अपने rules/checklist follow की? (4) नतीजा क्या रहा? (5) अगली बार क्या अलग करूंगा?',
      '20-30 journaled trades के बाद patterns दिखने लगते हैं। जैसे: "जब frustrated होकर trade करता हूँ तो पैसे हारता हूँ" या "checklist follow करने पर सबसे अच्छे trades होते हैं।"',
    ],
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
    excerpt: 'Lost money and jumped into another trade to recover? That\'s revenge trading.',
    excerptHi: 'पैसे गंवाए और recover करने के लिए दूसरा trade ले लिया? यह revenge trading है।',
    body: [
      'Revenge trading is when you lose money on a trade and immediately take another trade to "get it back." It feels urgent — like you NEED to recover that loss right now. But this urgency is your enemy.',
      'Why it happens: When we lose money, our brain triggers a fight-or-flight response. We feel angry, frustrated, and desperate. In this state, we make impulsive decisions — bigger position sizes, ignoring our rules, taking trades without a setup.',
      'The math is brutal: If you lose ₹5,000 and then revenge trade with double the size, you could lose ₹10,000. Now you\'ve turned a small loss into a big one. This is how accounts get "blown up."',
      'How to stop: (1) Set a max daily loss BEFORE the market opens. Hit it? Close the app. (2) After any loss, take a 15-minute break. Walk away from the screen. (3) Use BazaarSaar\'s morning checklist and mood check. If you\'re frustrated, the app will warn you. (4) Remember: the market will be there tomorrow. There will always be another trade.',
    ],
    bodyHi: [
      'Revenge trading तब होती है जब आप एक trade में पैसे हारते हैं और तुरंत दूसरा trade लेते हैं "वापस पाने" के लिए। ऐसा लगता है कि अभी recover करना ज़रूरी है। लेकिन यह urgency आपकी दुश्मन है।',
      'ऐसा क्यों होता है: जब हम पैसे हारते हैं, दिमाग fight-or-flight response trigger करता है। हम गुस्सा, निराश और बेचैन महसूस करते हैं। इस हालत में impulsive decisions लेते हैं।',
      'गणित भयानक है: अगर ₹5,000 हारे और revenge trade में double size लिया, तो ₹10,000 हार सकते हैं। छोटा नुकसान बड़ा हो गया। ऐसे ही accounts "उड़" जाते हैं।',
      'कैसे रोकें: (1) बाज़ार खुलने से पहले max daily loss तय करें। Hit हो? App बंद करो। (2) किसी भी नुकसान के बाद 15 मिनट का break लो। (3) Morning checklist और mood check करें। (4) याद रखें: बाज़ार कल भी रहेगा।',
    ],
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
    excerpt: 'Profitable traders don\'t jump into charts. They start with a checklist.',
    excerptHi: 'Profitable traders charts में नहीं कूदते। वे checklist से शुरू करते हैं।',
    body: [
      'Most traders wake up, open their broker app, and start trading. No plan, no rules, no limits. That\'s like driving without a seatbelt — you might be fine, but when things go wrong, the damage is severe.',
      'Here\'s a simple 15-minute routine that works: (1) 8:45 AM — Check Gift Nifty and global markets. Are US/Asia markets up or down? This gives you a sense of where Indian markets might open. (2) 8:50 AM — Read today\'s news headlines. Any RBI announcement? Company results? F&O expiry?',
      '(3) 8:55 AM — Fill your BazaarSaar morning checklist. Check your mood, set your max loss (e.g., ₹2,000), set your target profit, and write 1-2 lines about your plan. (4) 9:00 AM — Review your watchlist. Which 3-5 stocks are you watching today? What price levels matter?',
      '(5) 9:10 AM — Wait for the first 15 minutes after market opens (9:15-9:30). This is the most volatile period. Don\'t trade in the first 15 minutes. Let the market settle. Then execute your plan.',
    ],
    bodyHi: [
      'ज़्यादातर traders सुबह उठते हैं, broker app खोलते हैं, और trade करना शुरू कर देते हैं। कोई plan नहीं, कोई rules नहीं, कोई limits नहीं। यह बिना seatbelt के गाड़ी चलाने जैसा है।',
      'यह रहा एक 15 मिनट का routine: (1) 8:45 AM — Gift Nifty और global markets check करें। US/Asia markets ऊपर हैं या नीचे? (2) 8:50 AM — आज की news headlines पढ़ें। कोई RBI announcement? Company results?',
      '(3) 8:55 AM — BazaarSaar morning checklist भरें। Mood check करें, max loss तय करें (जैसे ₹2,000), target profit तय करें, plan लिखें। (4) 9:00 AM — Watchlist review करें। आज कौन से 3-5 stocks देख रहे हैं?',
      '(5) 9:10 AM — Market खुलने के पहले 15 मिनट (9:15-9:30) wait करें। यह सबसे volatile period है। पहले 15 मिनट trade न करें। Market settle होने दें। फिर अपना plan execute करें।',
    ],
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
    excerpt: 'FOMO = Fear Of Missing Out. Learn to recognize and resist it.',
    excerptHi: 'FOMO = छूट जाने का डर। पहचानना और रुकना सीखें।',
    body: [
      'FOMO = Fear Of Missing Out. In trading, it looks like this: A stock has gone up 15% in two days. Your WhatsApp groups are buzzing. Twitter is full of screenshots showing huge profits. You think: "If I don\'t buy NOW, I\'ll miss the move!"',
      'So you buy at the top. And then the stock drops 5% the next day. You\'re stuck with a loss while everyone who bought earlier takes profit. Sound familiar?',
      'Why FOMO is so dangerous: (1) You buy without a plan or setup — pure emotion. (2) You buy at high prices where risk/reward is terrible. (3) You use bigger position sizes because you\'re desperate. (4) When the stock drops, you hold and hope instead of cutting your loss.',
      'How to beat FOMO: (1) Have a watchlist BEFORE the day starts. If a stock isn\'t on your list, don\'t buy it. (2) Ask yourself: "Would I buy this at this price if nobody else was talking about it?" (3) Remember: there are 250 trading days a year. Missing one trade is nothing. (4) Use BazaarSaar\'s mood check — if you select "FOMO," the app warns you to pause.',
    ],
    bodyHi: [
      'FOMO = छूट जाने का डर। Trading में यह ऐसा दिखता है: एक stock 2 दिन में 15% ऊपर गया। WhatsApp groups में चर्चा है। Twitter पर बड़े profit के screenshots हैं। आप सोचते हैं: "अभी नहीं खरीदा तो miss हो जाएगा!"',
      'तो आप top पर खरीदते हैं। अगले दिन stock 5% गिर जाता है। जिन्होंने पहले खरीदा था वे profit book कर रहे हैं और आप loss में फंसे हैं।',
      'FOMO इतना ख़तरनाक क्यों है: (1) बिना plan या setup के खरीदते हैं — pure भावना। (2) ऊंची कीमत पर खरीदते हैं जहां risk/reward बहुत ख़राब है। (3) बड़ी quantity लेते हैं क्योंकि बेचैन हैं। (4) Stock गिरे तो hold करते हैं और उम्मीद करते हैं।',
      'FOMO कैसे हराएं: (1) दिन शुरू होने से पहले watchlist बनाएं। List में नहीं है तो न खरीदें। (2) खुद से पूछें: "अगर कोई और इसके बारे में बात नहीं कर रहा होता, तो क्या इस price पर खरीदता?" (3) याद रखें: साल में 250 trading days हैं। एक trade miss करना कुछ नहीं।',
    ],
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
    excerpt: 'Those red and green bars? They\'re called candlesticks. Here\'s the simplest explanation.',
    excerptHi: 'वो लाल और हरी bars? उन्हें candlesticks कहते हैं। सबसे आसान explanation।',
    body: [
      'Open any stock chart and you\'ll see colored bars — green (or white) and red (or black). These are called "candlesticks." Each candlestick represents one time period (1 minute, 1 hour, 1 day — depending on your chart setting).',
      'Every candlestick tells you 4 things: (1) Open — the price when that period started. (2) Close — the price when that period ended. (3) High — the highest price during that period. (4) Low — the lowest price during that period.',
      'Green candle = price went UP. The bottom of the thick part is where it opened, and the top is where it closed. Red candle = price went DOWN. The top of the thick part is where it opened, and the bottom is where it closed. The thin lines above and below (called "wicks" or "shadows") show the high and low.',
      'That\'s it! You don\'t need to memorize 100 patterns. Just understanding these basics lets you read any stock chart. Green = buyers won that period. Red = sellers won. Long wicks = there was a fight between buyers and sellers.',
    ],
    bodyHi: [
      'कोई भी stock chart खोलें और आपको रंगीन bars दिखेंगी — हरी (या सफ़ेद) और लाल (या काली)। इन्हें "candlesticks" कहते हैं। हर candlestick एक समय अवधि दर्शाती है (1 मिनट, 1 घंटा, 1 दिन)।',
      'हर candlestick 4 बातें बताती है: (1) Open — उस period की शुरुआत की कीमत। (2) Close — उस period के अंत की कीमत। (3) High — उस period की सबसे ऊंची कीमत। (4) Low — उस period की सबसे नीची कीमत।',
      'हरी candle = कीमत ऊपर गई। मोटे हिस्से का नीचे open है, ऊपर close। लाल candle = कीमत नीचे गई। मोटे हिस्से का ऊपर open है, नीचे close। ऊपर-नीचे की पतली lines ("wicks") high और low दिखाती हैं।',
      'बस! आपको 100 patterns याद करने की ज़रूरत नहीं। बस यह basics समझ लें तो कोई भी stock chart पढ़ सकते हैं। हरी = buyers जीते। लाल = sellers जीते।',
    ],
    category: 'Beginner',
    categoryColor: 'bg-green-500/10 text-green-500',
    readTime: '7 min',
    date: '2026-02-20',
    icon: TrendingUp,
  },
];

function BlogPostCard({ post }: { post: BlogPost }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlassCard className="p-5 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
          <post.icon size={20} className="text-[#6b6b8a]" />
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
          <h2 className="text-base font-semibold text-[#d4d4e8] mb-0.5 leading-snug">
            {post.title}
          </h2>
          <p className="text-[11px] text-amber-500/50 mb-2" lang="hi">{post.titleHi}</p>

          {/* Excerpt (always visible) */}
          <p className="text-xs text-[#6b6b8a] leading-relaxed">{post.excerpt}</p>
          <p className="text-[10px] text-amber-500/40 leading-relaxed" lang="hi">{post.excerptHi}</p>

          {/* Full article content (expandable) */}
          {expanded && (
            <div className="mt-4 space-y-3 pt-3 border-t border-white/[0.06]">
              {post.body.map((para, i) => (
                <div key={i}>
                  <p className="text-sm text-[#b0b0c8] leading-relaxed">{para}</p>
                  <p className="text-[11px] text-amber-500/40 mt-1 leading-relaxed" lang="hi">{post.bodyHi[i]}</p>
                </div>
              ))}
            </div>
          )}

          {/* Read more / collapse toggle */}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 mt-3 text-[11px] font-medium text-green-500 bg-transparent border-none cursor-pointer hover:underline p-0"
          >
            {expanded ? (
              <>Collapse <ChevronUp size={10} /></>
            ) : (
              <>Read full article <ChevronDown size={10} /></>
            )}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

export default function BlogPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim() || !email.includes('@')) return;
    setSubscribing(true);
    try {
      const supabase = createClient();
      await supabase.from('audit_event').insert({
        event_type: 'newsletter_subscribe',
        payload: { email: email.trim() },
        user_id: null,
      });
    } catch {
      // best-effort
    }
    setSubscribed(true);
    setSubscribing(false);
    setEmail('');
  };

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

      {/* Blog Posts */}
      <div className="space-y-4 mb-8">
        {BLOG_POSTS.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Newsletter CTA */}
      <GlassCard className="p-6 text-center mb-8">
        {subscribed ? (
          <div className="flex items-center justify-center gap-2 py-4">
            <CheckCircle2 size={20} className="text-green-500" />
            <div>
              <p className="text-sm font-medium text-green-500">Subscribed! We&apos;ll keep you posted.</p>
              <p className="text-[10px] text-amber-500/50" lang="hi">Subscribe हो गया! हम आपको अपडेट करते रहेंगे।</p>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-base font-bold text-[#fafaff] mb-1">Get new articles in your inbox</h3>
            <p className="text-[11px] text-amber-500/50 mb-3" lang="hi">नए articles अपने inbox में पाएं</p>
            <p className="text-xs text-[#6b6b8a] mb-4 max-w-md mx-auto">
              One email per week. No spam, no tips. Just honest trading knowledge.
              <span className="text-amber-500/40 ml-1" lang="hi">हफ़्ते में एक email। कोई spam नहीं।</span>
            </p>
            <div className="flex items-center gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30"
              />
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={subscribing || !email.includes('@')}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {subscribing ? 'Saving...' : 'Subscribe'}
              </button>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
}
