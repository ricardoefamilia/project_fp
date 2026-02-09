/**
 * Enhanced Redux DevTools Configuration
 *
 * This file provides advanced configuration options for Redux DevTools.
 *
 * IMPORTANT: Zustand has built-in Redux DevTools support through zustand/middleware.
 * The @redux-devtools/extension package is NOT required for basic functionality.
 *
 * However, this configuration enables advanced features like:
 * - Stack traces for debugging
 * - Action filtering
 * - State diffing
 * - Time-travel debugging enhancements
 *
 * Usage Examples:
 *
 * Basic (current setup in middleware.ts):
 * ```tsx
 * import { devtoolsConfig } from './middleware'
 * ```
 *
 * Enhanced:
 * ```tsx
 * import { enhancedDevtoolsConfig } from './devtools-config'
 *
 * export const withMiddleware = (storeCreator: StoreWithMiddleware) => {
 *   return devtools(
 *     persist(storeCreator, persistConfig),
 *     enhancedDevtoolsConfig
 *   )
 * }
 * ```
 *
 * With sanitizers:
 * ```tsx
 * import { actionSanitizer, stateSanitizer } from './devtools-config'
 *
 * const config = {
 *   name: 'FP Store',
 *   enabled: import.meta.env.DEV,
 *   actionSanitizer,
 *   stateSanitizer,
 * }
 * ```
 */
import type { DevtoolsOptions } from 'zustand/middleware'

/**
 * Custom DevTools configuration type extending Zustand's options
 */
export type EnhancedDevtoolsOptions = DevtoolsOptions & {}

/**
 * Action sanitizer - clean up actions before displaying in DevTools
 * Useful for removing sensitive data or large payloads
 */
export const actionSanitizer = (action: unknown) => {
  if (typeof action === 'object' && action !== null) {
    const sanitized = { ...action }
    return sanitized
  }
  return action
}

/**
 * State sanitizer - clean up state before displaying in DevTools
 * Useful for removing sensitive data or circular references
 */
export const stateSanitizer = (state: unknown) => {
  if (typeof state === 'object' && state !== null) {
    const sanitized = { ...state }
    return sanitized
  }
  return state
}

/**
 * Predicate function to filter which actions appear in DevTools
 * Return false to hide an action from DevTools
 */
export const actionsFilter = (action: unknown): boolean => {
  if (typeof action === 'string') {
    const ignoredActions: string[] = []
    return !ignoredActions.some((ignored) => action.includes(ignored))
  }
  return true
}

/**
 * Complete enhanced DevTools configuration
 * Use this for production-ready debugging setup
 */
export const enhancedDevtoolsConfig: EnhancedDevtoolsOptions = {
  name: 'FP Store',
  enabled: import.meta.env.DEV,

  trace: true,
  traceLimit: 25,

  serialize: {
    options: {
      undefined: true,
      symbol: true,
    },
  },

  // DevTools features configuration
  features: {
    pause: true,
    lock: true,
    persist: true,
    export: true,
    import: 'custom',
    jump: true,
    skip: true,
    reorder: true,
    dispatch: true,
    test: true,
  },
}

/**
 * Minimal DevTools configuration (recommended for most cases)
 * This is what's currently used in middleware.ts
 */
export const minimalDevtoolsConfig = {
  name: 'FP Store',
  enabled: import.meta.env.DEV,
}

/**
 * Production DevTools configuration
 * Only enable if explicitly needed in production
 */
export const productionDevtoolsConfig = {
  name: 'FP Store',
  enabled: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  // Limit features in production
  features: {
    pause: false,
    lock: false,
    persist: false,
    export: true, // Allow exporting for bug reports
    import: false,
    jump: false,
    skip: false,
    reorder: false,
    dispatch: false,
    test: false,
  },
}

/**
 * Helper to check if Redux DevTools extension is installed
 */
export const isReduxDevToolsInstalled = (): boolean => {
  if (typeof window === 'undefined') return false
  return '__REDUX_DEVTOOLS_EXTENSION__' in window
}

/**
 * Log DevTools status on app load
 */
export const logDevToolsStatus = () => {
  if (import.meta.env.DEV) {
    if (isReduxDevToolsInstalled()) {
      console.log(
        '%c🔧 Redux DevTools: %cEnabled',
        'font-weight: bold;',
        'color: #4CAF50; font-weight: bold;'
      )
      console.log(
        '%c📊 Store: %cFP Store',
        'font-weight: bold;',
        'color: #2196F3; font-weight: bold;'
      )
    } else {
      console.warn(
        '%c⚠️ Redux DevTools extension not found.',
        'color: #FF9800; font-weight: bold;'
      )
      console.log(
        'Install from: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd'
      )
    }
  }
}
