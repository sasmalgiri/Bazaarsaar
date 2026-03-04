export const MARKET_HOURS = {
  preOpen: { start: '09:00', end: '09:15' },
  trading: { start: '09:15', end: '15:30' },
  postClose: { start: '15:30', end: '16:00' },
  timezone: 'Asia/Kolkata',
};

export const SEBI_DISCLAIMERS = {
  general: 'BazaarSaar is an analytics tool and does not provide investment advice. Past performance is not indicative of future results. Investments in securities market are subject to market risks. Read all the related documents carefully before investing.',
  generalHindi: 'बाज़ारसार एक एनालिटिक्स टूल है और निवेश सलाह प्रदान नहीं करता। पिछला प्रदर्शन भविष्य के परिणामों का संकेत नहीं है। प्रतिभूति बाजार में निवेश बाजार जोखिमों के अधीन है।',
  signal: 'This signal is for informational purposes only. It is NOT a recommendation to buy, sell, or hold any security. Always consult a SEBI-registered investment advisor.',
  dailyPack: 'The Daily Intelligence Pack is generated from publicly available market data. It does not constitute personalized investment advice.',
};

export const NSE_INDICES = [
  'NIFTY 50', 'NIFTY BANK', 'NIFTY IT', 'NIFTY PHARMA',
  'NIFTY AUTO', 'NIFTY FMCG', 'NIFTY METAL', 'NIFTY REALTY',
  'NIFTY ENERGY', 'NIFTY INFRA',
];

export const APP_VERSION = '0.1.0';
