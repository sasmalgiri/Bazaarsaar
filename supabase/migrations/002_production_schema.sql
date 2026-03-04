-- ============================================
-- BAZAARSAAR - PRODUCTION SCHEMA
-- Phase B: 16 tables + trigger + RLS
-- ============================================

-- ============================================
-- 1. APP_USER (auto-created on signup via trigger)
-- ============================================
CREATE TABLE IF NOT EXISTS app_user (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  persona VARCHAR(20),
  display_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE app_user ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON app_user FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON app_user FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON app_user FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create app_user on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.app_user (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 2. USER_SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
  watchlist TEXT[] DEFAULT '{}',
  language VARCHAR(5) DEFAULT 'en',
  notifications BOOLEAN DEFAULT true,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. CONSENT_LOG (DPDP audit trail)
-- ============================================
CREATE TABLE IF NOT EXISTS consent_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  purpose VARCHAR(50) NOT NULL,
  granted BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own consent" ON consent_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own consent" ON consent_log FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_consent_log_user ON consent_log(user_id);

-- ============================================
-- 4. BROKER_CONNECTION
-- ============================================
CREATE TABLE IF NOT EXISTS broker_connection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  broker VARCHAR(20) NOT NULL DEFAULT 'zerodha',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  encrypted_access_token TEXT,
  token_expires_at TIMESTAMPTZ,
  last_sync_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, broker)
);

ALTER TABLE broker_connection ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own connections" ON broker_connection FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own connections" ON broker_connection FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own connections" ON broker_connection FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own connections" ON broker_connection FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 5. IMPORT_JOB (CSV/API import tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS import_job (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  source VARCHAR(20) NOT NULL, -- 'zerodha_api' | 'csv'
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | processing | done | failed
  file_name VARCHAR(255),
  total_rows INT DEFAULT 0,
  imported_rows INT DEFAULT 0,
  skipped_rows INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE import_job ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own imports" ON import_job FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own imports" ON import_job FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_import_job_user ON import_job(user_id);

-- ============================================
-- 6. INSTRUMENT (NSE stock master, public reference)
-- ============================================
CREATE TABLE IF NOT EXISTS instrument (
  symbol VARCHAR(20) PRIMARY KEY,
  name VARCHAR(200),
  exchange VARCHAR(5) DEFAULT 'NSE',
  segment VARCHAR(5) DEFAULT 'EQ',
  isin VARCHAR(12),
  lot_size INT DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public read access for instrument master
ALTER TABLE instrument ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read instruments" ON instrument FOR SELECT USING (true);

-- ============================================
-- 7. TRADE (normalized trades with RLS)
-- ============================================
CREATE TABLE IF NOT EXISTS trade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  broker_connection_id UUID REFERENCES broker_connection(id) ON DELETE SET NULL,
  import_job_id UUID REFERENCES import_job(id) ON DELETE SET NULL,
  broker_order_id VARCHAR(50),
  symbol VARCHAR(20) NOT NULL,
  exchange VARCHAR(5) DEFAULT 'NSE',
  segment VARCHAR(5) DEFAULT 'EQ',
  side VARCHAR(4) NOT NULL, -- BUY | SELL
  quantity INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  order_type VARCHAR(10) DEFAULT 'MARKET',
  status VARCHAR(10) DEFAULT 'CLOSED',
  traded_at TIMESTAMPTZ NOT NULL,
  pnl DECIMAL(14,2),
  charges DECIMAL(10,2),
  net_pnl DECIMAL(14,2),
  import_source VARCHAR(20) NOT NULL DEFAULT 'manual', -- zerodha_api | csv | manual
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, broker_order_id)
);

ALTER TABLE trade ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own trades" ON trade FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trades" ON trade FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trades" ON trade FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trades" ON trade FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_trade_user ON trade(user_id);
CREATE INDEX idx_trade_symbol ON trade(symbol);
CREATE INDEX idx_trade_traded_at ON trade(traded_at DESC);
CREATE INDEX idx_trade_user_date ON trade(user_id, traded_at DESC);

-- ============================================
-- 8. POSITION_SNAPSHOT (EOD snapshots)
-- ============================================
CREATE TABLE IF NOT EXISTS position_snapshot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  symbol VARCHAR(20) NOT NULL,
  exchange VARCHAR(5) DEFAULT 'NSE',
  quantity INT NOT NULL,
  avg_price DECIMAL(12,2) NOT NULL,
  current_price DECIMAL(12,2),
  pnl DECIMAL(14,2),
  snapshot_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, symbol, snapshot_date)
);

ALTER TABLE position_snapshot ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own snapshots" ON position_snapshot FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own snapshots" ON position_snapshot FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_position_snapshot_user ON position_snapshot(user_id, snapshot_date DESC);

-- ============================================
-- 9. TAG_DEF (user-defined journal tags)
-- ============================================
CREATE TABLE IF NOT EXISTS tag_def (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  label VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#22c55e',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, label)
);

ALTER TABLE tag_def ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tags" ON tag_def FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tags" ON tag_def FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tags" ON tag_def FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tags" ON tag_def FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 10. JOURNAL_ENTRY (one per trade)
-- ============================================
CREATE TABLE IF NOT EXISTS journal_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  trade_id UUID NOT NULL REFERENCES trade(id) ON DELETE CASCADE,
  thesis TEXT,
  invalidation TEXT,
  emotion VARCHAR(20),
  checklist_followed BOOLEAN DEFAULT false,
  notes TEXT,
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, trade_id)
);

ALTER TABLE journal_entry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own journal" ON journal_entry FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal" ON journal_entry FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal" ON journal_entry FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal" ON journal_entry FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_journal_entry_user ON journal_entry(user_id);
CREATE INDEX idx_journal_entry_trade ON journal_entry(trade_id);

-- ============================================
-- 11. JOURNAL_ENTRY_TAG (M2M)
-- ============================================
CREATE TABLE IF NOT EXISTS journal_entry_tag (
  journal_entry_id UUID NOT NULL REFERENCES journal_entry(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tag_def(id) ON DELETE CASCADE,
  PRIMARY KEY (journal_entry_id, tag_id)
);

ALTER TABLE journal_entry_tag ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own entry tags" ON journal_entry_tag FOR SELECT
  USING (EXISTS (SELECT 1 FROM journal_entry je WHERE je.id = journal_entry_id AND je.user_id = auth.uid()));
CREATE POLICY "Users can insert own entry tags" ON journal_entry_tag FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM journal_entry je WHERE je.id = journal_entry_id AND je.user_id = auth.uid()));
CREATE POLICY "Users can delete own entry tags" ON journal_entry_tag FOR DELETE
  USING (EXISTS (SELECT 1 FROM journal_entry je WHERE je.id = journal_entry_id AND je.user_id = auth.uid()));

-- ============================================
-- 12. ATTACHMENT (screenshots via Supabase Storage)
-- ============================================
CREATE TABLE IF NOT EXISTS attachment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  journal_entry_id UUID NOT NULL REFERENCES journal_entry(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name VARCHAR(255),
  mime_type VARCHAR(50),
  size_bytes BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE attachment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attachments" ON attachment FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attachments" ON attachment FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own attachments" ON attachment FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 13. WEEKLY_REPORT (frozen descriptive analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS weekly_report (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  total_trades INT DEFAULT 0,
  win_count INT DEFAULT 0,
  loss_count INT DEFAULT 0,
  gross_pnl DECIMAL(14,2) DEFAULT 0,
  net_pnl DECIMAL(14,2) DEFAULT 0,
  avg_win DECIMAL(14,2) DEFAULT 0,
  avg_loss DECIMAL(14,2) DEFAULT 0,
  largest_win DECIMAL(14,2) DEFAULT 0,
  largest_loss DECIMAL(14,2) DEFAULT 0,
  journal_fill_rate DECIMAL(5,2) DEFAULT 0,
  top_symbols TEXT[] DEFAULT '{}',
  emotion_distribution JSONB DEFAULT '{}',
  notes TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE weekly_report ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reports" ON weekly_report FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reports" ON weekly_report FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_weekly_report_user ON weekly_report(user_id, week_start DESC);

-- ============================================
-- 14. AUDIT_EVENT (security audit trail)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES app_user(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  detail JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_event ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own audit" ON audit_event FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_audit_event_user ON audit_event(user_id, created_at DESC);

-- ============================================
-- 15. OAUTH_STATE (Zerodha CSRF protection)
-- ============================================
CREATE TABLE IF NOT EXISTS oauth_state (
  state VARCHAR(64) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE oauth_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own state" ON oauth_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own state" ON oauth_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own state" ON oauth_state FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 16. SYNC_LOCK (prevent concurrent syncs)
-- ============================================
CREATE TABLE IF NOT EXISTS sync_lock (
  user_id UUID PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
  locked_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE sync_lock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own lock" ON sync_lock FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lock" ON sync_lock FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own lock" ON sync_lock FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- SEED: Common NSE instruments
-- ============================================
INSERT INTO instrument (symbol, name, exchange, segment) VALUES
  ('RELIANCE', 'Reliance Industries Ltd.', 'NSE', 'EQ'),
  ('TCS', 'Tata Consultancy Services Ltd.', 'NSE', 'EQ'),
  ('HDFCBANK', 'HDFC Bank Ltd.', 'NSE', 'EQ'),
  ('INFY', 'Infosys Ltd.', 'NSE', 'EQ'),
  ('ICICIBANK', 'ICICI Bank Ltd.', 'NSE', 'EQ'),
  ('BHARTIARTL', 'Bharti Airtel Ltd.', 'NSE', 'EQ'),
  ('ITC', 'ITC Ltd.', 'NSE', 'EQ'),
  ('SBIN', 'State Bank of India', 'NSE', 'EQ'),
  ('LT', 'Larsen & Toubro Ltd.', 'NSE', 'EQ'),
  ('KOTAKBANK', 'Kotak Mahindra Bank Ltd.', 'NSE', 'EQ'),
  ('HINDUNILVR', 'Hindustan Unilever Ltd.', 'NSE', 'EQ'),
  ('BAJFINANCE', 'Bajaj Finance Ltd.', 'NSE', 'EQ'),
  ('TATAMOTORS', 'Tata Motors Ltd.', 'NSE', 'EQ'),
  ('TITAN', 'Titan Company Ltd.', 'NSE', 'EQ'),
  ('AXISBANK', 'Axis Bank Ltd.', 'NSE', 'EQ'),
  ('ADANIENT', 'Adani Enterprises Ltd.', 'NSE', 'EQ'),
  ('WIPRO', 'Wipro Ltd.', 'NSE', 'EQ'),
  ('HCLTECH', 'HCL Technologies Ltd.', 'NSE', 'EQ'),
  ('MARUTI', 'Maruti Suzuki India Ltd.', 'NSE', 'EQ'),
  ('SUNPHARMA', 'Sun Pharmaceutical Industries Ltd.', 'NSE', 'EQ'),
  ('ONGC', 'Oil and Natural Gas Corporation Ltd.', 'NSE', 'EQ'),
  ('COALINDIA', 'Coal India Ltd.', 'NSE', 'EQ'),
  ('POWERGRID', 'Power Grid Corporation of India Ltd.', 'NSE', 'EQ'),
  ('TATASTEEL', 'Tata Steel Ltd.', 'NSE', 'EQ'),
  ('INDUSINDBK', 'IndusInd Bank Ltd.', 'NSE', 'EQ'),
  ('DMART', 'Avenue Supermarts Ltd.', 'NSE', 'EQ'),
  ('ZOMATO', 'Zomato Ltd.', 'NSE', 'EQ'),
  ('HAL', 'Hindustan Aeronautics Ltd.', 'NSE', 'EQ'),
  ('BEL', 'Bharat Electronics Ltd.', 'NSE', 'EQ'),
  ('DIXON', 'Dixon Technologies (India) Ltd.', 'NSE', 'EQ'),
  ('NIFTY', 'Nifty 50 Index', 'NSE', 'FO'),
  ('BANKNIFTY', 'Nifty Bank Index', 'NSE', 'FO'),
  ('FINNIFTY', 'Nifty Financial Services Index', 'NSE', 'FO'),
  ('MIDCPNIFTY', 'Nifty Midcap Select Index', 'NSE', 'FO')
ON CONFLICT (symbol) DO NOTHING;
