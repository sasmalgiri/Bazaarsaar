'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PersonaId, Language } from '@/types';

interface PersonaState {
  persona: PersonaId | null;
  watchlist: string[];
  language: Language;
  notifications: boolean;
  onboardingCompleted: boolean;
  onboardingStep: number;
  dpdpConsentGiven: boolean;
  consentTimestamp: string | null;
  _hasHydrated: boolean;
}

interface PersonaActions {
  setPersona: (persona: PersonaId) => void;
  setWatchlist: (symbols: string[]) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  toggleWatchlistSymbol: (symbol: string) => void;
  addPackToWatchlist: (symbols: string[]) => void;
  setLanguage: (lang: Language) => void;
  setNotifications: (enabled: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setOnboardingStep: (step: number) => void;
  setDpdpConsent: (granted: boolean) => void;
  resetOnboarding: () => void;
}

type PersonaStore = PersonaState & PersonaActions;

const initialState: Omit<PersonaState, '_hasHydrated'> = {
  persona: null,
  watchlist: [],
  language: 'en',
  notifications: true,
  onboardingCompleted: false,
  onboardingStep: 0,
  dpdpConsentGiven: false,
  consentTimestamp: null,
};

export const usePersonaStore = create<PersonaStore>()(
  persist(
    (set) => ({
      ...initialState,
      _hasHydrated: false,

      setPersona: (persona) => set({ persona }),
      setWatchlist: (symbols) => set({ watchlist: symbols }),
      addToWatchlist: (symbol) => set((s) => ({
        watchlist: s.watchlist.includes(symbol) ? s.watchlist : [...s.watchlist, symbol],
      })),
      removeFromWatchlist: (symbol) => set((s) => ({
        watchlist: s.watchlist.filter((sym) => sym !== symbol),
      })),
      toggleWatchlistSymbol: (symbol) => set((s) => ({
        watchlist: s.watchlist.includes(symbol)
          ? s.watchlist.filter((sym) => sym !== symbol)
          : [...s.watchlist, symbol],
      })),
      addPackToWatchlist: (symbols) => set((s) => ({
        watchlist: [...new Set([...s.watchlist, ...symbols])],
      })),
      setLanguage: (language) => set({ language }),
      setNotifications: (notifications) => set({ notifications }),
      setOnboardingCompleted: (onboardingCompleted) => set({ onboardingCompleted }),
      setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
      setDpdpConsent: (granted) => set({
        dpdpConsentGiven: granted,
        consentTimestamp: granted ? new Date().toISOString() : null,
      }),
      resetOnboarding: () => set(initialState),
    }),
    {
      name: 'bazaarsaar-persona',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        persona: state.persona,
        watchlist: state.watchlist,
        language: state.language,
        notifications: state.notifications,
        onboardingCompleted: state.onboardingCompleted,
        onboardingStep: state.onboardingStep,
        dpdpConsentGiven: state.dpdpConsentGiven,
        consentTimestamp: state.consentTimestamp,
      }),
      onRehydrateStorage: () => () => {
        usePersonaStore.setState({ _hasHydrated: true });
      },
    }
  )
);
