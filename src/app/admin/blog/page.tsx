'use client';

import { useState, useEffect, useCallback } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import {
  PenLine, Save, Eye, Trash2, Plus, ArrowLeft,
  CheckCircle2, Clock, Globe, AlertTriangle
} from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_hi: string;
  excerpt: string;
  excerpt_hi: string;
  body: string;
  body_hi: string;
  category: string;
  read_time: string;
  is_published: boolean;
  is_daily_prep: boolean;
  published_at: string | null;
  created_at: string;
}

const CATEGORIES = [
  'Must Read', 'Beginner', 'Psychology', 'Process',
  'Daily Prep', 'Market Basics', 'Risk Management', 'General',
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [authorized, setAuthorized] = useState(false);

  const supabase = createClient();

  const loadPosts = useCallback(async () => {
    const { data } = await supabase
      .from('blog_post')
      .select('*')
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data }: { data: { user: { id: string } | null } }) => {
      if (data.user) {
        setAuthorized(true);
        loadPosts();
      } else {
        setLoading(false);
      }
    });
  }, [supabase, loadPosts]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleNew = () => {
    setIsNew(true);
    setEditing({
      id: '',
      slug: '',
      title: '',
      title_hi: '',
      excerpt: '',
      excerpt_hi: '',
      body: '',
      body_hi: '',
      category: 'General',
      read_time: '3 min',
      is_published: false,
      is_daily_prep: false,
      published_at: null,
      created_at: new Date().toISOString(),
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    const slug = editing.slug || slugify(editing.title);
    const { data: userData } = await supabase.auth.getUser();

    const payload = {
      slug,
      title: editing.title,
      title_hi: editing.title_hi,
      excerpt: editing.excerpt,
      excerpt_hi: editing.excerpt_hi,
      body: editing.body,
      body_hi: editing.body_hi,
      category: editing.category,
      read_time: editing.read_time,
      is_published: editing.is_published,
      is_daily_prep: editing.is_daily_prep,
      published_at: editing.is_published ? (editing.published_at || new Date().toISOString()) : null,
      author_id: userData.user?.id,
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      const { error } = await supabase.from('blog_post').insert(payload);
      if (error) {
        showMessage(`Error: ${error.message}`);
      } else {
        showMessage('Post created!');
        setIsNew(false);
        setEditing(null);
        loadPosts();
      }
    } else {
      const { error } = await supabase.from('blog_post').update(payload).eq('id', editing.id);
      if (error) {
        showMessage(`Error: ${error.message}`);
      } else {
        showMessage('Post saved!');
        loadPosts();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return;
    await supabase.from('blog_post').delete().eq('id', id);
    showMessage('Post deleted');
    loadPosts();
  };

  const handlePublish = async (post: BlogPost) => {
    const newState = !post.is_published;
    await supabase.from('blog_post').update({
      is_published: newState,
      published_at: newState ? new Date().toISOString() : null,
    }).eq('id', post.id);
    showMessage(newState ? 'Published!' : 'Unpublished');
    loadPosts();
  };

  if (!authorized) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <AlertTriangle size={40} className="text-amber-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-[#fafaff] mb-2">Admin Access Required</h1>
        <p className="text-sm text-[#6b6b8a]">Please log in to manage blog posts.</p>
      </div>
    );
  }

  // Editor view
  if (editing) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => { setEditing(null); setIsNew(false); }}
            className="flex items-center gap-1.5 text-sm text-[#6b6b8a] bg-transparent border-none cursor-pointer hover:text-[#d4d4e8]"
          >
            <ArrowLeft size={14} /> Back to all posts
          </button>
          {message && (
            <span className="text-xs text-green-500 flex items-center gap-1">
              <CheckCircle2 size={12} /> {message}
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold text-[#fafaff] mb-4">
          {isNew ? 'New Blog Post' : 'Edit Post'}
        </h1>

        <div className="space-y-4">
          {/* Title */}
          <GlassCard className="p-4">
            <label className="block text-xs text-[#6b6b8a] mb-1.5 font-medium">Title (English)</label>
            <input
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: slugify(e.target.value) })}
              placeholder="e.g. How to read Gift Nifty before market opens"
              className="w-full px-3 py-2.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30"
            />
            <label className="block text-xs text-amber-500/50 mb-1.5 mt-3 font-medium">Title (Hindi)</label>
            <input
              value={editing.title_hi}
              onChange={(e) => setEditing({ ...editing, title_hi: e.target.value })}
              placeholder="हिंदी में title"
              className="w-full px-3 py-2.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30"
            />
            <p className="text-[10px] text-[#4a4a6a] mt-1">Slug: {editing.slug || slugify(editing.title)}</p>
          </GlassCard>

          {/* Excerpt */}
          <GlassCard className="p-4">
            <label className="block text-xs text-[#6b6b8a] mb-1.5 font-medium">Short Description (shown in list)</label>
            <input
              value={editing.excerpt}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              placeholder="1-2 sentences summary"
              className="w-full px-3 py-2.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30"
            />
            <input
              value={editing.excerpt_hi}
              onChange={(e) => setEditing({ ...editing, excerpt_hi: e.target.value })}
              placeholder="हिंदी में summary"
              className="w-full px-3 py-2.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30 mt-2"
            />
          </GlassCard>

          {/* Body */}
          <GlassCard className="p-4">
            <label className="block text-xs text-[#6b6b8a] mb-1.5 font-medium">
              Article Body (English) — write paragraphs separated by blank lines
            </label>
            <textarea
              value={editing.body}
              onChange={(e) => setEditing({ ...editing, body: e.target.value })}
              placeholder="Write your article here. Each paragraph on a new line.&#10;&#10;Use simple language. Explain terms. Add examples.&#10;&#10;Think: Would a college student who never traded understand this?"
              rows={12}
              className="w-full px-3 py-2.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30 resize-y font-mono"
            />
            <label className="block text-xs text-amber-500/50 mb-1.5 mt-3 font-medium">Article Body (Hindi)</label>
            <textarea
              value={editing.body_hi}
              onChange={(e) => setEditing({ ...editing, body_hi: e.target.value })}
              placeholder="हिंदी में article लिखें"
              rows={8}
              className="w-full px-3 py-2.5 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30 resize-y font-mono"
            />
          </GlassCard>

          {/* Meta */}
          <GlassCard className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-[#6b6b8a] mb-1 font-medium">Category</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  title="Category"
                  className="w-full px-3 py-2 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] outline-none"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#6b6b8a] mb-1 font-medium">Read Time</label>
                <input
                  value={editing.read_time}
                  onChange={(e) => setEditing({ ...editing, read_time: e.target.value })}
                  placeholder="3 min"
                  className="w-full px-3 py-2 rounded-lg bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] outline-none"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  id="daily-prep"
                  type="checkbox"
                  checked={editing.is_daily_prep}
                  onChange={(e) => setEditing({ ...editing, is_daily_prep: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="daily-prep" className="text-xs text-[#6b6b8a]">Daily Prep Post</label>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  id="is-published"
                  type="checkbox"
                  checked={editing.is_published}
                  onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is-published" className="text-xs text-[#6b6b8a]">Published</label>
              </div>
            </div>
          </GlassCard>

          {/* Save */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !editing.title.trim() || !editing.body.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={14} />
              {saving ? 'Saving...' : isNew ? 'Create Post' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(null); setIsNew(false); }}
              className="px-4 py-3 rounded-xl text-sm text-[#6b6b8a] bg-transparent border border-white/[0.06] cursor-pointer hover:bg-white/[0.04]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#fafaff]">Blog Admin</h1>
          <p className="text-xs text-[#6b6b8a]">Write & publish articles, daily market prep, and guides</p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors"
        >
          <Plus size={14} /> New Post
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-500 text-xs flex items-center gap-2">
          <CheckCircle2 size={14} /> {message}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-[#6b6b8a]">Loading posts...</div>
      ) : posts.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <PenLine size={32} className="text-[#4a4a6a] mx-auto mb-3" />
          <h2 className="text-base font-semibold text-[#d4d4e8] mb-1">No blog posts yet</h2>
          <p className="text-xs text-[#6b6b8a] mb-4">
            Write your first article — daily market prep, a beginner guide, or a trading tip.
          </p>
          <button
            type="button"
            onClick={handleNew}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400"
          >
            Write First Post
          </button>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <GlassCard key={post.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.is_published ? (
                      <span className="flex items-center gap-1 text-[10px] text-green-500">
                        <Globe size={10} /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-amber-500">
                        <Clock size={10} /> Draft
                      </span>
                    )}
                    <span className="text-[10px] text-[#4a4a6a] px-1.5 py-0.5 rounded bg-white/[0.03]">{post.category}</span>
                    {post.is_daily_prep && (
                      <span className="text-[10px] text-cyan-500 px-1.5 py-0.5 rounded bg-cyan-500/10">Daily Prep</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-[#d4d4e8] truncate">{post.title}</h3>
                  {post.title_hi && <p className="text-[10px] text-amber-500/40 truncate">{post.title_hi}</p>}
                  <p className="text-[10px] text-[#4a4a6a] mt-1">
                    {post.read_time} read &middot; {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePublish(post)}
                    className={`p-2 rounded-lg text-xs border-none cursor-pointer transition-colors ${
                      post.is_published
                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                        : 'bg-white/[0.03] text-[#6b6b8a] hover:bg-white/[0.06]'
                    }`}
                    title={post.is_published ? 'Unpublish' : 'Publish'}
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditing(post); setIsNew(false); }}
                    className="p-2 rounded-lg bg-white/[0.03] text-[#6b6b8a] border-none cursor-pointer hover:bg-white/[0.06]"
                    title="Edit"
                  >
                    <PenLine size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    className="p-2 rounded-lg bg-white/[0.03] text-red-400/50 border-none cursor-pointer hover:bg-red-500/10 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
