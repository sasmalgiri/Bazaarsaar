'use client';

import { useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  AlertTriangle, Calendar, Clock, ExternalLink, TrendingUp,
  Globe, BarChart3, IndianRupee, Sun, Moon
} from 'lucide-react';

// ============================================================
// RBI POLICY DATES 2026 (Update yearly — source: rbi.org.in)
// ============================================================
const RBI_POLICY_DATES = [
  '2026-02-06', '2026-04-09', '2026-06-05',
  '2026-08-07', '2026-10-02', '2026-12-04',
];

// Indian market holidays 2026 (NSE) — Update yearly
const MARKET_HOLIDAYS_2026 = [
  '2026-01-26', // Republic Day
  '2026-02-26', // Maha Shivaratri
  '2026-03-14', // Holi
  '2026-03-31', // Eid-Ul-Fitr
  '2026-04-02', // Ram Navami
  '2026-04-10', // Good Friday
  '2026-04-14', // Dr. Ambedkar Jayanti
  '2026-05-01', // Maharashtra Day
  '2026-06-07', // Eid-Ul-Adha
  '2026-07-07', // Muharram
  '2026-08-15', // Independence Day
  '2026-08-16', // Janmashtami
  '2026-09-05', // Milad-Un-Nabi
  '2026-10-02', // Mahatma Gandhi Jayanti
  '2026-10-20', // Dussehra
  '2026-10-21', // Dussehra (cont.)
  '2026-11-09', // Diwali (Laxmi Puja)
  '2026-11-10', // Diwali Balipratipada
  '2026-11-19', // Guru Nanak Jayanti
  '2026-12-25', // Christmas
];

// Quick links for market data — all FREE, no login needed
const QUICK_LINKS = [
  {
    label: 'Gift Nifty (Live)',
    labelHi: 'Gift Nifty (लाइव)',
    url: 'https://www.google.com/finance/quote/NIFTY_50:INDEXNSE',
    icon: TrendingUp,
    desc: 'See where Nifty might open today',
  },
  {
    label: 'FII/DII Data',
    labelHi: 'FII/DII डेटा',
    url: 'https://www.moneycontrol.com/stocks/marketstats/fii_dii_activity/index.php',
    icon: BarChart3,
    desc: 'What foreign & domestic institutions bought/sold',
  },
  {
    label: 'Economic Calendar',
    labelHi: 'आर्थिक कैलेंडर',
    url: 'https://www.moneycontrol.com/economic-calendar/',
    icon: Calendar,
    desc: 'Upcoming events that move markets',
  },
  {
    label: 'Global Markets',
    labelHi: 'वैश्विक बाज़ार',
    url: 'https://www.google.com/finance/markets/indexes',
    icon: Globe,
    desc: 'US, Asia, Europe — all at once',
  },
];

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isMarketHoliday(dateStr: string): boolean {
  return MARKET_HOLIDAYS_2026.includes(dateStr);
}

function isExpiryDay(date: Date): boolean {
  // Weekly F&O expiry = every Thursday
  return date.getDay() === 4;
}

function isMonthlyExpiry(date: Date): boolean {
  // Monthly expiry = last Thursday of the month
  if (date.getDay() !== 4) return false;
  const nextThursday = new Date(date);
  nextThursday.setDate(nextThursday.getDate() + 7);
  return nextThursday.getMonth() !== date.getMonth();
}

function isRbiDay(dateStr: string): boolean {
  return RBI_POLICY_DATES.includes(dateStr);
}

function getMarketSession(): { status: string; statusHi: string; color: string; icon: typeof Sun } {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const time = hours * 60 + minutes;

  // Pre-market: 8:00 - 9:15
  if (time >= 480 && time < 555) return { status: 'Pre-Market (Get Ready!)', statusHi: 'बाज़ार खुलने वाला है!', color: 'text-amber-500', icon: Sun };
  // Market open: 9:15 - 15:30
  if (time >= 555 && time < 930) return { status: 'Market Open', statusHi: 'बाज़ार खुला है', color: 'text-green-500', icon: TrendingUp };
  // Post-market: 15:30 - 16:00
  if (time >= 930 && time < 960) return { status: 'Market Closing', statusHi: 'बाज़ार बंद हो रहा है', color: 'text-amber-500', icon: Clock };
  // Closed
  return { status: 'Market Closed', statusHi: 'बाज़ार बंद है', color: 'text-[#6b6b8a]', icon: Moon };
}

function getNextExpiryDate(): string {
  const now = new Date();
  const d = new Date(now);
  // Find next Thursday
  while (d.getDay() !== 4) {
    d.setDate(d.getDate() + 1);
  }
  // If today is Thursday and market hasn't closed, show today
  if (now.getDay() === 4 && now.getHours() < 16) {
    return now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function MarketIntel() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const alerts = useMemo(() => {
    const items: { text: string; textHi: string; type: 'warning' | 'info' | 'danger'; icon: typeof AlertTriangle }[] = [];

    if (isWeekend(today)) {
      items.push({ text: 'Weekend — markets are closed today', textHi: 'वीकेंड — आज बाज़ार बंद है', type: 'info', icon: Moon });
    } else if (isMarketHoliday(todayStr)) {
      items.push({ text: 'Market holiday today — NSE/BSE closed', textHi: 'आज बाज़ार की छुट्टी — NSE/BSE बंद', type: 'info', icon: Calendar });
    }

    if (isMonthlyExpiry(today)) {
      items.push({ text: 'MONTHLY F&O EXPIRY today — expect high volatility! Trade smaller.', textHi: 'आज MONTHLY F&O EXPIRY है — ज़्यादा उतार-चढ़ाव! छोटे trades लें।', type: 'danger', icon: AlertTriangle });
    } else if (isExpiryDay(today)) {
      items.push({ text: 'Weekly F&O expiry today — be cautious with options.', textHi: 'आज weekly F&O expiry है — options में सावधान रहें।', type: 'warning', icon: AlertTriangle });
    }

    if (isRbiDay(todayStr)) {
      items.push({ text: 'RBI Policy announcement today — markets may swing wildly. Consider sitting out.', textHi: 'आज RBI Policy का फ़ैसला — बाज़ार में तेज़ हलचल हो सकती है। बैठे रहने पर विचार करें।', type: 'danger', icon: AlertTriangle });
    }

    // Budget day check (usually Feb 1)
    if (today.getMonth() === 1 && today.getDate() === 1) {
      items.push({ text: 'Union Budget day — extreme volatility expected. Be very careful.', textHi: 'आज Union Budget है — बहुत ज़्यादा उतार-चढ़ाव। बहुत सावधान रहें।', type: 'danger', icon: AlertTriangle });
    }

    return items;
  }, [today, todayStr]);

  const session = getMarketSession();
  const nextExpiry = getNextExpiryDate();

  // Find next RBI date
  const nextRbi = RBI_POLICY_DATES.find((d) => d >= todayStr);

  return (
    <div className="space-y-4">
      {/* Market Status Bar */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <session.icon size={16} className={session.color} />
            <div>
              <span className={`text-sm font-medium ${session.color}`}>{session.status}</span>
              <span className="text-[10px] text-amber-500/50 ml-2" lang="hi">{session.statusHi}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-[#6b6b8a]">
            <span>NSE: 9:15 AM – 3:30 PM</span>
            <span>Next Expiry: <strong className="text-[#d4d4e8]">{nextExpiry}</strong></span>
            {nextRbi && (
              <span>Next RBI: <strong className="text-[#d4d4e8]">{new Date(nextRbi).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</strong></span>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Alerts — expiry, RBI, holidays */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <GlassCard
              key={i}
              className={`p-3 border-l-4 ${
                alert.type === 'danger' ? 'border-red-500/50 bg-red-500/[0.03]' :
                alert.type === 'warning' ? 'border-amber-500/50 bg-amber-500/[0.03]' :
                'border-cyan-500/30 bg-cyan-500/[0.03]'
              }`}
            >
              <div className="flex items-start gap-2">
                <alert.icon size={14} className={
                  alert.type === 'danger' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-amber-500' : 'text-cyan-500'
                } />
                <div>
                  <p className={`text-xs font-medium ${
                    alert.type === 'danger' ? 'text-red-400' :
                    alert.type === 'warning' ? 'text-amber-500' : 'text-cyan-500'
                  }`}>{alert.text}</p>
                  <p className="text-[10px] text-amber-500/50 mt-0.5" lang="hi">{alert.textHi}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Quick Data Links */}
      <GlassCard className="p-4">
        <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1">
          Check Before Trading
        </h3>
        <p className="text-[10px] text-amber-500/40 mb-3" lang="hi">Trading से पहले check करें — सब FREE है</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all no-underline group"
            >
              <link.icon size={14} className="text-[#6b6b8a] shrink-0 mt-0.5 group-hover:text-green-500 transition-colors" />
              <div>
                <span className="text-[11px] font-medium text-[#d4d4e8] group-hover:text-[#fafaff] block transition-colors">{link.label}</span>
                <span className="text-[9px] text-amber-500/40 block" lang="hi">{link.labelHi}</span>
                <span className="text-[9px] text-[#4a4a6a] block mt-0.5 leading-snug">{link.desc}</span>
              </div>
              <ExternalLink size={9} className="text-[#4a4a6a] shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </GlassCard>

      {/* Today's Prep Summary */}
      <GlassCard className="p-4 bg-white/[0.01]">
        <h3 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider mb-1">Today&apos;s Prep Checklist</h3>
        <p className="text-[10px] text-amber-500/40 mb-3" lang="hi">आज की तैयारी — ये सब check किया?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6b6b8a]">
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
            <IndianRupee size={12} className="text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[#d4d4e8] font-medium">Set your max loss & target</p>
              <p className="text-[10px] text-amber-500/40" lang="hi">Max loss और target तय करें</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
            <Globe size={12} className="text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[#d4d4e8] font-medium">Check Gift Nifty & global cues</p>
              <p className="text-[10px] text-amber-500/40" lang="hi">Gift Nifty और global cues check करें</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
            <BarChart3 size={12} className="text-purple-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[#d4d4e8] font-medium">Check FII/DII flow (who&apos;s buying?)</p>
              <p className="text-[10px] text-amber-500/40" lang="hi">FII/DII flow check करें (कौन खरीद रहा है?)</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
            <Calendar size={12} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[#d4d4e8] font-medium">Any events today? (RBI, results, expiry)</p>
              <p className="text-[10px] text-amber-500/40" lang="hi">आज कोई event? (RBI, results, expiry)</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
