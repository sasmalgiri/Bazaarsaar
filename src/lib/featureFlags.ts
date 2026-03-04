import { IS_BETA_MODE } from '@/lib/betaMode';

function parseBool(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === null || value === '') return defaultValue;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on', 'enabled'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', 'off', 'disabled'].includes(normalized)) return false;
  return defaultValue;
}

export type AppMode = 'beta' | 'full';

export const APP_MODE: AppMode = IS_BETA_MODE ? 'beta' :
  ((process.env.NEXT_PUBLIC_APP_MODE || 'beta').trim().toLowerCase() as AppMode);

export const FEATURES = {
  swingTrader: parseBool(process.env.NEXT_PUBLIC_FEATURE_SWING_TRADER, true),
  investor: parseBool(process.env.NEXT_PUBLIC_FEATURE_INVESTOR, true),
  optionsTrader: parseBool(process.env.NEXT_PUBLIC_FEATURE_OPTIONS_TRADER, true),

  journal: parseBool(process.env.NEXT_PUBLIC_FEATURE_JOURNAL, true),
  brokerConnect: parseBool(process.env.NEXT_PUBLIC_FEATURE_BROKER_CONNECT, true),
  weeklyReport: parseBool(process.env.NEXT_PUBLIC_FEATURE_WEEKLY_REPORT, true),
  csvImport: parseBool(process.env.NEXT_PUBLIC_FEATURE_CSV_IMPORT, true),
  dataExport: parseBool(process.env.NEXT_PUBLIC_FEATURE_DATA_EXPORT, true),

  zerodha: parseBool(process.env.NEXT_PUBLIC_FEATURE_ZERODHA, false),

  pricing: parseBool(process.env.NEXT_PUBLIC_FEATURE_PRICING, false),
  payments: parseBool(process.env.NEXT_PUBLIC_FEATURE_PAYMENTS, false),
} as const;

export type FeatureKey = keyof typeof FEATURES;

export function isFeatureEnabled(key: FeatureKey): boolean {
  return Boolean(FEATURES[key]);
}
