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

// ========== TRADE ==========
export type TradeSide = 'BUY' | 'SELL';
export type TradeStatus = 'OPEN' | 'CLOSED' | 'PARTIAL';
export type OrderType = 'MARKET' | 'LIMIT' | 'SL' | 'SL-M';

export interface Trade {
  id: string;
  user_id: string;
  broker_connection_id?: string;
  broker_order_id?: string;
  symbol: string;
  exchange: 'NSE' | 'BSE';
  segment: 'EQ' | 'FO' | 'CDS';
  side: TradeSide;
  quantity: number;
  price: number;
  order_type: OrderType;
  status: TradeStatus;
  traded_at: string;
  pnl?: number;
  charges?: number;
  net_pnl?: number;
  import_source: 'zerodha_api' | 'csv' | 'manual';
  created_at: string;
}

// ========== JOURNAL ==========
export type EmotionTag = 'confident' | 'fearful' | 'greedy' | 'neutral' | 'fomo' | 'revenge';

export interface JournalEntry {
  id: string;
  user_id: string;
  trade_id: string;
  thesis?: string;
  invalidation?: string;
  emotion?: EmotionTag;
  checklist_followed: boolean;
  notes?: string;
  rating?: number; // 1-5
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TagDef {
  id: string;
  user_id: string;
  label: string;
  color: string;
  created_at: string;
}

// ========== WEEKLY REPORT ==========
export interface WeeklyReport {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  total_trades: number;
  win_count: number;
  loss_count: number;
  gross_pnl: number;
  net_pnl: number;
  avg_win: number;
  avg_loss: number;
  largest_win: number;
  largest_loss: number;
  journal_fill_rate: number;
  top_symbols: string[];
  emotion_distribution: Record<string, number>;
  notes?: string;
  generated_at: string;
}

// ========== BROKER CONNECTION ==========
export type BrokerName = 'zerodha';
export type ConnectionStatus = 'active' | 'expired' | 'revoked' | 'error';

export interface BrokerConnection {
  id: string;
  user_id: string;
  broker: BrokerName;
  status: ConnectionStatus;
  last_sync_at?: string;
  token_expires_at?: string;
  created_at: string;
}

// ========== CONSENT (DPDP) ==========
export interface ConsentLog {
  id: string;
  user_id: string;
  purpose: string;
  granted: boolean;
  ip_address?: string;
  created_at: string;
}

// ========== USER PREFERENCES ==========
export interface UserPreferences {
  persona: PersonaId | null;
  watchlist: string[];
  language: Language;
  notifications: boolean;
  onboardingCompleted: boolean;
  dpdpConsentGiven: boolean;
}

// ========== DATABASE ==========
export interface AppUser {
  id: string;
  email: string;
  persona: PersonaId | null;
  watchlist: string[];
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}
