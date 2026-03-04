// ========== PERSONA SYSTEM ==========
export type PersonaId = 'swing_trader' | 'investor' | 'options_trader';
export type Language = 'en' | 'hi' | 'both';

export interface PersonaConfig {
  id: PersonaId;
  label: string;
  labelHindi: string;
  description: string;
  icon: string;
  tagline: string;
  gradient: string;
  glowColor: string;
  accentBg: string;
  accentBorder: string;
  metrics: string[];
  color: string;
}

export interface StarterPack {
  name: string;
  symbols: string[];
}

// ========== STOCK / MARKET DATA ==========
export interface StockQuote {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  sector?: string;
  industry?: string;
  ltp: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  marketCap?: number;
  high52w?: number;
  low52w?: number;
  updatedAt: string;
}

export interface IndexData {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  advance?: number;
  decline?: number;
  unchanged?: number;
}

// ========== SIGNALS ==========
export type SignalType =
  | 'ema_cross' | 'rsi_oversold' | 'rsi_overbought' | 'volume_spike'
  | 'breakout' | 'macd_cross'
  | 'pe_undervalued' | 'roe_high' | 'promoter_change' | '52w_low_proximity'
  | 'iv_rank_high' | 'pcr_extreme' | 'max_pain_deviation' | 'unusual_oi';

export type SignalStrength = 'strong' | 'moderate' | 'weak';

export interface Signal {
  id: string;
  symbol: string;
  type: SignalType;
  strength: SignalStrength;
  persona: PersonaId;
  headline: string;
  explanation: string;
  hitRate?: number;
  context?: string;
  triggeredAt: string;
  expiresAt?: string;
}

// ========== DAILY INTELLIGENCE PACK ==========
export interface DailyPack {
  date: string;
  persona: PersonaId;
  marketSummary: string;
  topMovers: StockQuote[];
  signals: Signal[];
  sectorRotation?: Record<string, number>;
  generatedAt: string;
}

// ========== OPTIONS DATA ==========
export interface OptionChainEntry {
  symbol: string;
  expiryDate: string;
  strikePrice: number;
  optionType: 'CE' | 'PE';
  openInterest: number;
  changeInOI: number;
  volume: number;
  iv: number;
  ltp: number;
}

export interface GreeksSnapshot {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  ivRank: number;
  pcr: number;
  maxPain: number;
}

// ========== USER PREFERENCES ==========
export interface UserPreferences {
  persona: PersonaId | null;
  watchlist: string[];
  language: Language;
  dailyPackTime: string;
  notifications: boolean;
  onboardingCompleted: boolean;
}

// ========== DATABASE ==========
export interface UserProfile {
  id: string;
  email: string;
  persona: PersonaId | null;
  watchlist: string[];
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}
