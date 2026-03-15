import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Cron: Auto-generate daily market prep blog post.
 * Runs Mon-Fri at 7:30 AM IST (2:00 AM UTC).
 * Fetches top Indian market news from Google News RSS,
 * detects F&O expiry, RBI dates, and creates a summary post.
 */

// RBI Policy dates 2026
const RBI_DATES = ['2026-02-06', '2026-04-09', '2026-06-05', '2026-08-07', '2026-10-02', '2026-12-04'];

// Market holidays 2026
const HOLIDAYS = [
  '2026-01-26', '2026-02-26', '2026-03-14', '2026-03-31', '2026-04-02',
  '2026-04-10', '2026-04-14', '2026-05-01', '2026-06-07', '2026-07-07',
  '2026-08-15', '2026-08-16', '2026-09-05', '2026-10-02', '2026-10-20',
  '2026-10-21', '2026-11-09', '2026-11-10', '2026-11-19', '2026-12-25',
];

interface NewsItem {
  title: string;
  link: string;
  source: string;
}

function isExpiryDay(date: Date): boolean {
  return date.getDay() === 4; // Thursday
}

function isMonthlyExpiry(date: Date): boolean {
  if (date.getDay() !== 4) return false;
  const next = new Date(date);
  next.setDate(next.getDate() + 7);
  return next.getMonth() !== date.getMonth();
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

/**
 * Fetch Google News RSS for Indian stock market
 */
async function fetchMarketNews(): Promise<NewsItem[]> {
  const feeds = [
    'https://news.google.com/rss/search?q=indian+stock+market+today&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=nifty+sensex+today&hl=en-IN&gl=IN&ceid=IN:en',
  ];

  const allItems: NewsItem[] = [];

  for (const feedUrl of feeds) {
    try {
      const res = await fetch(feedUrl, {
        headers: { 'User-Agent': 'BazaarSaar/1.0' },
        signal: AbortSignal.timeout(10000),
      });
      const xml = await res.text();

      // Simple XML parsing — extract <item> blocks
      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

      for (const item of items.slice(0, 8)) {
        const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/);
        const linkMatch = item.match(/<link>(.*?)<\/link>/);
        const sourceMatch = item.match(/<source.*?>(.*?)<\/source>/);

        const title = (titleMatch?.[1] || titleMatch?.[2] || '').trim();
        const link = (linkMatch?.[1] || '').trim();
        const source = (sourceMatch?.[1] || 'News').trim();

        if (title && !allItems.some((i) => i.title === title)) {
          allItems.push({ title, link, source });
        }
      }
    } catch {
      // Continue with other feeds
    }
  }

  return allItems.slice(0, 12);
}

/**
 * Build the daily prep post content
 */
function buildDailyPrepPost(
  date: Date,
  dateStr: string,
  news: NewsItem[],
): { title: string; titleHi: string; excerpt: string; excerptHi: string; body: string; bodyHi: string } {
  const dayName = date.toLocaleDateString('en-IN', { weekday: 'long' });
  const dateFormatted = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const isExpiry = isExpiryDay(date);
  const isMonthly = isMonthlyExpiry(date);
  const isRbi = RBI_DATES.includes(dateStr);
  const isHoliday = HOLIDAYS.includes(dateStr);

  const title = `Daily Market Prep — ${dayName}, ${dateFormatted}`;
  const titleHi = `दैनिक बाज़ार तैयारी — ${dayName}, ${dateFormatted}`;

  let excerpt = `Today's market prep: top news, key events, and what to watch.`;
  let excerptHi = `आज की बाज़ार तैयारी: मुख्य समाचार, key events, और क्या देखें।`;

  if (isHoliday) {
    excerpt = `Market holiday today. Use this time to review your trades and learn.`;
    excerptHi = `आज बाज़ार की छुट्टी। अपने trades review करें और सीखें।`;
  }

  // Build body
  const sections: string[] = [];
  const sectionsHi: string[] = [];

  // Alerts
  if (isHoliday) {
    sections.push('🚫 **MARKET HOLIDAY TODAY** — NSE and BSE are closed. No trading today. Use this day to review your journal, study charts, or learn something new from our Learning Resources tab.');
    sectionsHi.push('🚫 **आज बाज़ार की छुट्टी** — NSE और BSE बंद है। आज trading नहीं। अपना journal review करें, charts study करें, या Learning Resources tab से कुछ नया सीखें।');
  }

  if (isMonthly) {
    sections.push('⚠️ **MONTHLY F&O EXPIRY TODAY** — This is the last Thursday of the month. Expect very high volatility, especially in the last hour. If you are a beginner, consider sitting out today or trading with smaller position sizes. Monthly expiry days are when most losses happen.');
    sectionsHi.push('⚠️ **आज MONTHLY F&O EXPIRY है** — महीने का आखिरी गुरुवार। बहुत ज़्यादा उतार-चढ़ाव की उम्मीद, खासकर आखिरी घंटे में। अगर beginner हैं तो आज छोटे trades लें या बैठे रहें।');
  } else if (isExpiry) {
    sections.push('⚠️ **WEEKLY F&O EXPIRY TODAY** — Options expire today. Be cautious with option buying — time decay (theta) accelerates on expiry day. If you must trade options, use strict stop-losses and smaller sizes.');
    sectionsHi.push('⚠️ **आज WEEKLY F&O EXPIRY है** — Options आज expire होंगे। Option buying में सावधान रहें — expiry day पर time decay (theta) तेज़ होती है। Strict stop-loss और छोटे sizes रखें।');
  }

  if (isRbi) {
    sections.push('🏦 **RBI MONETARY POLICY DECISION TODAY** — The Reserve Bank of India will announce its interest rate decision today. Markets can swing 200-500 points in either direction. Many experienced traders avoid trading on RBI days. If you trade, use very tight stop-losses.');
    sectionsHi.push('🏦 **आज RBI MONETARY POLICY का फ़ैसला** — RBI आज ब्याज दर का फ़ैसला करेगा। बाज़ार 200-500 points किसी भी तरफ जा सकता है। कई अनुभवी traders RBI days पर trade नहीं करते। अगर trade करें तो बहुत tight stop-loss रखें।');
  }

  // News section
  if (news.length > 0) {
    sections.push('📰 **TOP MARKET NEWS TODAY:**');
    sectionsHi.push('📰 **आज के मुख्य बाज़ार समाचार:**');

    const newsLines: string[] = [];
    const newsLinesHi: string[] = [];

    for (const item of news) {
      newsLines.push(`• ${item.title} — _${item.source}_`);
      newsLinesHi.push(`• ${item.title} — _${item.source}_`);
    }

    sections.push(newsLines.join('\n'));
    sectionsHi.push(newsLinesHi.join('\n'));
  }

  // Trading reminders
  if (!isHoliday) {
    sections.push(
      '📋 **YOUR MORNING CHECKLIST:**\n' +
      '1. ✅ Check Gift Nifty — where will the market open?\n' +
      '2. ✅ Check FII/DII data — are institutions buying or selling?\n' +
      '3. ✅ Set your max loss for today (e.g., ₹2,000) — STICK TO IT\n' +
      '4. ✅ Set your target profit — don\'t get greedy if you hit it\n' +
      '5. ✅ Write your plan — which stocks? Buy or sell? At what price?\n' +
      '6. ✅ Wait for 9:30 AM — don\'t trade in the first 15 minutes\n\n' +
      '→ Go to Morning Checklist to complete your prep: /morning-checklist',
    );
    sectionsHi.push(
      '📋 **आपकी सुबह की चेकलिस्ट:**\n' +
      '1. ✅ Gift Nifty check करें — बाज़ार कहां खुलेगा?\n' +
      '2. ✅ FII/DII data check करें — संस्थान खरीद रहे हैं या बेच रहे?\n' +
      '3. ✅ आज का max loss तय करें (जैसे ₹2,000) — इससे ज़्यादा नहीं\n' +
      '4. ✅ Target profit तय करें — hit हो तो लालच न करें\n' +
      '5. ✅ Plan लिखें — कौन से stocks? खरीदना/बेचना? किस price पर?\n' +
      '6. ✅ 9:30 AM तक wait करें — पहले 15 मिनट trade न करें\n\n' +
      '→ Morning Checklist भरने जाएं: /morning-checklist',
    );
  }

  // Daily wisdom
  const wisdoms = [
    { en: '💡 **Reminder:** No setup = No trade. "Let me just see what happens" is not a trading plan.', hi: '💡 **याद रखें:** कोई setup नहीं = कोई trade नहीं। "देखते हैं क्या होता है" trading plan नहीं है।' },
    { en: '💡 **Reminder:** The goal is not to make money every day. The goal is to follow your process every day.', hi: '💡 **याद रखें:** लक्ष्य हर दिन पैसे कमाना नहीं है। लक्ष्य हर दिन अपना process follow करना है।' },
    { en: '💡 **Reminder:** If you hit your max loss, STOP. Close the app. Tomorrow is a new day.', hi: '💡 **याद रखें:** Max loss hit हो तो रुकें। App बंद करें। कल नया दिन है।' },
    { en: '💡 **Reminder:** 93% of F&O traders lose money. The 7% who win have one thing in common: discipline.', hi: '💡 **याद रखें:** 93% F&O traders पैसे हारते हैं। जो 7% जीतते हैं उनमें एक बात common है: अनुशासन।' },
    { en: '💡 **Reminder:** Journal your trades. After 30 entries, you\'ll see patterns that no YouTube guru can teach you.', hi: '💡 **याद रखें:** अपने trades journal करें। 30 entries के बाद ऐसे patterns दिखेंगे जो कोई YouTube guru नहीं सिखा सकता।' },
  ];
  const dayIndex = date.getDate() % wisdoms.length;
  sections.push(wisdoms[dayIndex].en);
  sectionsHi.push(wisdoms[dayIndex].hi);

  return {
    title,
    titleHi,
    excerpt,
    excerptHi,
    body: sections.join('\n\n'),
    bodyHi: sectionsHi.join('\n\n'),
  };
}

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin = createAdminClient();

    // IST is UTC+5:30
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const ist = new Date(now.getTime() + istOffset);
    const dateStr = ist.toISOString().split('T')[0];

    // Check if we already posted today
    const { data: existing } = await admin
      .from('blog_post')
      .select('id')
      .eq('slug', `daily-prep-${dateStr}`)
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Already posted today', date: dateStr });
    }

    // Skip weekends
    const day = ist.getDay();
    if (day === 0 || day === 6) {
      return NextResponse.json({ message: 'Weekend — no daily prep', date: dateStr });
    }

    // Fetch news
    const news = await fetchMarketNews();

    // Build the post
    const post = buildDailyPrepPost(ist, dateStr, news);

    // Insert into blog_post
    const { error } = await admin.from('blog_post').insert({
      slug: `daily-prep-${dateStr}`,
      title: post.title,
      title_hi: post.titleHi,
      excerpt: post.excerpt,
      excerpt_hi: post.excerptHi,
      body: post.body,
      body_hi: post.bodyHi,
      category: 'Daily Prep',
      read_time: '2 min',
      is_published: true,
      is_daily_prep: true,
      published_at: now.toISOString(),
      author_id: null, // System-generated
    });

    if (error) {
      console.error('Failed to insert daily prep:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      date: dateStr,
      newsCount: news.length,
      title: post.title,
    });
  } catch (err) {
    console.error('Daily prep cron error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
