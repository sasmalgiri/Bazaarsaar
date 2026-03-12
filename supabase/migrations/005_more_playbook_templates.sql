-- ============================================
-- BAZAARSAAR - Additional Playbook Templates
-- Migration 005
-- Popular Indian market setups for all levels
-- ============================================

-- Opening Range Breakout (ORB) - Most popular intraday setup in India
INSERT INTO playbook_template (id, title, description, market, level)
VALUES
  (gen_random_uuid(), 'Intraday: Opening Range Breakout (ORB)', 'Document an ORB trade on Nifty/BankNifty or stocks. Track the first 15-30 min range breakout. Not a recommendation.', 'EQ', 'BEGINNER'),
  (gen_random_uuid(), 'Intraday: VWAP Reclaim', 'Document a VWAP reclaim trade. Stock dips below VWAP then reclaims with strength. Not a recommendation.', 'EQ', 'BEGINNER'),
  (gen_random_uuid(), 'Swing: Delivery Breakout', 'Document a multi-day delivery breakout trade. Stock breaks key resistance on higher volume. Not a recommendation.', 'EQ', 'BEGINNER'),
  (gen_random_uuid(), 'Swing: BTST (Buy Today Sell Tomorrow)', 'Document a BTST setup. Momentum entry for overnight carry. Not a recommendation.', 'EQ', 'BEGINNER'),
  (gen_random_uuid(), 'Swing: Support Bounce', 'Document a trade at a key support level with defined risk. Not a recommendation.', 'EQ', 'BEGINNER'),
  (gen_random_uuid(), 'F&O: Option Buying Momentum', 'Document an option buying trade based on directional momentum. Not a recommendation.', 'FNO', 'BEGINNER'),
  (gen_random_uuid(), 'F&O: Iron Condor / Strangle', 'Document a non-directional options strategy with defined risk. Not a recommendation.', 'FNO', 'PRO'),
  (gen_random_uuid(), 'Pro: Gap Up / Gap Down', 'Document a gap trade. Entry on pullback to VWAP or gap fill. Not a recommendation.', 'EQ', 'PRO')
ON CONFLICT DO NOTHING;

-- Seed steps for new templates
INSERT INTO playbook_template_step (template_id, step_order, category, step_text, required)
SELECT pt.id, s.step_order, s.category, s.step_text, s.required
FROM playbook_template pt
JOIN (VALUES
  -- ORB
  ('Intraday: Opening Range Breakout (ORB)', 1, 'setup', 'Identify the 15-min or 30-min opening range (high & low).', true),
  ('Intraday: Opening Range Breakout (ORB)', 2, 'entry', 'Entry trigger: breakout above range high (long) or below range low (short)?', true),
  ('Intraday: Opening Range Breakout (ORB)', 3, 'risk', 'Stop loss at opposite end of the range or midpoint.', true),
  ('Intraday: Opening Range Breakout (ORB)', 4, 'risk', 'Position size: max loss in ₹ for this trade.', true),
  ('Intraday: Opening Range Breakout (ORB)', 5, 'exit', 'Target: 1:1 or 1:2 risk-reward? Or trailing stop?', true),
  ('Intraday: Opening Range Breakout (ORB)', 6, 'psych', 'Am I calm or chasing? Did I wait for the candle to close?', true),

  -- VWAP Reclaim
  ('Intraday: VWAP Reclaim', 1, 'setup', 'Stock was above VWAP, dipped below, now reclaiming.', true),
  ('Intraday: VWAP Reclaim', 2, 'entry', 'Entry on close above VWAP with increasing volume.', true),
  ('Intraday: VWAP Reclaim', 3, 'risk', 'Stop loss below the recent swing low or VWAP.', true),
  ('Intraday: VWAP Reclaim', 4, 'risk', 'Max loss for this trade (₹ or % of capital).', true),
  ('Intraday: VWAP Reclaim', 5, 'psych', 'Emotion check: Am I entering because of the plan or because of FOMO?', true),

  -- Delivery Breakout
  ('Swing: Delivery Breakout', 1, 'setup', 'Stock consolidating near resistance on daily chart.', true),
  ('Swing: Delivery Breakout', 2, 'entry', 'Breakout candle closes above resistance with above-average volume.', true),
  ('Swing: Delivery Breakout', 3, 'risk', 'Stop loss below breakout candle low or support level.', true),
  ('Swing: Delivery Breakout', 4, 'risk', 'Position size for swing (consider 2-5 day hold).', true),
  ('Swing: Delivery Breakout', 5, 'exit', 'Target based on measured move or next resistance.', true),
  ('Swing: Delivery Breakout', 6, 'psych', 'Patience check: Will I hold through a normal pullback?', true),

  -- BTST
  ('Swing: BTST (Buy Today Sell Tomorrow)', 1, 'setup', 'Strong momentum stock closing near day high.', true),
  ('Swing: BTST (Buy Today Sell Tomorrow)', 2, 'entry', 'Entry in last 30 min of market hours. Confirm strength.', true),
  ('Swing: BTST (Buy Today Sell Tomorrow)', 3, 'risk', 'Overnight gap risk accepted? Max loss if gaps down.', true),
  ('Swing: BTST (Buy Today Sell Tomorrow)', 4, 'exit', 'Sell in morning session. Time-based exit, not hope-based.', true),
  ('Swing: BTST (Buy Today Sell Tomorrow)', 5, 'psych', 'Am I comfortable holding overnight? No anxiety.', true),

  -- Support Bounce
  ('Swing: Support Bounce', 1, 'setup', 'Stock at a well-tested support level (2+ touches).', true),
  ('Swing: Support Bounce', 2, 'entry', 'Bullish reversal candle at support with volume.', true),
  ('Swing: Support Bounce', 3, 'risk', 'Stop loss below support level. If support breaks, exit.', true),
  ('Swing: Support Bounce', 4, 'risk', 'Risk-reward: Is the target at least 1.5x the stop?', true),
  ('Swing: Support Bounce', 5, 'psych', 'Am I catching a falling knife or is there a genuine bounce signal?', true),

  -- Option Buying
  ('F&O: Option Buying Momentum', 1, 'setup', 'Strong directional move in underlying (Nifty/BankNifty/stock).', true),
  ('F&O: Option Buying Momentum', 2, 'entry', 'Strike selection: ATM or 1-strike OTM. Check premium and IV.', true),
  ('F&O: Option Buying Momentum', 3, 'risk', 'Max loss = premium paid. Is this amount acceptable?', true),
  ('F&O: Option Buying Momentum', 4, 'risk', 'Time decay check: How many days to expiry? Avoid last-day YOLO.', true),
  ('F&O: Option Buying Momentum', 5, 'exit', 'Exit plan: Fixed target (50-100% gain) or trailing stop.', true),
  ('F&O: Option Buying Momentum', 6, 'psych', 'Am I gambling or following a plan? Lottery ticket or thesis?', true),

  -- Iron Condor / Strangle
  ('F&O: Iron Condor / Strangle', 1, 'setup', 'Low volatility / range-bound market expectation.', true),
  ('F&O: Iron Condor / Strangle', 2, 'entry', 'Strikes chosen based on delta / standard deviations.', true),
  ('F&O: Iron Condor / Strangle', 3, 'risk', 'Max loss defined. Margin requirement within limits.', true),
  ('F&O: Iron Condor / Strangle', 4, 'risk', 'Adjustment plan: At what point do I adjust or exit?', true),
  ('F&O: Iron Condor / Strangle', 5, 'risk', 'Event risk: Any scheduled events before expiry?', true),
  ('F&O: Iron Condor / Strangle', 6, 'psych', 'Am I comfortable with the max loss scenario?', true),

  -- Gap Up / Gap Down
  ('Pro: Gap Up / Gap Down', 1, 'setup', 'Stock gaps up/down >1%. Identify cause (news/earnings/sector).', true),
  ('Pro: Gap Up / Gap Down', 2, 'entry', 'Entry on pullback to VWAP or gap fill level.', true),
  ('Pro: Gap Up / Gap Down', 3, 'risk', 'Stop loss beyond gap candle extreme.', true),
  ('Pro: Gap Up / Gap Down', 4, 'risk', 'Size appropriately — gaps are volatile.', true),
  ('Pro: Gap Up / Gap Down', 5, 'exit', 'Target: gap fill (fade) or continuation (momentum).', true),
  ('Pro: Gap Up / Gap Down', 6, 'psych', 'Am I reacting to the gap or trading my plan?', true)
) AS s(title, step_order, category, step_text, required)
ON pt.title = s.title
ON CONFLICT DO NOTHING;
