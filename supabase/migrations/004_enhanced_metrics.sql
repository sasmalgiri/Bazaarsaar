-- ============================================
-- Migration 004: Enhanced weekly report metrics
-- ============================================

-- Add enhanced analytics columns to weekly_report
ALTER TABLE weekly_report ADD COLUMN IF NOT EXISTS profit_factor DECIMAL(10,4) DEFAULT 0;
ALTER TABLE weekly_report ADD COLUMN IF NOT EXISTS expectancy DECIMAL(12,2) DEFAULT 0;
ALTER TABLE weekly_report ADD COLUMN IF NOT EXISTS max_drawdown DECIMAL(12,2) DEFAULT 0;
ALTER TABLE weekly_report ADD COLUMN IF NOT EXISTS max_drawdown_pct DECIMAL(8,4) DEFAULT 0;
