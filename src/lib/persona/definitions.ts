import type { PersonaConfig, PersonaId, StarterPack } from '@/types';

export const PERSONA_CONFIGS: Record<PersonaId, PersonaConfig> = {
  swing_trader: {
    id: 'swing_trader',
    label: 'Swing Trader',
    labelHindi: 'स्विंग ट्रेडर',
    description: 'Short-term momentum, breakouts, and technical setups (1\u201330 days)',
    icon: '\u26A1',
    tagline: 'Ride the momentum. Capture the move.',
    gradient: 'from-cyan-500/20 via-cyan-400/5 to-transparent',
    glowColor: '0 0 60px rgba(6,182,212,0.2)',
    accentBg: 'rgba(6,182,212,0.1)',
    accentBorder: 'rgba(6,182,212,0.4)',
    metrics: ['RSI', 'MACD', 'Breakouts', 'Volume Surge', 'EMA Cross'],
    color: 'cyan',
  },
  investor: {
    id: 'investor',
    label: 'Long-Term Investor',
    labelHindi: 'दीर्घकालिक निवेशक',
    description: 'Fundamentals, valuations, and compounding wealth (1+ years)',
    icon: '\uD83C\uDFE6',
    tagline: 'Build wealth. Think in decades.',
    gradient: 'from-amber-500/20 via-amber-400/5 to-transparent',
    glowColor: '0 0 60px rgba(245,166,35,0.2)',
    accentBg: 'rgba(245,166,35,0.1)',
    accentBorder: 'rgba(245,166,35,0.4)',
    metrics: ['P/E Ratio', 'ROE', 'FCF', 'Revenue Growth', 'Promoter Holding'],
    color: 'amber',
  },
  options_trader: {
    id: 'options_trader',
    label: 'Options Trader',
    labelHindi: 'ऑप्शंस ट्रेडर',
    description: 'Greeks, IV, OI analysis, and strategy building',
    icon: '\uD83C\uDFAF',
    tagline: 'Master the asymmetry. Trade the edge.',
    gradient: 'from-purple-500/20 via-purple-400/5 to-transparent',
    glowColor: '0 0 60px rgba(139,92,246,0.2)',
    accentBg: 'rgba(139,92,246,0.1)',
    accentBorder: 'rgba(139,92,246,0.4)',
    metrics: ['IV Rank', 'PCR', 'Max Pain', 'OI Change', 'Greeks'],
    color: 'purple',
  },
};

export const STARTER_PACKS: Record<PersonaId, StarterPack[]> = {
  swing_trader: [
    { name: 'Nifty 50 Movers', symbols: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'BHARTIARTL', 'ITC', 'SBIN', 'LT', 'KOTAKBANK'] },
    { name: 'Momentum Picks', symbols: ['TATAELXSI', 'POLYCAB', 'DIXON', 'PERSISTENT', 'ABB', 'BEL', 'HAL', 'BHEL'] },
    { name: 'Bank Nifty', symbols: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK', 'INDUSINDBK'] },
  ],
  investor: [
    { name: 'Blue Chips', symbols: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'BAJFINANCE', 'BHARTIARTL', 'ITC'] },
    { name: 'Dividend Stars', symbols: ['COALINDIA', 'POWERGRID', 'ONGC', 'ITC', 'HINDUNILVR', 'INFY', 'TCS'] },
    { name: 'Growth Compounders', symbols: ['PIDILITIND', 'DMART', 'TITAN', 'BAJFINANCE', 'PERSISTENT', 'DIXON'] },
  ],
  options_trader: [
    { name: 'High OI (FnO)', symbols: ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN'] },
    { name: 'Volatile Movers', symbols: ['TATAMOTORS', 'ADANIENT', 'BAJFINANCE', 'DLF', 'ZOMATO', 'IRCTC'] },
    { name: 'Index Only', symbols: ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY'] },
  ],
};

export const ONBOARDING_FEATURES = [
  { emoji: '\uD83D\uDCCA', title: 'Daily Intelligence Pack', desc: 'Every morning \u2014 what changed, why it matters, exportable.' },
  { emoji: '\uD83D\uDD14', title: 'Explainable Signals', desc: 'Why it fired, historical hit rate, and regime context.' },
  { emoji: '\uD83D\uDCBC', title: 'Portfolio Analytics', desc: 'Unified P&L across brokers. Connect later.' },
];
