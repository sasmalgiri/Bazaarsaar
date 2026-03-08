import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface DashboardWidget {
  id: string;
  label: string;
  enabled: boolean;
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'kpis', label: 'KPI Cards', enabled: true },
  { id: 'behavioral', label: 'Behavioral Insights', enabled: true },
  { id: 'playbooks', label: 'Playbook Comparison', enabled: true },
  { id: 'broker', label: 'Broker Connection', enabled: true },
  { id: 'equity', label: 'Equity Curve', enabled: true },
  { id: 'pnlSymbol', label: 'P&L by Symbol', enabled: true },
  { id: 'heatmap', label: 'P&L Heatmap', enabled: true },
  { id: 'recentTrades', label: 'Recent Trades', enabled: true },
  { id: 'watchlist', label: 'Watchlist', enabled: false },
];

interface DashboardStore {
  widgets: DashboardWidget[];
  toggleWidget: (id: string) => void;
  resetWidgets: () => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      widgets: DEFAULT_WIDGETS,
      toggleWidget: (id: string) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, enabled: !w.enabled } : w
          ),
        })),
      resetWidgets: () => set({ widgets: DEFAULT_WIDGETS }),
    }),
    {
      name: 'bazaarsaar-dashboard',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
