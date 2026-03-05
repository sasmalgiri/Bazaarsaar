'use client';

import { useCallback } from 'react';
import { usePersonaStore } from '@/lib/store/personaStore';
import { t as translate, type TranslationKey } from './translations';

/**
 * Hook that returns a `t()` function bound to the user's current language preference.
 */
export function useTranslation() {
  const language = usePersonaStore((s) => s.language);

  const t = useCallback(
    (key: TranslationKey) => translate(key, language),
    [language]
  );

  return { t, language };
}
