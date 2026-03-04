'use client';

import { BrokerSettings } from '@/components/settings/BrokerSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Settings size={24} className="text-green-500" />
        <h1 className="text-2xl font-bold text-[#fafaff]">Settings</h1>
      </div>

      <div className="space-y-6">
        <BrokerSettings />
        <AccountSettings />
      </div>
    </div>
  );
}
