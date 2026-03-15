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
