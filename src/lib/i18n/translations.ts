import type { Language } from '@/types';

const translations = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'nav.watchlist': { en: 'Watchlist', hi: 'वॉचलिस्ट' },
  'nav.trades': { en: 'Trades', hi: 'ट्रेड्स' },
  'nav.playbooks': { en: 'Playbooks', hi: 'प्लेबुक्स' },
  'nav.datalab': { en: 'DataLab', hi: 'डेटा लैब' },
  'nav.weeklyReview': { en: 'Weekly Review', hi: 'साप्ताहिक समीक्षा' },
  'nav.settings': { en: 'Settings', hi: 'सेटिंग्स' },
  'nav.terms': { en: 'Terms', hi: 'शर्तें' },
  'nav.privacy': { en: 'Privacy', hi: 'गोपनीयता' },
  'nav.disclaimer': { en: 'Disclaimer', hi: 'अस्वीकरण' },
  'nav.morningChecklist': { en: 'Morning Checklist', hi: 'सुबह की चेकलिस्ट' },
  'nav.learn': { en: 'Learn', hi: 'सीखें' },
  'nav.community': { en: 'Community', hi: 'समुदाय' },
  'nav.blog': { en: 'Blog', hi: 'ब्लॉग' },

  // Header
  'header.marketOpen': { en: 'Market Open', hi: 'बाज़ार खुला' },
  'header.marketClosed': { en: 'Market Closed', hi: 'बाज़ार बंद' },
  'header.preOpen': { en: 'Pre-Open', hi: 'प्री-ओपन' },
  'header.postClose': { en: 'Post Close', hi: 'बंद होने के बाद' },
  'header.notAdvice': { en: 'Not investment advice. Subject to market risks.', hi: 'निवेश सलाह नहीं। बाज़ार जोखिमों के अधीन।' },
  'header.signOut': { en: 'Sign Out', hi: 'साइन आउट' },
  'header.signIn': { en: 'Sign In', hi: 'साइन इन' },

  // Dashboard
  'dashboard.title': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'dashboard.customize': { en: 'Customize', hi: 'कस्टमाइज़' },
  'dashboard.resetDefaults': { en: 'Reset defaults', hi: 'डिफ़ॉल्ट रीसेट करें' },
  'dashboard.syncStatus': { en: 'Sync Status', hi: 'सिंक स्थिति' },
  'dashboard.weekSummary': { en: 'Week Summary', hi: 'सप्ताह का सारांश' },
  'dashboard.recentTrades': { en: 'Recent Trades', hi: 'हाल के ट्रेड्स' },
  'dashboard.watchlist': { en: 'Watchlist', hi: 'वॉचलिस्ट' },
  'dashboard.pnlHeatmap': { en: 'P&L Heatmap', hi: 'P&L हीटमैप' },
  'dashboard.journalStreak': { en: 'Journal Streak', hi: 'जर्नल स्ट्रीक' },
  'dashboard.quickActions': { en: 'Quick Actions', hi: 'त्वरित कार्य' },

  // Trades
  'trades.title': { en: 'Trade Log', hi: 'ट्रेड लॉग' },
  'trades.search': { en: 'Search trades...', hi: 'ट्रेड खोजें...' },
  'trades.noTrades': { en: 'No trades found', hi: 'कोई ट्रेड नहीं मिला' },
  'trades.importCsv': { en: 'Import CSV', hi: 'CSV इम्पोर्ट' },
  'trades.exportCsv': { en: 'Export CSV', hi: 'CSV एक्सपोर्ट' },
  'trades.buy': { en: 'BUY', hi: 'खरीद' },
  'trades.sell': { en: 'SELL', hi: 'बिक्री' },
  'trades.symbol': { en: 'Symbol', hi: 'सिंबल' },
  'trades.side': { en: 'Side', hi: 'पक्ष' },
  'trades.qty': { en: 'Qty', hi: 'मात्रा' },
  'trades.price': { en: 'Price', hi: 'कीमत' },
  'trades.date': { en: 'Date', hi: 'तारीख' },
  'trades.journal': { en: 'Journal', hi: 'जर्नल' },
  'trades.journalMissing': { en: 'Journal Missing', hi: 'जर्नल अधूरा' },

  // Journal
  'journal.thesis': { en: 'Thesis', hi: 'थीसिस' },
  'journal.emotion': { en: 'Emotion', hi: 'भावना' },
  'journal.notes': { en: 'Notes', hi: 'नोट्स' },
  'journal.save': { en: 'Save Journal', hi: 'जर्नल सेव करें' },
  'journal.saved': { en: 'Saved!', hi: 'सेव हो गया!' },

  // Weekly Review
  'review.title': { en: 'Weekly Review', hi: 'साप्ताहिक समीक्षा' },
  'review.generate': { en: 'Generate Report', hi: 'रिपोर्ट बनाएं' },
  'review.totalTrades': { en: 'Total Trades', hi: 'कुल ट्रेड्स' },
  'review.winRate': { en: 'Win Rate', hi: 'जीत दर' },
  'review.totalPnl': { en: 'Total P&L', hi: 'कुल लाभ/हानि' },
  'review.descriptiveOnly': { en: 'Descriptive analytics only — not investment advice.', hi: 'केवल वर्णनात्मक विश्लेषण — निवेश सलाह नहीं।' },

  // Settings
  'settings.title': { en: 'Settings', hi: 'सेटिंग्स' },
  'settings.account': { en: 'Account', hi: 'खाता' },
  'settings.broker': { en: 'Broker Connection', hi: 'ब्रोकर कनेक्शन' },
  'settings.language': { en: 'Language', hi: 'भाषा' },
  'settings.exportData': { en: 'Export My Data', hi: 'मेरा डेटा एक्सपोर्ट करें' },
  'settings.deleteAccount': { en: 'Delete Account', hi: 'खाता हटाएं' },

  // Onboarding
  'onboarding.welcome': { en: 'Welcome to BazaarSaar', hi: 'BazaarSaar में आपका स्वागत है' },
  'onboarding.chooseLens': { en: 'Choose Your Lens', hi: 'अपना लेंस चुनें' },
  'onboarding.buildWatchlist': { en: 'Build Your Watchlist', hi: 'अपनी वॉचलिस्ट बनाएं' },
  'onboarding.consent': { en: 'Data & Privacy Consent', hi: 'डेटा और गोपनीयता सहमति' },
  'onboarding.done': { en: 'You\'re all set!', hi: 'आप तैयार हैं!' },
  'onboarding.continue': { en: 'Continue', hi: 'जारी रखें' },
  'onboarding.back': { en: 'Back', hi: 'पीछे' },
  'onboarding.getStarted': { en: 'Get Started', hi: 'शुरू करें' },

  // Common
  'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'common.save': { en: 'Save', hi: 'सेव करें' },
  'common.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'common.delete': { en: 'Delete', hi: 'हटाएं' },
  'common.edit': { en: 'Edit', hi: 'संपादित करें' },
  'common.close': { en: 'Close', hi: 'बंद करें' },
  'common.refresh': { en: 'Refresh', hi: 'रिफ्रेश' },
  'common.noData': { en: 'No data available', hi: 'कोई डेटा उपलब्ध नहीं' },

  // Playbooks
  'playbooks.title': { en: 'Playbooks', hi: 'प्लेबुक्स' },
  'playbooks.create': { en: 'Create Playbook', hi: 'प्लेबुक बनाएं' },
  'playbooks.disclaimer': { en: 'Playbooks are checklists for documentation. Not recommendations.', hi: 'प्लेबुक्स दस्तावेज़ीकरण के लिए चेकलिस्ट हैं। सिफ़ारिशें नहीं।' },

  // DataLab
  'datalab.title': { en: 'DataLab', hi: 'डेटा लैब' },
  'datalab.experiment': { en: 'Experiment Lab', hi: 'प्रयोग लैब' },

  // Morning Checklist
  'checklist.title': { en: 'Pre-Market Checklist', hi: 'बाज़ार खुलने से पहले चेकलिस्ट' },
  'checklist.readiness': { en: 'Readiness Score', hi: 'तैयारी स्कोर' },
  'checklist.mindset': { en: 'Mindset Check', hi: 'मानसिकता जांच' },
  'checklist.marketPrep': { en: 'Market Prep', hi: 'बाज़ार की तैयारी' },
  'checklist.tradingPlan': { en: 'Trading Plan', hi: 'ट्रेडिंग योजना' },
  'checklist.riskMgmt': { en: 'Risk Management', hi: 'जोखिम प्रबंधन' },
  'checklist.bias': { en: "Today's Market Bias", hi: 'आज का बाज़ार रुझान' },
  'checklist.bullish': { en: 'Bullish', hi: 'तेज़ी' },
  'checklist.bearish': { en: 'Bearish', hi: 'मंदी' },
  'checklist.neutral': { en: 'Neutral', hi: 'सामान्य' },
  'checklist.maxLoss': { en: 'Max Daily Loss', hi: 'अधिकतम दैनिक नुकसान' },
  'checklist.targetProfit': { en: 'Target Profit', hi: 'लक्ष्य मुनाफ़ा' },
  'checklist.gamePlan': { en: "Today's Game Plan", hi: 'आज की रणनीति' },
  'checklist.save': { en: 'Save & Start Trading', hi: 'सेव करें और ट्रेडिंग शुरू करें' },

  // Achievements
  'achievements.title': { en: 'Achievements', hi: 'उपलब्धियां' },
  'achievements.unlocked': { en: 'unlocked', hi: 'अनलॉक' },

  // AI Insights
  'insights.title': { en: 'AI Insights', hi: 'AI विश्लेषण' },
  'insights.autoGenerated': { en: 'Auto-generated from your data', hi: 'आपके डेटा से स्वचालित' },

  // Advanced Stats
  'stats.profitFactor': { en: 'Profit Factor', hi: 'लाभ अनुपात' },
  'stats.expectancy': { en: 'Expectancy', hi: 'प्रत्याशा' },
  'stats.maxDrawdown': { en: 'Max Drawdown', hi: 'अधिकतम गिरावट' },
  'stats.sharpe': { en: 'Sharpe Ratio', hi: 'शार्प अनुपात' },
  'stats.bestDay': { en: 'Best Day', hi: 'सबसे अच्छा दिन' },
  'stats.worstDay': { en: 'Worst Day', hi: 'सबसे बुरा दिन' },

  // Beginner guidance (Tier 2/3 friendly)
  'guide.whatIsJournal': { en: 'A trade journal helps you learn from your mistakes. Write why you bought or sold — after 10 trades you will see your patterns.', hi: 'ट्रेड जर्नल आपकी गलतियों से सीखने में मदद करता है। लिखें कि आपने क्यों खरीदा या बेचा — 10 ट्रेड के बाद आपको अपने पैटर्न दिखेंगे।' },
  'guide.whatIsPlaybook': { en: 'A playbook is your trading rules checklist. Follow it before every trade to avoid emotional mistakes.', hi: 'प्लेबुक आपके ट्रेडिंग नियमों की चेकलिस्ट है। भावनात्मक गलतियों से बचने के लिए हर ट्रेड से पहले इसे फॉलो करें।' },
  'guide.whatIsWinRate': { en: 'Win Rate = How many trades made profit out of total. Above 50% means you win more than you lose.', hi: 'जीत दर = कुल में से कितने ट्रेड में मुनाफ़ा हुआ। 50% से ऊपर मतलब आप ज़्यादा जीतते हैं।' },
  'guide.whatIsPnl': { en: 'P&L = Profit and Loss. Green means profit, Red means loss. This is your total result after all trades.', hi: 'P&L = लाभ और हानि। हरा मतलब मुनाफ़ा, लाल मतलब नुकसान। यह सभी ट्रेड के बाद आपका कुल नतीजा है।' },
  'guide.whatIsDrawdown': { en: 'Drawdown = The biggest drop from your highest profit. Smaller is better — it means you manage risk well.', hi: 'ड्रॉडाउन = आपके सबसे ज़्यादा मुनाफ़े से सबसे बड़ी गिरावट। कम होना अच्छा है — इसका मतलब आप जोखिम अच्छे से संभालते हैं।' },
  'guide.whatIsEmotion': { en: 'Tag how you FELT during the trade. Were you calm (confident), scared (fearful), or chasing (FOMO)? This helps find bad habits.', hi: 'ट्रेड के दौरान आपने कैसा महसूस किया वो टैग करें। क्या आप शांत (confident) थे, डरे हुए (fearful) थे, या भाग रहे थे (FOMO)? यह बुरी आदतें खोजने में मदद करता है।' },
  'guide.startHere': { en: 'New here? Start with these 3 steps:', hi: 'नए हैं? इन 3 कदमों से शुरू करें:' },
  'guide.step1': { en: 'Import your trades from Zerodha or CSV file', hi: 'अपने ट्रेड Zerodha या CSV फ़ाइल से इम्पोर्ट करें' },
  'guide.step2': { en: 'Write why you took each trade (thesis + emotion)', hi: 'हर ट्रेड क्यों लिया वो लिखें (कारण + भावना)' },
  'guide.step3': { en: 'Check your weekly review every Sunday', hi: 'हर रविवार अपनी साप्ताहिक समीक्षा देखें' },
  'guide.tip': { en: 'Tip', hi: 'सुझाव' },
  'guide.freeForever': { en: 'BazaarSaar is 100% free. No hidden charges, no premium plan.', hi: 'BazaarSaar 100% मुफ़्त है। कोई छिपे शुल्क नहीं, कोई प्रीमियम प्लान नहीं।' },
} as const;

type TranslationKey = keyof typeof translations;

/**
 * Get translated string for the given key and language.
 * Falls back to English if key or language is missing.
 */
export function t(key: TranslationKey, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;

  if (lang === 'both') {
    return `${entry.en} / ${entry.hi}`;
  }

  return entry[lang] || entry.en;
}

export type { TranslationKey };
export { translations };
