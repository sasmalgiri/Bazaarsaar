'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';
import {
  BookOpen, TrendingDown, Brain, Shield, Target,
  BarChart3, Flame, AlertTriangle, CheckCircle2, ArrowRight,
  ChevronDown, ChevronUp, Lightbulb, Heart, Scale,
  IndianRupee, Receipt, Skull, Eye, Clock, Zap,
  Ban, Users, GraduationCap, CalendarCheck
} from 'lucide-react';

interface Lesson {
  id: string;
  icon: typeof BookOpen;
  iconColor: string;
  title: string;
  titleHi: string;
  content: string;
  contentHi: string;
  example?: string;
  exampleHi?: string;
  tip?: string;
  tipHi?: string;
}

interface Module {
  id: string;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  icon: typeof BookOpen;
  iconColor: string;
  borderColor: string;
  lessons: Lesson[];
}

const MODULES: Module[] = [
  // ─────────────────────────────────────────────────
  // MODULE 1: Getting Started
  // ─────────────────────────────────────────────────
  {
    id: 'getting-started',
    title: 'Getting Started',
    titleHi: 'शुरुआत करें',
    subtitle: 'Opened a Demat account? Read this first.',
    subtitleHi: 'Demat खाता खोला है? पहले यह पढ़ें।',
    icon: GraduationCap,
    iconColor: 'text-green-500',
    borderColor: 'border-green-500/30',
    lessons: [
      {
        id: 'first-90-days',
        icon: CalendarCheck,
        iconColor: 'text-green-500',
        title: 'Your First 90 Days After Opening a Demat Account',
        titleHi: 'Demat खाता खोलने के बाद पहले 90 दिन',
        content: 'Most people open a Demat account after watching a YouTube video and immediately start trading. This is the #1 reason for losses. Here\'s what you should actually do:\n\nDays 1-30: DON\'T TRADE. Just watch the market. Learn how prices move. Understand what Nifty and Sensex mean. Read your broker app\'s help section.\n\nDays 31-60: Start with delivery-based equity only (NOT F&O, NOT intraday). Buy 1-2 quality stocks with small amounts (₹2,000-₹5,000). Learn to read your contract note.\n\nDays 61-90: Start journaling every trade. Import your trades to BazaarSaar. Write why you bought. Set your first stop-loss. Begin your weekly review habit.',
        contentHi: 'ज़्यादातर लोग YouTube वीडियो देखकर Demat खाता खोलते हैं और तुरंत ट्रेडिंग शुरू कर देते हैं। यही नुकसान का #1 कारण है। यह करें:\n\nदिन 1-30: ट्रेड मत करो। बस बाज़ार देखो। कीमतें कैसे चलती हैं सीखो। Nifty और Sensex का मतलब समझो।\n\nदिन 31-60: सिर्फ delivery-based equity से शुरू करो (F&O नहीं, intraday नहीं)। छोटी रकम (₹2,000-₹5,000) से 1-2 अच्छे stocks खरीदो।\n\nदिन 61-90: हर ट्रेड जर्नल करना शुरू करो। BazaarSaar में ट्रेड import करो। पहला stop-loss लगाओ। Weekly review की आदत बनाओ।',
        tip: 'No one becomes a doctor in 90 days. Trading is a skill that takes time. Be patient with yourself.',
        tipHi: 'कोई 90 दिन में डॉक्टर नहीं बनता। ट्रेडिंग एक कौशल है जिसमें समय लगता है। खुद पर धैर्य रखें।',
      },
      {
        id: 'what-is-journal',
        icon: BookOpen,
        iconColor: 'text-green-500',
        title: 'What is a Trading Journal?',
        titleHi: 'ट्रेडिंग जर्नल क्या है?',
        content: 'A trading journal is like a diary for your trades. After every trade, you write down WHY you bought or sold, how you FELT, and whether you followed your RULES. Over time, this diary shows you your patterns — when you make good decisions and when emotions make you lose money.\n\nThink of it like a student\'s notebook. A student who writes notes and reviews them scores better in exams. A trader who journals and reviews trades makes fewer mistakes.',
        contentHi: 'ट्रेडिंग जर्नल आपके ट्रेड की डायरी है। हर ट्रेड के बाद आप लिखते हैं कि क्यों खरीदा या बेचा, कैसा महसूस किया, और क्या अपने नियम पालन किए। समय के साथ यह डायरी आपके पैटर्न दिखाती है — कब आप अच्छे फ़ैसले लेते हैं और कब भावनाएं नुकसान कराती हैं।\n\nइसे student की notebook की तरह सोचें। जो student notes लिखता है और revise करता है, वह exam में बेहतर score करता है। जो trader journal लिखता है और review करता है, वह कम गलतियां करता है।',
        example: 'Example: "I bought RELIANCE at ₹2,400 because it broke resistance at ₹2,380 with volume. I felt confident. I followed my breakout playbook checklist. Result: +₹3,200"',
        exampleHi: 'उदाहरण: "मैंने RELIANCE ₹2,400 पर खरीदा क्योंकि वह ₹2,380 के resistance को volume के साथ तोड़ रहा था। मुझे confidence था। मैंने अपनी breakout playbook checklist follow की। नतीजा: +₹3,200"',
        tip: 'You don\'t need to write an essay. Even 1-2 lines per trade is enough to start.',
        tipHi: 'आपको लंबा लिखने की ज़रूरत नहीं। हर ट्रेड में 1-2 लाइन भी काफ़ी है।',
      },
      {
        id: 'investing-vs-trading',
        icon: Scale,
        iconColor: 'text-cyan-500',
        title: 'Investing vs Trading — Which One is For You?',
        titleHi: 'निवेश vs ट्रेडिंग — आपके लिए कौन सही है?',
        content: 'Many beginners confuse investing with trading. They are very different:\n\nINVESTING: Buy and hold for months/years. Check once a week. Needs less time. Historically gives 12-15% per year (Nifty average). Lower stress. Best for most people.\n\nTRADING: Buy and sell within days/hours. Watch screen all day. Needs full-time attention. 93% of F&O traders lose money (SEBI data). High stress.\n\nThe honest truth: A simple SIP of ₹5,000/month in a Nifty 50 index fund beats 93% of active F&O traders. If you still want to trade, allocate maximum 10% of your savings for trading and keep 90% in investments.',
        contentHi: 'कई beginners investing और trading में confusion करते हैं। दोनों बहुत अलग हैं:\n\nनिवेश: महीनों/सालों तक रखो। हफ्ते में एक बार देखो। कम समय चाहिए। Nifty average 12-15% सालाना। कम तनाव। ज़्यादातर लोगों के लिए सबसे अच्छा।\n\nट्रेडिंग: दिनों/घंटों में खरीदो-बेचो। पूरा दिन स्क्रीन देखो। Full-time ध्यान चाहिए। 93% F&O ट्रेडर पैसे गंवाते हैं (SEBI डेटा)। उच्च तनाव।\n\nसच्चाई: Nifty 50 index fund में ₹5,000/महीने की SIP 93% active F&O traders से बेहतर return देती है। फिर भी trade करना हो तो बचत का maximum 10% ट्रेडिंग में लगाएं, 90% निवेश में रखें।',
        example: 'If you invested ₹5,000/month in Nifty 50 since 2015, your investment of ₹6,00,000 would be worth approximately ₹13-14,00,000 today. No screen watching needed.',
        exampleHi: 'अगर 2015 से Nifty 50 में ₹5,000/महीना लगाते, तो ₹6,00,000 का निवेश आज लगभग ₹13-14,00,000 होता। कोई screen watching नहीं।',
      },
    ],
  },

  // ─────────────────────────────────────────────────
  // MODULE 2: The Truth YouTube Won't Tell You
  // ─────────────────────────────────────────────────
  {
    id: 'youtube-truth',
    title: 'The Truth YouTube Won\'t Tell You',
    titleHi: 'वो सच जो YouTube नहीं बताएगा',
    subtitle: 'Most popular trading channels show you half the picture. Here\'s the full story.',
    subtitleHi: 'ज़्यादातर trading channels आधी तस्वीर दिखाते हैं। यहां पूरी कहानी है।',
    icon: Eye,
    iconColor: 'text-red-500',
    borderColor: 'border-red-500/30',
    lessons: [
      {
        id: 'sebi-data',
        icon: BarChart3,
        iconColor: 'text-red-500',
        title: 'Why 93% of F&O Traders Lose Money — The SEBI Report',
        titleHi: '93% F&O ट्रेडर पैसे क्यों गंवाते हैं — SEBI की रिपोर्ट',
        content: 'In September 2024, SEBI published a landmark study. The numbers are shocking:\n\n• 93% of individual F&O traders lost money between FY22-24\n• Total losses exceeded ₹1.8 lakh crore over 3 years\n• Average loss per trader: ~₹1.1 lakh per year (FY25)\n• Only 1% of traders made more than ₹1 lakh profit after all costs\n• 43% of F&O traders were under 30 years old\n• 72% came from smaller towns and cities\n\nThis means: Out of 100 people who start F&O trading, 93 will lose money. Only 1 will make meaningful profit. These are not opinions — this is SEBI\'s official data.\n\nYouTubers showing ₹2 lakh profit screenshots? They don\'t show you the 93 people who lost money learning the same "strategy."',
        contentHi: 'सितंबर 2024 में SEBI ने एक महत्वपूर्ण अध्ययन प्रकाशित किया। आंकड़े चौंकाने वाले हैं:\n\n• FY22-24 में 93% individual F&O ट्रेडर ने पैसे गंवाए\n• कुल नुकसान 3 साल में ₹1.8 लाख करोड़ से ज़्यादा\n• प्रति ट्रेडर औसत नुकसान: ~₹1.1 लाख/साल (FY25)\n• सभी खर्चों के बाद सिर्फ 1% ट्रेडर ने ₹1 लाख से ज़्यादा मुनाफ़ा कमाया\n• 43% F&O ट्रेडर 30 साल से कम उम्र के थे\n• 72% छोटे शहरों से थे\n\nमतलब: 100 में से 93 लोग F&O में पैसे गंवाएंगे। सिर्फ 1 को अच्छा मुनाफ़ा होगा। ये राय नहीं — SEBI का official data है।',
        tip: 'This doesn\'t mean you should never trade. It means you should learn properly, manage risk, and not expect quick money. BazaarSaar helps you be in that 7% by building discipline.',
        tipHi: 'इसका मतलब यह नहीं कि कभी ट्रेड न करें। मतलब है — सही से सीखें, जोखिम संभालें, और जल्दी पैसे की उम्मीद न रखें। BazaarSaar अनुशासन बनाकर आपको उस 7% में लाने में मदद करता है।',
      },
      {
        id: 'real-cost-trading',
        icon: IndianRupee,
        iconColor: 'text-amber-500',
        title: 'The Real Cost of Every Trade — Charges Nobody Explains',
        titleHi: 'हर ट्रेड की असली लागत — वो charges जो कोई नहीं बताता',
        content: 'YouTubers say "Zerodha has zero brokerage!" But even with zero brokerage, every trade has hidden costs. Here\'s what you actually pay on a ₹1,00,000 intraday trade:\n\n• Brokerage: ₹20 per order (Zerodha) = ₹40 (buy + sell)\n• STT (Securities Transaction Tax): 0.025% on sell = ₹25\n• Exchange charges (NSE): 0.00325% = ₹6.50\n• SEBI turnover fee: ₹0.15\n• Stamp duty: 0.003% on buy = ₹3\n• GST (18% on brokerage + exchange): ₹8.37\n• TOTAL per trade: ~₹83\n\nIf you make 5 trades/day, that\'s ₹415/day = ₹8,300/month = ₹99,600/year in charges ALONE. You need to make ₹1 lakh profit just to cover your costs!\n\nFor F&O (options), charges are even higher due to higher STT rates.',
        contentHi: 'YouTubers कहते हैं "Zerodha में zero brokerage!" लेकिन zero brokerage के बाद भी हर ट्रेड में छिपे खर्चे हैं। ₹1,00,000 के intraday trade पर वास्तव में:\n\n• ब्रोकरेज: ₹20/order (Zerodha) = ₹40 (खरीद + बिक्री)\n• STT: 0.025% बिक्री पर = ₹25\n• Exchange charges: 0.00325% = ₹6.50\n• SEBI turnover fee: ₹0.15\n• Stamp duty: 0.003% = ₹3\n• GST (18%): ₹8.37\n• कुल प्रति ट्रेड: ~₹83\n\n5 ट्रेड/दिन = ₹415/दिन = ₹8,300/महीना = ₹99,600/साल सिर्फ charges में! आपको सिर्फ खर्चे cover करने के लिए ₹1 लाख मुनाफ़ा चाहिए!\n\nF&O (options) में charges और भी ज़्यादा हैं।',
        example: 'Real example: Rahul from Indore makes 8 trades/day in options. His monthly charges: ~₹18,000. He needs to make ₹18,000 profit every month BEFORE he earns anything. Most months, the charges ate up his small profits.',
        exampleHi: 'असल उदाहरण: इंदौर के राहुल रोज़ 8 option trades करते हैं। मासिक charges: ~₹18,000। उन्हें कुछ भी कमाने से पहले हर महीने ₹18,000 मुनाफ़ा चाहिए। ज़्यादातर महीनों में charges ने उनका छोटा मुनाफ़ा खा लिया।',
      },
      {
        id: 'taxes',
        icon: Receipt,
        iconColor: 'text-purple-500',
        title: 'Taxes Nobody Tells You About',
        titleHi: 'वो Tax जो कोई नहीं बताता',
        content: 'Trading profits are NOT tax-free. Here\'s what you owe:\n\n• Delivery (held > 1 year): 12.5% LTCG tax (above ₹1.25 lakh exemption)\n• Delivery (held < 1 year): 20% STCG tax\n• Intraday profits: Taxed as business income at your income tax slab rate (up to 30%)\n• F&O profits: Also taxed as business income at slab rate\n\nIMPORTANT things beginners don\'t know:\n• F&O trading is classified as BUSINESS income — you may need to file ITR-3, not ITR-1\n• If F&O turnover exceeds ₹2 crore, tax audit is MANDATORY (CA fees: ₹15,000-50,000)\n• Intraday losses can ONLY be set off against intraday profits\n• F&O losses can be set off against any income except salary\n• You must maintain proper books of account if you trade F&O regularly',
        contentHi: 'ट्रेडिंग मुनाफ़ा tax-free नहीं है:\n\n• Delivery (1 साल से ज़्यादा): 12.5% LTCG tax (₹1.25 लाख छूट के ऊपर)\n• Delivery (1 साल से कम): 20% STCG tax\n• Intraday: Business income — आपके income tax slab rate पर (30% तक)\n• F&O: Business income — slab rate पर\n\nज़रूरी बातें जो beginners नहीं जानते:\n• F&O trading BUSINESS income है — ITR-3 file करना पड़ सकता है, ITR-1 नहीं\n• F&O turnover ₹2 करोड़ से ज़्यादा हो तो tax audit ज़रूरी है (CA fees: ₹15,000-50,000)\n• Intraday नुकसान सिर्फ intraday मुनाफ़े से adjust होता है\n• F&O नुकसान salary छोड़कर किसी भी income से adjust हो सकता है\n• F&O regularly करते हैं तो proper books of account रखने ज़रूरी हैं',
        example: 'You made ₹50,000 profit from F&O in a year. You\'re in the 20% tax bracket. You owe ₹10,000 in tax + ₹4,000 cess = ₹14,000. Your actual profit: ₹36,000. If you add trading charges (~₹1 lakh/year for active traders), you\'re actually in a LOSS.',
        exampleHi: 'F&O से ₹50,000 सालाना मुनाफ़ा। 20% tax bracket में हैं। Tax: ₹10,000 + ₹4,000 cess = ₹14,000। असली मुनाफ़ा: ₹36,000। Trading charges (~₹1 लाख/साल active traders के लिए) जोड़ें तो असल में नुकसान में हैं।',
      },
      {
        id: 'youtube-myths',
        icon: Skull,
        iconColor: 'text-red-500',
        title: '7 YouTube Trading Myths That Cost You Money',
        titleHi: 'YouTube के 7 ट्रेडिंग myths जो आपके पैसे डुबोते हैं',
        content: 'MYTH 1: "Options trading is easy money"\nREALITY: 93% lose money. SEBI data, not opinion.\n\nMYTH 2: "You can quit your job and trade full-time"\nREALITY: You need minimum ₹25-50 lakh capital just to generate a basic monthly income. Most "full-time traders" actually earn from courses and YouTube ads, not trading.\n\nMYTH 3: "This strategy has 90% win rate"\nREALITY: Win rate alone means nothing. A 90% win rate with 1:10 risk-reward is a losing strategy. Cherry-picked backtests and fake screenshots are common.\n\nMYTH 4: "I made ₹2 lakh today"\nREALITY: They don\'t show the 10 days they lost ₹50,000 each. Survivorship bias — you only see winners, never losers.\n\nMYTH 5: "Paper trading proves the strategy works"\nREALITY: Paper trading can\'t simulate real emotions. A 70% win rate on paper often becomes 30-40% with real money because fear and greed kick in.\n\nMYTH 6: "Just follow my signals/tips"\nREALITY: SEBI has banned 50+ entities and fined crores for illegal advisory. ₹546 crore was impounded from just one finfluencer.\n\nMYTH 7: "Zero brokerage = free trading"\nREALITY: STT, stamp duty, exchange charges, GST still apply. See our charges lesson above.',
        contentHi: 'MYTH 1: "Options trading आसान पैसा है"\nसच: 93% पैसे गंवाते हैं। SEBI का data।\n\nMYTH 2: "नौकरी छोड़ो और full-time trade करो"\nसच: Basic monthly income के लिए minimum ₹25-50 लाख चाहिए। ज़्यादातर "full-time traders" असल में courses और YouTube ads से कमाते हैं।\n\nMYTH 3: "इस strategy की 90% win rate है"\nसच: Win rate अकेला कुछ नहीं बताता। Cherry-picked backtests और fake screenshots आम हैं।\n\nMYTH 4: "आज ₹2 लाख कमाए"\nसच: वो 10 दिन नहीं दिखाते जब ₹50,000-₹50,000 गंवाए। Survivorship bias।\n\nMYTH 5: "Paper trading से strategy prove होती है"\nसच: Paper trading में असली भावनाएं नहीं होतीं। 70% paper win rate असली पैसे से 30-40% हो जाती है।\n\nMYTH 6: "मेरे signals follow करो"\nसच: SEBI ने 50+ entities को ban किया। एक finfluencer से ₹546 करोड़ ज़ब्त किए।\n\nMYTH 7: "Zero brokerage = free trading"\nसच: STT, stamp duty, exchange charges, GST फिर भी लगते हैं।',
      },
      {
        id: 'spot-fake-guru',
        icon: AlertTriangle,
        iconColor: 'text-amber-500',
        title: 'How to Spot a Fake Trading Guru / Scam Course',
        titleHi: 'नकली ट्रेडिंग गुरु / स्कैम कोर्स कैसे पहचानें',
        content: 'RED FLAGS — Run away if you see these:\n\n1. "Guaranteed returns" — No one can guarantee stock market returns. Ever.\n2. Luxury lifestyle in thumbnails — Cars, watches, foreign trips. This sells courses, not trading skill.\n3. "Join my Telegram for daily tips" — Likely unregistered investment advisory (illegal under SEBI rules).\n4. Urgency — "Only 10 seats left!" "Offer ends tonight!" Real education doesn\'t expire.\n5. No SEBI registration — If someone gives trading advice for money, they MUST be SEBI-registered.\n6. Unrealistic claims — "5% weekly returns" = 1,164% per year. Warren Buffett makes 20%.\n\nHow to verify: Check SEBI\'s registered advisor list at sebi.gov.in. If they\'re not on it, they\'re illegal.\n\nThe business model of most trading YouTubers:\n• YouTube ad revenue (₹1-3 lakh/month for big channels)\n• Course sales (₹10,000-50,000 per student)\n• Broker affiliate commissions (₹200-500 per Demat account opened)\n• They make money FROM you, not FROM trading.',
        contentHi: 'RED FLAGS — ये दिखें तो दूर रहें:\n\n1. "Guaranteed returns" — कोई stock market returns guarantee नहीं कर सकता। कभी नहीं।\n2. Thumbnails में luxury lifestyle — Cars, watches, विदेश यात्रा। ये courses बेचता है, trading skill नहीं।\n3. "मेरे Telegram join करो daily tips के लिए" — शायद unregistered advisory (SEBI rules में illegal)।\n4. Urgency — "सिर्फ 10 seats बाकी!" असली शिक्षा expire नहीं होती।\n5. SEBI registration नहीं — पैसे लेकर trading advice देना बिना SEBI registration के illegal है।\n6. Unrealistic claims — "5% weekly returns" = 1,164% सालाना। Warren Buffett 20% कमाते हैं।\n\nverify कैसे करें: sebi.gov.in पर registered advisor list चेक करें।\n\nज़्यादातर trading YouTubers का business model:\n• YouTube ad revenue (₹1-3 लाख/महीना)\n• Course बिक्री (₹10,000-50,000 प्रति student)\n• Broker affiliate commissions (₹200-500 प्रति Demat account)\n• वो trading से नहीं, आपसे पैसे कमाते हैं।',
        tip: 'BazaarSaar is 100% free. We don\'t sell courses, tips, or recommendations. We only show you YOUR data to help YOU improve.',
        tipHi: 'BazaarSaar 100% मुफ़्त है। हम courses, tips या recommendations नहीं बेचते। हम सिर्फ आपका data दिखाते हैं ताकि आप खुद सुधरें।',
      },
    ],
  },

  // ─────────────────────────────────────────────────
  // MODULE 3: Risk Management
  // ─────────────────────────────────────────────────
  {
    id: 'risk-management',
    title: 'Risk Management — Protect Your Capital',
    titleHi: 'जोखिम प्रबंधन — अपनी पूंजी बचाएं',
    subtitle: 'This is the #1 skill that separates winners from losers. Not strategy, not tips — risk management.',
    subtitleHi: 'यही #1 कौशल है जो जीतने वालों को हारने वालों से अलग करता है। Strategy नहीं, tips नहीं — जोखिम प्रबंधन।',
    icon: Shield,
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-500/30',
    lessons: [
      {
        id: 'stop-loss',
        icon: Shield,
        iconColor: 'text-red-500',
        title: 'Stop-Loss — Your Safety Net',
        titleHi: 'Stop-Loss — आपका सुरक्षा जाल',
        content: 'A stop-loss is a pre-decided price at which you will exit a losing trade. It protects you from big losses. Rule of thumb: Never risk more than 1-2% of your total capital on a single trade.\n\nIf you have ₹1,00,000, your maximum loss per trade should be ₹1,000-₹2,000. Without stop-loss, one bad trade can wipe out weeks of profits.\n\nYouTubers say "put a stop-loss" but never explain WHERE to put it. Here\'s how: Place it at a price where your trade idea is proven WRONG, not just a random percentage. Below a support level, below a moving average, or below the last swing low.',
        contentHi: 'Stop-loss एक पहले से तय कीमत है जिस पर आप नुकसान वाले ट्रेड से बाहर निकलेंगे। यह बड़े नुकसान से बचाता है। नियम: एक ट्रेड पर कुल पूंजी का 1-2% से ज़्यादा जोखिम न लें।\n\nअगर आपके पास ₹1,00,000 हैं, तो प्रति ट्रेड अधिकतम नुकसान ₹1,000-₹2,000 हो। बिना stop-loss के एक खराब ट्रेड हफ़्तों का मुनाफ़ा मिटा सकता है।\n\nYouTubers कहते हैं "stop-loss लगाओ" पर कहां लगाना है नहीं बताते। ऐसे लगाएं: उस price पर जहां आपका trade idea ग़लत साबित हो — random percentage पर नहीं। Support level के नीचे, moving average के नीचे, या last swing low के नीचे।',
        example: 'You buy TATA STEEL at ₹130. Support is at ₹126. Stop-loss = ₹125 (below support). Risk = ₹5/share. Buy 200 shares. Max loss = ₹1,000 (1% of ₹1 lakh). Target: ₹140 = ₹2,000 profit. Risk:Reward = 1:2.',
        exampleHi: 'TATA STEEL ₹130 पर खरीदा। Support ₹126 पर। Stop-loss = ₹125 (support के नीचे)। Risk = ₹5/share। 200 shares खरीदे। Max loss = ₹1,000 (₹1 लाख का 1%)। Target: ₹140 = ₹2,000 profit। Risk:Reward = 1:2।',
      },
      {
        id: 'position-sizing',
        icon: Scale,
        iconColor: 'text-purple-500',
        title: 'Position Sizing — How Much to Buy?',
        titleHi: 'Position Sizing — कितना खरीदें?',
        content: 'Position sizing means deciding how many shares to buy. Most beginners make the mistake of putting all their money in one trade.\n\nThe smart way:\nRisk per trade = 1-2% of capital\n\nFormula:\nPosition Size = Risk Amount / (Entry Price - Stop Loss Price)\n\nExample:\nCapital = ₹2,00,000\nRisk per trade (1%) = ₹2,000\nStock price = ₹500, Stop-loss = ₹490\nRisk per share = ₹10\nPosition size = ₹2,000 / ₹10 = 200 shares\n\nThis way, even if you\'re wrong, you lose only ₹2,000 — not ₹50,000.\n\nALSO IMPORTANT: Never put more than 5% of your capital in one stock. If you have ₹2,00,000, maximum ₹10,000 in any single stock.',
        contentHi: 'Position sizing मतलब कितने शेयर खरीदें यह तय करना। ज़्यादातर beginners सारा पैसा एक ट्रेड में लगा देते हैं।\n\nस्मार्ट तरीका:\nप्रति ट्रेड जोखिम = पूंजी का 1-2%\n\nFormula:\nPosition Size = जोखिम राशि / (Entry Price - Stop Loss Price)\n\nउदाहरण:\nपूंजी = ₹2,00,000, प्रति ट्रेड जोखिम (1%) = ₹2,000\nStock ₹500, Stop-loss ₹490, प्रति शेयर जोखिम = ₹10\nPosition size = ₹2,000 / ₹10 = 200 शेयर\n\nइस तरह, गलत होने पर भी सिर्फ ₹2,000 खोएंगे — ₹50,000 नहीं।\n\nज़रूरी: एक stock में कुल पूंजी का 5% से ज़्यादा न लगाएं।',
      },
      {
        id: 'drawdown-math',
        icon: TrendingDown,
        iconColor: 'text-red-500',
        title: 'The Math of Drawdowns — Why 50% Loss Needs 100% Gain',
        titleHi: 'Drawdown का गणित — 50% नुकसान से उबरने के लिए 100% मुनाफ़ा चाहिए',
        content: 'Drawdown = the drop from your highest point to your lowest point. This is the most dangerous thing in trading and almost NO YouTuber explains this properly.\n\nThe scary math:\n• 10% loss → need 11% gain to recover ✓ (manageable)\n• 20% loss → need 25% gain to recover ⚠️\n• 30% loss → need 43% gain to recover ⚠️\n• 50% loss → need 100% gain to recover ❌ (very hard)\n• 70% loss → need 233% gain to recover ❌ (nearly impossible)\n\nThis is why risk management matters MORE than finding the "perfect strategy." If you lose 50% of your capital, you need to DOUBLE your remaining money just to break even.\n\nRule: If your account drops 5% in a day, STOP trading for the day. If it drops 15% in a month, reduce position sizes by half.',
        contentHi: 'Drawdown = आपके highest point से lowest point तक की गिरावट। यह trading में सबसे खतरनाक चीज़ है और लगभग कोई YouTuber इसे ठीक से नहीं समझाता।\n\nडरावना गणित:\n• 10% नुकसान → 11% मुनाफ़ा चाहिए ✓\n• 20% नुकसान → 25% मुनाफ़ा चाहिए ⚠️\n• 30% नुकसान → 43% मुनाफ़ा चाहिए ⚠️\n• 50% नुकसान → 100% मुनाफ़ा चाहिए ❌ (बहुत मुश्किल)\n• 70% नुकसान → 233% मुनाफ़ा चाहिए ❌ (लगभग असंभव)\n\nइसलिए risk management "perfect strategy" से ज़्यादा ज़रूरी है। 50% पूंजी गंवाने पर बस break-even के लिए बाकी पैसा दोगुना करना होगा।\n\nनियम: दिन में account 5% गिरे तो उस दिन trading बंद। महीने में 15% गिरे तो position sizes आधी कर दें।',
        example: 'Ajay started with ₹3,00,000. In one bad week, he lost 40% (₹1,20,000). Remaining: ₹1,80,000. To get back to ₹3,00,000, he needs 67% return on ₹1,80,000. At a good trader\'s rate of 2% per month, that\'s 27 months just to break even.',
        exampleHi: 'अजय ने ₹3,00,000 से शुरू किया। एक खराब हफ्ते में 40% (₹1,20,000) गंवाया। बाकी: ₹1,80,000। ₹3,00,000 वापस लाने के लिए 67% return चाहिए। अच्छे trader के 2%/महीना rate पर, सिर्फ break-even में 27 महीने लगेंगे।',
      },
      {
        id: 'when-not-to-trade',
        icon: Ban,
        iconColor: 'text-red-500',
        title: 'When NOT to Trade — The Most Important Skill',
        titleHi: 'कब ट्रेड नहीं करना — सबसे ज़रूरी कौशल',
        content: 'The best traders know when to SIT OUT. No YouTuber teaches this because "don\'t trade today" doesn\'t get views.\n\nDO NOT TRADE when:\n\n1. Event days — RBI policy announcement, Union Budget, US FOMC meeting, US jobs data. These cause wild swings that can wipe out stop-losses.\n\n2. First 15 minutes of market open — Most volatile period. Big players manipulate prices. Wait for the market to settle.\n\n3. You\'ve hit your daily loss limit — Set a max daily loss (e.g., ₹2,000). Hit it? Close the screen. Tomorrow is another day.\n\n4. Expiry day (Thursday) — For options beginners, expiry day is a trap. Time decay accelerates, spreads widen, and losses can be sudden.\n\n5. After a fight, bad news, or when emotionally upset — Your brain can\'t make rational decisions when emotional. This is when revenge trading happens.\n\n6. When you don\'t have a clear plan — "I\'ll just see what happens" is not a plan. No setup = no trade.',
        contentHi: 'सबसे अच्छे traders जानते हैं कि कब बाहर रहना है। कोई YouTuber यह नहीं सिखाता क्योंकि "आज ट्रेड मत करो" पर views नहीं आते।\n\nट्रेड मत करो जब:\n\n1. Event days — RBI policy, Union Budget, US FOMC, US jobs data। ये wild swings लाते हैं।\n\n2. Market open के पहले 15 मिनट — सबसे volatile। बड़े players कीमतें manipulate करते हैं। Market settle होने दो।\n\n3. Daily loss limit hit हो गई — Max daily loss तय करो (जैसे ₹2,000)। Hit हो गया? Screen बंद करो।\n\n4. Expiry day (गुरुवार) — Options beginners के लिए expiry day trap है। Time decay बढ़ जाता है।\n\n5. झगड़े, बुरी खबर, या emotional होने पर — दिमाग rational decisions नहीं ले सकता। यही revenge trading होती है।\n\n6. जब clear plan नहीं — "देखते हैं क्या होता है" plan नहीं है। No setup = no trade।',
        tip: 'BazaarSaar\'s Morning Checklist helps you decide BEFORE the market opens whether today is a good day to trade.',
        tipHi: 'BazaarSaar की Morning Checklist market खुलने से पहले तय करने में मदद करती है कि आज trade करना चाहिए या नहीं।',
      },
    ],
  },

  // ─────────────────────────────────────────────────
  // MODULE 4: Trading Psychology
  // ─────────────────────────────────────────────────
  {
    id: 'psychology',
    title: 'Trading Psychology — Your Brain vs. The Market',
    titleHi: 'ट्रेडिंग मानसिकता — आपका दिमाग vs बाज़ार',
    subtitle: '82% of retail investors show fear during volatility. 64% overtrade due to overconfidence. Your biggest enemy is not the market — it\'s yourself.',
    subtitleHi: '82% retail investors volatility में डर दिखाते हैं। 64% overconfidence से ज़्यादा ट्रेड करते हैं। आपका सबसे बड़ा दुश्मन बाज़ार नहीं — आप खुद हैं।',
    icon: Brain,
    iconColor: 'text-pink-500',
    borderColor: 'border-pink-500/30',
    lessons: [
      {
        id: 'emotions',
        icon: Heart,
        iconColor: 'text-pink-500',
        title: 'The 7 Emotions That Control Your Trades',
        titleHi: 'वो 7 भावनाएं जो आपके ट्रेड control करती हैं',
        content: 'Every trader feels emotions. The goal is not to eliminate them but to RECOGNIZE them. Here are the 7 key emotions:\n\n1. CONFIDENCE (आत्मविश्वास) — You have a clear plan and evidence. This is GOOD.\n2. FEAR (डर) — You\'re scared of losing. Makes you exit too early or not take good trades.\n3. GREED (लालच) — You want more profit. Makes you hold too long and lose gains.\n4. FOMO (छूट जाने का डर) — Everyone is buying, so you buy without thinking. Leads to buying at tops.\n5. REVENGE (बदला) — After a loss, you take another trade immediately to "win it back." This is the #1 account destroyer.\n6. OVERCONFIDENCE (अति-आत्मविश्वास) — After 3 wins, you think you can\'t lose. You increase size. Then one big loss wipes out all gains.\n7. BOREDOM (बोरियत) — Nothing is happening so you trade for the sake of trading. Leads to random, planless trades.\n\nBazaarSaar lets you tag emotions on every trade. After 15-20 trades, you\'ll see patterns like "I lose 80% of trades tagged FOMO" — and that changes everything.',
        contentHi: 'हर trader भावनाएं महसूस करता है। लक्ष्य उन्हें खत्म करना नहीं, पहचानना है:\n\n1. CONFIDENCE — स्पष्ट योजना और evidence है। अच्छी भावना।\n2. FEAR — नुकसान का डर। जल्दी exit करवाता है या अच्छे trades न लेने देता।\n3. GREED — ज़्यादा मुनाफ़े की लालच। बहुत देर तक hold करवाता है।\n4. FOMO — सब खरीद रहे हैं तो बिना सोचे खरीद लेना। Tops पर buying।\n5. REVENGE — नुकसान के बाद तुरंत दूसरा trade "वापस जीतने" के लिए। #1 account destroyer।\n6. OVERCONFIDENCE — 3 जीत के बाद लगता है हार ही नहीं सकते। Size बढ़ाते हैं। फिर एक बड़ा नुकसान सब मिटा देता है।\n7. BOREDOM — कुछ नहीं हो रहा तो बस trade कर लो। Random, बिना plan के trades।\n\nBazaarSaar हर trade पर emotion tag करने देता है। 15-20 trades के बाद pattern दिखेगा जैसे "FOMO tag वाले 80% trades में नुकसान" — और यह सब बदल देता है।',
        example: 'Real pattern: A trader on BazaarSaar discovered that "Confident" trades had 68% win rate, but "FOMO" trades had only 28%. By simply avoiding FOMO trades, they saved ₹15,000/month.',
        exampleHi: 'असल पैटर्न: एक trader ने पाया कि "Confident" trades की win rate 68% और "FOMO" trades की सिर्फ 28%। FOMO trades से बचकर ₹15,000/महीना बचाए।',
      },
      {
        id: 'revenge-fomo',
        icon: Flame,
        iconColor: 'text-orange-500',
        title: 'Revenge Trading & FOMO — How to Break the Cycle',
        titleHi: 'Revenge Trading और FOMO — चक्र कैसे तोड़ें',
        content: 'THE REVENGE CYCLE:\nYou lose ₹5,000 → You feel angry → You take another trade to recover → You lose ₹3,000 more → Even more angry → Trade again → Lose ₹7,000 → Total loss: ₹15,000. What started as ₹5,000 became ₹15,000 because of emotions.\n\nHOW TO BREAK IT:\n1. Set a HARD daily loss limit in advance (e.g., ₹3,000)\n2. Hit the limit? CLOSE YOUR TRADING APP. Not minimize — close it.\n3. Go for a walk. Call a friend. Do anything except look at charts.\n4. Write in your journal: "I hit my daily limit. I stopped. I protected my capital."\n5. This entry in your journal will be your proudest moment later.\n\nTHE FOMO CYCLE:\nMarket is going up → Everyone on Twitter/WhatsApp is making money → You buy at the top → Price falls → You hold hoping → You lose → You feel stupid.\n\nHOW TO BREAK IT:\nAsk yourself: "If I had zero positions, would I buy THIS stock at THIS price right now?" If the answer is no, don\'t buy.',
        contentHi: 'REVENGE CYCLE:\n₹5,000 नुकसान → गुस्सा → recover करने के लिए दूसरा trade → ₹3,000 और गया → और गुस्सा → फिर trade → ₹7,000 गया → कुल: ₹15,000। ₹5,000 से शुरू हुआ, भावनाओं ने ₹15,000 बना दिया।\n\nकैसे तोड़ें:\n1. पहले से daily loss limit तय करो (जैसे ₹3,000)\n2. Limit hit? TRADING APP बंद करो। Minimize नहीं — बंद।\n3. Walk पर जाओ। दोस्त को call करो। Charts मत देखो।\n4. Journal में लिखो: "Daily limit hit हुई। रुक गया। पूंजी बचाई।"\n5. बाद में यह entry सबसे गर्व की बात होगी।\n\nFOMO CYCLE:\nMarket ऊपर जा रहा → Twitter/WhatsApp पर सब कमा रहे → Top पर खरीद लिया → Price गिरा → Hold करते रहे → नुकसान।\n\nकैसे तोड़ें:\nपूछो: "अगर मेरे पास कोई position न हो, तो क्या मैं यह stock इस price पर अभी खरीदूंगा?" जवाब नहीं है तो मत खरीदो।',
      },
      {
        id: 'cognitive-biases',
        icon: Brain,
        iconColor: 'text-purple-500',
        title: '5 Cognitive Biases That Silently Cost You Money',
        titleHi: '5 Cognitive Biases जो चुपचाप पैसे डुबोती हैं',
        content: 'Your brain has built-in shortcuts that helped our ancestors survive but HURT you in trading:\n\n1. CONFIRMATION BIAS: You bought HDFC Bank. Now you only read positive news about it. You ignore warnings. Fix: Actively look for reasons your trade could be WRONG.\n\n2. LOSS AVERSION: Losing ₹1,000 feels twice as painful as winning ₹1,000 feels good. This makes you hold losing trades too long ("it\'ll come back") and exit winning trades too early. Fix: Use stop-loss and targets — no manual decisions.\n\n3. RECENCY BIAS: After 3 green days, you think tomorrow will also be green. Markets don\'t work that way. Fix: Look at weekly/monthly data, not just today.\n\n4. ANCHORING: "I bought at ₹500, so I\'ll sell only above ₹500." The market doesn\'t care about your purchase price. Fix: Ask "Is this stock worth its CURRENT price?" not "Am I in profit?"\n\n5. DISPOSITION EFFECT: You sell winners quickly (to "book profit") and hold losers forever (hoping for recovery). This is backwards — cut losers quickly, let winners run. Fix: Trail your stop-loss up as price rises.',
        contentHi: 'आपके दिमाग में built-in shortcuts हैं जो पूर्वजों को बचाते थे पर trading में नुकसान करती हैं:\n\n1. CONFIRMATION BIAS: HDFC Bank खरीदा, अब सिर्फ positive खबरें पढ़ते हो। Fix: सक्रिय रूप से ढूंढो कि trade ग़लत क्यों हो सकता है।\n\n2. LOSS AVERSION: ₹1,000 खोना उतना ही दुखता है जितना ₹1,000 जीतने से दोगुना। Fix: Stop-loss और targets लगाओ — manual decisions नहीं।\n\n3. RECENCY BIAS: 3 green days के बाद कल भी green सोचते हो। Fix: Weekly/monthly data देखो, सिर्फ आज नहीं।\n\n4. ANCHORING: "₹500 में खरीदा, ₹500 से ऊपर ही बेचूंगा।" Market को आपकी खरीद कीमत से कोई मतलब नहीं। Fix: "क्या stock आज की price पर valuable है?" पूछो।\n\n5. DISPOSITION EFFECT: Winners जल्दी बेचते हो, losers को forever hold करते हो। Fix: Losers जल्दी काटो, winners को चलने दो।',
      },
      {
        id: 'why-traders-lose',
        icon: TrendingDown,
        iconColor: 'text-red-500',
        title: 'Why Do 90% of Traders Lose Money? The Real Reasons',
        titleHi: '90% ट्रेडर पैसे क्यों गंवाते हैं? असली कारण',
        content: 'SEBI data confirms 9 out of 10 F&O traders lost money. But WHY? The reasons are NOT bad strategies:\n\n1. REVENGE TRADING (35% of losses) — Taking trades to recover previous losses. Each revenge trade makes it worse.\n\n2. NO RISK MANAGEMENT (25%) — No stop-loss, no position sizing, all-in on single trades.\n\n3. OVERTRADING (20%) — Taking 10+ trades/day without clear setups. More trades = more charges = more chances to lose.\n\n4. FOLLOWING TIPS (10%) — WhatsApp groups, Telegram channels, "insider information." By the time you get the tip, it\'s already priced in.\n\n5. WRONG INSTRUMENT (10%) — Beginners jumping straight to F&O without understanding equity first. Options decay to zero — time is against the buyer.\n\nNotice: Not a single reason is "bad strategy." It\'s all behavior. That\'s why BazaarSaar focuses on tracking your BEHAVIOR, not giving you strategies.',
        contentHi: 'SEBI data — 10 में से 9 F&O traders ने पैसे गंवाए। लेकिन क्यों? कारण खराब strategy नहीं:\n\n1. REVENGE TRADING (35% नुकसान) — पिछले नुकसान की भरपाई के लिए trade। हर revenge trade बिगाड़ता है।\n\n2. RISK MANAGEMENT नहीं (25%) — न stop-loss, न position sizing, एक trade में सब लगा दिया।\n\n3. OVERTRADING (20%) — बिना setup 10+/दिन trades। ज़्यादा trades = ज़्यादा charges = ज़्यादा नुकसान के मौके।\n\n4. TIPS FOLLOW करना (10%) — WhatsApp groups, Telegram channels। जब तक tip मिलता है, price में already reflect हो चुका होता है।\n\n5. गलत INSTRUMENT (10%) — Beginners सीधे F&O में कूदना। Options time decay से zero हो जाते हैं।\n\nध्यान दें: एक भी कारण "खराब strategy" नहीं है। सब behavior है। इसलिए BazaarSaar आपके BEHAVIOR को track करता है, strategy नहीं देता।',
        tip: 'BazaarSaar tracks all 5 of these automatically. The Rule Break Alert warns you BEFORE you make these mistakes.',
        tipHi: 'BazaarSaar इन सभी 5 को automatically track करता है। Rule Break Alert इन गलतियों से पहले चेतावनी देता है।',
      },
    ],
  },

  // ─────────────────────────────────────────────────
  // MODULE 5: Building Discipline
  // ─────────────────────────────────────────────────
  {
    id: 'discipline',
    title: 'Building Discipline — The Winning Habit',
    titleHi: 'अनुशासन बनाना — जीतने की आदत',
    subtitle: 'Consistency beats intelligence in trading. Build systems, follow them.',
    subtitleHi: 'ट्रेडिंग में निरंतरता बुद्धि से जीतती है। सिस्टम बनाओ, उन्हें follow करो।',
    icon: Target,
    iconColor: 'text-cyan-500',
    borderColor: 'border-cyan-500/30',
    lessons: [
      {
        id: 'what-is-playbook',
        icon: CheckCircle2,
        iconColor: 'text-cyan-500',
        title: 'What is a Trading Playbook?',
        titleHi: 'ट्रेडिंग प्लेबुक क्या है?',
        content: 'A playbook is simply a checklist you follow before taking a trade. Just like a pilot checks instruments before takeoff, you check your trading rules before buying or selling.\n\nExample checklist:\n(1) Is the stock above its 20-day moving average?\n(2) Is the volume higher than normal?\n(3) Have I set my stop-loss?\n(4) Is my position size within my risk limit?\n(5) Am I feeling confident (not FOMO or revenge)?\n\nIf ALL checks pass, you take the trade. If even ONE fails, you SKIP it. No exceptions.\n\nThis sounds boring, but it\'s what separates the 7% who profit from the 93% who lose.',
        contentHi: 'प्लेबुक बस एक चेकलिस्ट है जो आप ट्रेड लेने से पहले follow करते हैं। जैसे पायलट उड़ान से पहले instruments check करता है:\n\nउदाहरण:\n(1) क्या stock 20-day moving average से ऊपर है?\n(2) क्या volume सामान्य से ज़्यादा है?\n(3) क्या stop-loss लगाया?\n(4) क्या position size risk limit में है?\n(5) क्या confident हूं (FOMO या revenge नहीं)?\n\nसभी check pass → trade लो। एक भी fail → छोड़ दो। कोई exception नहीं।\n\nबोरिंग लगता है, पर यही 7% profitable traders को 93% से अलग करता है।',
        tip: 'BazaarSaar has 11 ready-made playbook templates for Indian markets — breakout, breakdown, reversal, gap trades, and more.',
        tipHi: 'BazaarSaar में भारतीय बाज़ार के लिए 11 तैयार playbook templates हैं — breakout, breakdown, reversal, gap trades, और बहुत कुछ।',
      },
      {
        id: 'win-rate',
        icon: Target,
        iconColor: 'text-amber-500',
        title: 'Win Rate — Why It\'s Not What YouTubers Say',
        titleHi: 'Win Rate — YouTubers जो बताते हैं वो पूरा सच नहीं',
        content: 'Win Rate = (Winning Trades / Total Trades) x 100.\n\nYouTubers obsess over win rate: "90% win rate strategy!" But here\'s what they don\'t tell you:\n\nYou can have 40% win rate and STILL be profitable!\n4 wins x ₹5,000 = ₹20,000\n6 losses x ₹2,000 = ₹12,000\nNet = +₹8,000\n\nYou can have 90% win rate and STILL lose money!\n9 wins x ₹500 = ₹4,500\n1 loss x ₹10,000 = ₹10,000\nNet = -₹5,500\n\nWhat matters is EXPECTANCY:\nExpectancy = (Win Rate × Average Win) - (Loss Rate × Average Loss)\n\nBazaarSaar calculates your real expectancy from YOUR trades — not from some YouTube backtest.',
        contentHi: 'Win Rate = (जीतने वाले ट्रेड / कुल ट्रेड) x 100।\n\nYouTubers "90% win rate strategy!" चिल्लाते हैं। पर सच:\n\n40% win rate से भी profit हो सकता है!\n4 जीत x ₹5,000 = ₹20,000\n6 नुकसान x ₹2,000 = ₹12,000\nNet = +₹8,000\n\n90% win rate से भी नुकसान हो सकता है!\n9 जीत x ₹500 = ₹4,500\n1 नुकसान x ₹10,000 = ₹10,000\nNet = -₹5,500\n\nमायने EXPECTANCY रखती है:\nExpectancy = (Win Rate × Average Win) - (Loss Rate × Average Loss)\n\nBazaarSaar आपके असली trades से expectancy calculate करता है — YouTube backtest से नहीं।',
      },
      {
        id: 'weekly-review',
        icon: BarChart3,
        iconColor: 'text-green-500',
        title: 'The Power of Weekly Reviews',
        titleHi: 'साप्ताहिक समीक्षा की ताक़त',
        content: 'Every Sunday, spend 15 minutes reviewing your week. This single habit has improved more traders than any strategy course ever sold.\n\nAsk yourself:\n(1) How many trades did I take? Was it too many?\n(2) Did I follow my playbook checklist?\n(3) Which emotions dominated this week?\n(4) What was my biggest mistake?\n(5) What did I do RIGHT?\n(6) Did I respect my stop-losses?\n(7) Did I hit my daily loss limit any day?\n\nBazaarSaar generates this review automatically from your data. Just read it, learn from it, and trade better next week.\n\nThis is what separates a gambler from a trader. A gambler plays and forgets. A trader reviews and improves.',
        contentHi: 'हर रविवार 15 मिनट अपने हफ्ते की समीक्षा करें। इस एक आदत ने किसी भी strategy course से ज़्यादा traders को सुधारा है।\n\nखुद से पूछें:\n(1) कितने trades किए? ज़्यादा तो नहीं थे?\n(2) Playbook checklist follow की?\n(3) इस हफ्ते कौन सी भावनाएं हावी रहीं?\n(4) सबसे बड़ी गलती क्या थी?\n(5) क्या सही किया?\n(6) Stop-losses का पालन किया?\n(7) किसी दिन daily loss limit hit हुई?\n\nBazaarSaar यह review आपके data से automatically बनाता है।\n\nयही gambler और trader का फ़र्क है। Gambler खेलता है और भूल जाता है। Trader review करता है और सुधरता है।',
        tip: 'Successful traders say the weekly review is the #1 habit that improved their trading. It takes just 15 minutes.',
        tipHi: 'सफल traders कहते हैं साप्ताहिक समीक्षा वो #1 आदत है जिसने उनकी trading सुधारी। बस 15 मिनट।',
      },
      {
        id: 'common-mistakes',
        icon: AlertTriangle,
        iconColor: 'text-amber-500',
        title: '5 Mistakes Every New Trader Makes (And How to Avoid Them)',
        titleHi: 'हर नए ट्रेडर की 5 गलतियां (और कैसे बचें)',
        content: '(1) Trading on tips, news, or WhatsApp groups — By the time you get a "hot tip," big players have already bought. You\'re their exit liquidity. Fix: Only trade with YOUR analysis and YOUR playbook.\n\n(2) Not using stop-loss — "It will come back" is the most expensive sentence in trading. It won\'t always come back. Fix: Set stop-loss BEFORE entering the trade. Never move it further away.\n\n(3) Averaging down — Buying more of a falling stock to "reduce average cost." This is doubling down on a mistake. Fix: If the trade is going against you, your analysis was wrong. Accept it and exit.\n\n(4) Overtrading — 10+ trades/day without clear setups = ₹15,000/month in charges alone. Fix: Quality over quantity. 1-2 well-planned trades beat 10 random ones.\n\n(5) Not journaling — Doing the same mistakes again and again because you never wrote them down. Fix: 2 lines per trade. That\'s it. BazaarSaar makes it easy.',
        contentHi: '(1) Tips, खबरों, WhatsApp groups पर trade — "Hot tip" मिलने तक बड़े players पहले ही खरीद चुके होते हैं। आप उनकी exit liquidity हो। Fix: सिर्फ अपने analysis से trade करो।\n\n(2) Stop-loss न लगाना — "वापस आ जाएगा" trading का सबसे महंगा वाक्य है। Fix: Trade में enter करने से पहले stop-loss लगाओ। कभी दूर मत करो।\n\n(3) गिरते stock में और खरीदना — "Average कम करना।" यह गलती पर और पैसा लगाना है। Fix: Trade against जा रहा तो analysis ग़लत थी। स्वीकार करो, बाहर निकलो।\n\n(4) ज़रूरत से ज़्यादा trade — 10+/दिन बिना setup = ₹15,000/महीना सिर्फ charges। Fix: Quality > Quantity। 1-2 planned trades 10 random से बेहतर।\n\n(5) Journal न लिखना — बार-बार वही गलतियां क्योंकि कभी लिखा ही नहीं। Fix: प्रति trade 2 लाइन।',
        tip: 'BazaarSaar detects all 5 mistakes automatically. The Rule Break Alert warns you when you\'re about to repeat them.',
        tipHi: 'BazaarSaar इन 5 गलतियों को automatically detect करता है। Rule Break Alert दोहराने से पहले चेतावनी देता है।',
      },
    ],
  },
];

// ─────────────────────────────────────────────────
// SEBI Statistics Banner
// ─────────────────────────────────────────────────
const SEBI_STATS = [
  { value: '93%', label: 'F&O traders lost money', labelHi: 'F&O traders ने पैसे गंवाए', source: 'SEBI FY22-24' },
  { value: '₹1.8L Cr', label: 'Total losses in 3 years', labelHi: '3 साल में कुल नुकसान', source: 'SEBI Study' },
  { value: '72%', label: 'Traders from small towns', labelHi: 'छोटे शहरों से traders', source: 'SEBI Data' },
  { value: '1%', label: 'Made meaningful profit', labelHi: 'ने अच्छा मुनाफ़ा कमाया', source: 'SEBI FY24' },
];

function LessonCard({ lesson }: { lesson: Lesson }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlassCard className="p-0 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 p-5 bg-transparent border-none cursor-pointer text-left hover:bg-white/[0.02] transition-colors"
      >
        <lesson.icon size={20} className={`${lesson.iconColor} shrink-0`} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#d4d4e8]">{lesson.title}</h3>
          <p className="text-xs text-amber-500/70 mt-0.5" lang="hi">{lesson.titleHi}</p>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-[#4a4a6a] shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-[#4a4a6a] shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 animate-fade-in">
          {/* English content */}
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <p className="text-sm text-[#d4d4e8] leading-relaxed whitespace-pre-line">{lesson.content}</p>
          </div>

          {/* Hindi content */}
          <div className="p-4 rounded-lg bg-amber-500/[0.04] border border-amber-500/10">
            <p className="text-[10px] text-amber-500/60 uppercase tracking-wider mb-1">हिंदी में</p>
            <p className="text-sm text-[#b0b0c8] leading-relaxed whitespace-pre-line" lang="hi">{lesson.contentHi}</p>
          </div>

          {/* Example */}
          {lesson.example && (
            <div className="p-4 rounded-lg bg-green-500/[0.04] border border-green-500/10">
              <p className="text-[10px] text-green-500/60 uppercase tracking-wider mb-1">Example / उदाहरण</p>
              <p className="text-xs text-[#d4d4e8] leading-relaxed mb-2">{lesson.example}</p>
              {lesson.exampleHi && (
                <p className="text-xs text-[#9090aa] leading-relaxed" lang="hi">{lesson.exampleHi}</p>
              )}
            </div>
          )}

          {/* Tip */}
          {lesson.tip && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-cyan-500/[0.04] border border-cyan-500/10">
              <Lightbulb size={14} className="text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#d4d4e8]">{lesson.tip}</p>
                {lesson.tipHi && (
                  <p className="text-xs text-[#6b6b8a] mt-1" lang="hi">{lesson.tipHi}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}

function ModuleSection({ module: mod }: { module: Module }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="mb-10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border ${mod.borderColor} cursor-pointer mb-4 hover:bg-white/[0.04] transition-colors text-left`}
      >
        <mod.icon size={24} className={mod.iconColor} />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-[#fafaff]">{mod.title}</h2>
          <p className="text-xs text-amber-500/70 mt-0.5" lang="hi">{mod.titleHi}</p>
          <p className="text-xs text-[#6b6b8a] mt-1">{mod.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-[#4a4a6a]">{mod.lessons.length} lessons</span>
          {open ? <ChevronUp size={16} className="text-[#4a4a6a]" /> : <ChevronDown size={16} className="text-[#4a4a6a]" />}
        </div>
      </button>

      {open && (
        <div className="space-y-3 animate-fade-in">
          {mod.lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function LearnPage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap size={24} className="text-green-500" />
          <h1 className="text-2xl font-bold text-[#fafaff]">Learn Trading — The Truth</h1>
        </div>
        <p className="text-sm text-[#6b6b8a]">
          Everything YouTube doesn&apos;t tell you. Free lessons in English &amp; Hindi. No courses to sell, no tips to give.
        </p>
        <p className="text-sm text-amber-500/70 mt-1" lang="hi">
          वो सब कुछ जो YouTube नहीं बताता। मुफ़्त पाठ हिंदी और अंग्रेज़ी में। कोई course बेचना नहीं, कोई tips नहीं।
        </p>
      </div>

      {/* Trust Banner */}
      <GlassCard className="p-4 mb-6 border-l-4 border-green-500/40">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#d4d4e8] font-medium">BazaarSaar will NEVER give you tips or tell you what to buy.</p>
            <p className="text-xs text-[#6b6b8a] mt-1">We only show you YOUR OWN data. The goal is to help you understand YOUR behavior and improve YOUR discipline. This is education, not investment advice.</p>
            <p className="text-xs text-amber-500/70 mt-1" lang="hi">हम सिर्फ आपका अपना डेटा दिखाते हैं। लक्ष्य है आपको अपना व्यवहार समझने और अनुशासन सुधारने में मदद करना। यह शिक्षा है, निवेश सलाह नहीं।</p>
          </div>
        </div>
      </GlassCard>

      {/* SEBI Data Banner */}
      <GlassCard className="p-5 mb-8 border border-red-500/20 bg-red-500/[0.03]">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-red-500" />
          <h2 className="text-xs font-semibold text-red-400 uppercase tracking-wider">SEBI Official Data — Why You Need to Learn Before Trading</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SEBI_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-red-400">{stat.value}</p>
              <p className="text-[11px] text-[#d4d4e8] mt-1">{stat.label}</p>
              <p className="text-[10px] text-amber-500/60" lang="hi">{stat.labelHi}</p>
              <p className="text-[9px] text-[#4a4a6a] mt-0.5">{stat.source}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Quick Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {MODULES.map((mod) => (
          <a
            key={mod.id}
            href={`#${mod.id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#6b6b8a] border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:text-[#d4d4e8] transition-colors no-underline"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(mod.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <mod.icon size={12} className={mod.iconColor} />
            {mod.title}
          </a>
        ))}
      </div>

      {/* Modules */}
      {MODULES.map((mod) => (
        <div key={mod.id} id={mod.id}>
          <ModuleSection module={mod} />
        </div>
      ))}

      {/* Bottom CTA */}
      <GlassCard className="p-6 text-center mb-8">
        <Zap size={24} className="text-green-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#fafaff] mb-1">Knowledge is Your Edge</h2>
        <p className="text-sm text-amber-500/70 mb-1" lang="hi">ज्ञान ही आपकी ताक़त है</p>
        <p className="text-xs text-[#4a4a6a] mb-4 max-w-md mx-auto">
          You now know more than 90% of traders who jump in without preparation. Start with your Morning Checklist, import your trades, and build discipline one day at a time.
        </p>
        <p className="text-xs text-[#4a4a6a] mb-5 max-w-md mx-auto" lang="hi">
          अब आप 90% उन traders से ज़्यादा जानते हैं जो बिना तैयारी कूद पड़ते हैं। Morning Checklist से शुरू करें, trades import करें, और एक-एक दिन अनुशासन बनाएं।
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-[#0d0d14] bg-green-500 no-underline hover:bg-green-400 transition-colors"
          >
            Go to Dashboard <ArrowRight size={14} />
          </Link>
          <Link
            href="/morning-checklist"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-[#d4d4e8] border border-white/[0.1] no-underline hover:bg-white/[0.06] transition-colors"
          >
            Morning Checklist
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
