import type { StateCreator } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import type { StoreState } from './types'

/**
 * Configure persist middleware with specific keys to persist
 */
export const persistConfig = {
  name: 'fp-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: (_state: StoreState) => ({}),
  version: 1,
  migrate: (persistedState: unknown, version: number) => {
    if (version === 0) {
      return persistedState as StoreState
    }
    return persistedState as StoreState
  },
}

/**
 * Configure Redux DevTools with enhanced options
 *
 * Note: Zustand has built-in Redux DevTools support through zustand/middleware.
 * The @redux-devtools/extension package is not needed - Zustand uses the browser extension directly.
 */
export const devtoolsConfig = {
  name: 'FP Store',
  enabled: import.meta.env.DEV,
  trace: true,
  traceLimit: 25,
}

export const withMiddleware = (storeCreator: StateCreator<StoreState>) => {
  return devtools(persist(storeCreator, persistConfig), devtoolsConfig)
}
