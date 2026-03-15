-- ============================================
-- BAZAARSAAR - Blog Posts Table
-- For daily market prep, articles, tips
-- ============================================

CREATE TABLE IF NOT EXISTS blog_post (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(200) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_hi TEXT,
  excerpt TEXT,
  excerpt_hi TEXT,
  body TEXT NOT NULL,           -- Markdown content
  body_hi TEXT,                 -- Hindi version (Markdown)
  category VARCHAR(50) DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  read_time VARCHAR(20) DEFAULT '3 min',
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  is_daily_prep BOOLEAN DEFAULT false,  -- True for daily market prep posts
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_blog_post_published ON blog_post(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_post_slug ON blog_post(slug);
CREATE INDEX IF NOT EXISTS idx_blog_post_daily_prep ON blog_post(is_daily_prep, published_at DESC);

-- RLS
ALTER TABLE blog_post ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts (public blog)
CREATE POLICY "Anyone can read published posts"
  ON blog_post FOR SELECT
  USING (is_published = true);

-- Authors can manage their own posts
CREATE POLICY "Authors can insert posts"
  ON blog_post FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts"
  ON blog_post FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own posts"
  ON blog_post FOR DELETE
  USING (auth.uid() = author_id);

-- Authors can read their own drafts
CREATE POLICY "Authors can read own drafts"
  ON blog_post FOR SELECT
  USING (auth.uid() = author_id);
