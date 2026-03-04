import { MARKET_HOURS } from './constants';

export function isMarketOpen(): boolean {
  const now = new Date().toLocaleString('en-US', { timeZone: MARKET_HOURS.timezone });
  const current = new Date(now);
  const day = current.getDay();
  if (day === 0 || day === 6) return false;
  const time = current.getHours() * 100 + current.getMinutes();
  return time >= 915 && time <= 1530;
}

export function getMarketStatus(): 'pre-open' | 'open' | 'closed' | 'post-close' {
  const now = new Date().toLocaleString('en-US', { timeZone: MARKET_HOURS.timezone });
  const current = new Date(now);
  const day = current.getDay();
  if (day === 0 || day === 6) return 'closed';
  const time = current.getHours() * 100 + current.getMinutes();
  if (time >= 900 && time < 915) return 'pre-open';
  if (time >= 915 && time <= 1530) return 'open';
  if (time > 1530 && time <= 1600) return 'post-close';
  return 'closed';
}

export function formatINR(value: number, compact?: boolean): string {
  if (compact) {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (abs >= 1e7) return `${sign}\u20B9${(abs / 1e7).toFixed(2)} Cr`;
    if (abs >= 1e5) return `${sign}\u20B9${(abs / 1e5).toFixed(2)} L`;
    if (abs >= 1e3) return `${sign}\u20B9${(abs / 1e3).toFixed(1)}K`;
    return `${sign}\u20B9${abs.toFixed(2)}`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

export function getNextMarketOpen(): Date {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: MARKET_HOURS.timezone }));
  const next = new Date(ist);
  next.setHours(9, 15, 0, 0);
  if (next <= ist) next.setDate(next.getDate() + 1);
  while (next.getDay() === 0 || next.getDay() === 6) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}
