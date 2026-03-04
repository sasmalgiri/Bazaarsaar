-- ============================================
-- BAZAARSAAR - GUIDED MODE + PLAYBOOKS + DATALAB
-- Migration 003
-- ============================================

-- ============================================
-- 1. GUIDED PROFILE (wizard result)
-- ============================================
CREATE TABLE IF NOT EXISTS guided_profile (
  user_id UUID PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
  market TEXT NOT NULL,            -- 'EQ' | 'FNO'
  style TEXT NOT NULL,             -- 'INTRADAY' | 'SWING' | 'LONGTERM'
  risk TEXT NOT NULL,              -- 'LOW' | 'MEDIUM' | 'HIGH'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE guided_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY guided_profile_rw_self ON guided_profile
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================
-- 2. PLAYBOOK TEMPLATES (public, read-only)
-- ============================================
CREATE TABLE IF NOT EXISTS playbook_template (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  market TEXT NOT NULL,            -- 'EQ' | 'FNO'
  level TEXT NOT NULL,             -- 'BEGINNER' | 'PRO'
  locale JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playbook_template_step (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES playbook_template(id) ON DELETE CASCADE,
  step_order INT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',   -- setup/risk/entry/exit/psych
  step_text TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(template_id, step_order)
);

ALTER TABLE playbook_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbook_template_step ENABLE ROW LEVEL SECURITY;

-- Public read, no user writes (service role bypasses RLS)
CREATE POLICY playbook_template_select_all ON playbook_template FOR SELECT USING (true);
CREATE POLICY playbook_template_no_write ON playbook_template FOR INSERT WITH CHECK (false);
CREATE POLICY playbook_template_step_select_all ON playbook_template_step FOR SELECT USING (true);
CREATE POLICY playbook_template_step_no_write ON playbook_template_step FOR INSERT WITH CHECK (false);

-- ============================================
-- 3. USER PLAYBOOKS (copied from templates + editable)
-- ============================================
CREATE TABLE IF NOT EXISTS user_playbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  template_id UUID REFERENCES playbook_template(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  market TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'CUSTOM',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_playbook_step (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id UUID NOT NULL REFERENCES user_playbook(id) ON DELETE CASCADE,
  step_order INT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  step_text TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(playbook_id, step_order)
);

ALTER TABLE user_playbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_playbook_step ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_playbook_rw_self ON user_playbook
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY user_playbook_step_select_self ON user_playbook_step
  FOR SELECT USING (EXISTS (SELECT 1 FROM user_playbook up WHERE up.id = playbook_id AND up.user_id = auth.uid()));
CREATE POLICY user_playbook_step_insert_self ON user_playbook_step
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM user_playbook up WHERE up.id = playbook_id AND up.user_id = auth.uid()));
CREATE POLICY user_playbook_step_update_self ON user_playbook_step
  FOR UPDATE USING (EXISTS (SELECT 1 FROM user_playbook up WHERE up.id = playbook_id AND up.user_id = auth.uid()));
CREATE POLICY user_playbook_step_delete_self ON user_playbook_step
  FOR DELETE USING (EXISTS (SELECT 1 FROM user_playbook up WHERE up.id = playbook_id AND up.user_id = auth.uid()));

-- ============================================
-- 4. JOURNAL EXTENSIONS (playbook + checklist)
-- ============================================

-- Add playbook_id to journal_entry
ALTER TABLE journal_entry
  ADD COLUMN IF NOT EXISTS playbook_id UUID REFERENCES user_playbook(id) ON DELETE SET NULL;

-- Checklist results per journal entry
CREATE TABLE IF NOT EXISTS journal_check (
  journal_entry_id UUID NOT NULL REFERENCES journal_entry(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES user_playbook_step(id) ON DELETE CASCADE,
  checked BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (journal_entry_id, step_id)
);

ALTER TABLE journal_check ENABLE ROW LEVEL SECURITY;
CREATE POLICY journal_check_rw_self ON journal_check
  FOR ALL USING (
    EXISTS (SELECT 1 FROM journal_entry je WHERE je.id = journal_entry_id AND je.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM journal_entry je WHERE je.id = journal_entry_id AND je.user_id = auth.uid())
  );

-- ============================================
-- 5. ADD tag_type TO tag_def
-- ============================================
ALTER TABLE tag_def ADD COLUMN IF NOT EXISTS tag_type TEXT NOT NULL DEFAULT 'general';

-- Drop old unique constraint and create new one
ALTER TABLE tag_def DROP CONSTRAINT IF EXISTS tag_def_user_id_label_key;
ALTER TABLE tag_def ADD CONSTRAINT tag_def_user_id_type_label_key UNIQUE(user_id, tag_type, label);

-- ============================================
-- 6. DATALAB
-- ============================================
CREATE TABLE IF NOT EXISTS datalab_recipe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  steps JSONB NOT NULL,
  locale JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS datalab_experiment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  recipe_id UUID REFERENCES datalab_recipe(id) ON DELETE SET NULL,
  inputs JSONB NOT NULL,
  params JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE datalab_recipe ENABLE ROW LEVEL SECURITY;
ALTER TABLE datalab_experiment ENABLE ROW LEVEL SECURITY;

CREATE POLICY datalab_recipe_select_all ON datalab_recipe FOR SELECT USING (true);
CREATE POLICY datalab_recipe_no_write ON datalab_recipe FOR INSERT WITH CHECK (false);
CREATE POLICY datalab_experiment_rw_self ON datalab_experiment
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================
-- 7. STRUCTURED WATCHLISTS
-- ============================================
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS watchlist_item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID NOT NULL REFERENCES watchlist(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(watchlist_id, symbol)
);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_item ENABLE ROW LEVEL SECURITY;

CREATE POLICY watchlist_rw_self ON watchlist
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY watchlist_item_select_self ON watchlist_item
  FOR SELECT USING (EXISTS (SELECT 1 FROM watchlist w WHERE w.id = watchlist_id AND w.user_id = auth.uid()));
CREATE POLICY watchlist_item_insert_self ON watchlist_item
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM watchlist w WHERE w.id = watchlist_id AND w.user_id = auth.uid()));
CREATE POLICY watchlist_item_update_self ON watchlist_item
  FOR UPDATE USING (EXISTS (SELECT 1 FROM watchlist w WHERE w.id = watchlist_id AND w.user_id = auth.uid()));
CREATE POLICY watchlist_item_delete_self ON watchlist_item
  FOR DELETE USING (EXISTS (SELECT 1 FROM watchlist w WHERE w.id = watchlist_id AND w.user_id = auth.uid()));

-- ============================================
-- 8. SEED: Playbook templates
-- ============================================
INSERT INTO playbook_template (id, title, description, market, level)
VALUES
  (gen_random_uuid(), 'Beginner: Breakout Checklist', 'Checklist template to document a breakout-style trade. Not a recommendation.', 'EQ', 'BEGINNER'),
  (gen_random_uuid(), 'Beginner: Mean Reversion Checklist', 'Checklist template to document a mean-reversion trade. Not a recommendation.', 'EQ', 'BEGINNER'),
  (gen_random_uuid(), 'Pro: Options Selling Risk Checklist', 'Risk-first checklist for options selling documentation. Not a recommendation.', 'FNO', 'PRO')
ON CONFLICT DO NOTHING;

-- Seed template steps
INSERT INTO playbook_template_step (template_id, step_order, category, step_text, required)
SELECT pt.id, s.step_order, s.category, s.step_text, s.required
FROM playbook_template pt
JOIN (VALUES
  ('Beginner: Breakout Checklist', 1, 'setup', 'Define setup in one sentence.', true),
  ('Beginner: Breakout Checklist', 2, 'entry', 'What confirms entry? (e.g., level + volume).', true),
  ('Beginner: Breakout Checklist', 3, 'risk', 'Define invalidation level before entry.', true),
  ('Beginner: Breakout Checklist', 4, 'risk', 'Maximum loss accepted (₹ or %).', true),
  ('Beginner: Breakout Checklist', 5, 'psych', 'Emotion at entry (calm/urgent/FOMO).', true),

  ('Beginner: Mean Reversion Checklist', 1, 'setup', 'What makes it stretched/overextended?', true),
  ('Beginner: Mean Reversion Checklist', 2, 'entry', 'Entry trigger (rule you used).', true),
  ('Beginner: Mean Reversion Checklist', 3, 'risk', 'Invalidation rule (when the idea is wrong).', true),
  ('Beginner: Mean Reversion Checklist', 4, 'risk', 'Size rule (fixed / scaled).', true),
  ('Beginner: Mean Reversion Checklist', 5, 'psych', 'Emotion at entry.', true),

  ('Pro: Options Selling Risk Checklist', 1, 'risk', 'Defined max loss and hedge plan (if any).', true),
  ('Pro: Options Selling Risk Checklist', 2, 'risk', 'Check IV regime / event risk (earnings/news).', true),
  ('Pro: Options Selling Risk Checklist', 3, 'risk', 'Expiry + liquidity check (spreads/volume).', true),
  ('Pro: Options Selling Risk Checklist', 4, 'risk', 'Plan for adjustments (rules, not feelings).', true),
  ('Pro: Options Selling Risk Checklist', 5, 'psych', 'Emotion before entry.', true)
) AS s(title, step_order, category, step_text, required)
ON pt.title = s.title
ON CONFLICT DO NOTHING;

-- ============================================
-- 9. SEED: DataLab recipes
-- ============================================
INSERT INTO datalab_recipe (title, description, steps)
VALUES
  ('Normalize & Compare (Rebase=100)', 'Upload up to 3 series and compare from a common baseline.',
   '[{"op":"align_by_date"},{"op":"rebase","base":100}]'::jsonb),
  ('Drawdown & Recovery', 'Compute drawdown from peak over time.',
   '[{"op":"drawdown"}]'::jsonb),
  ('Rolling Volatility (20)', 'Compute rolling volatility (std of returns).',
   '[{"op":"pct_change"},{"op":"rolling_std","window":20}]'::jsonb),
  ('EMA Overlay (20)', 'Compute EMA(20) overlay for one series.',
   '[{"op":"ema","window":20}]'::jsonb),
  ('RSI (14)', 'Compute RSI(14) for one series.',
   '[{"op":"rsi","window":14}]'::jsonb)
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. ADD adherence columns to weekly_report
-- ============================================
ALTER TABLE weekly_report ADD COLUMN IF NOT EXISTS playbook_used_count INT DEFAULT 0;
ALTER TABLE weekly_report ADD COLUMN IF NOT EXISTS avg_checklist_completion DECIMAL(5,2) DEFAULT 0;
ALTER TABLE weekly_report ADD COLUMN IF NOT EXISTS top_missed_steps TEXT[] DEFAULT '{}';
