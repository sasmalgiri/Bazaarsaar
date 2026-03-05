'use client';

import { BrokerSettings } from '@/components/settings/BrokerSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { LanguageSettings } from '@/components/settings/LanguageSettings';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Settings size={24} className="text-green-500" />
        <h1 className="text-2xl font-bold text-[#fafaff]">{t('settings.title')}</h1>
      </div>

      <div className="space-y-6">
        <LanguageSettings />
        <BrokerSettings />
        <AccountSettings />
      </div>
    </div>
  );
}
