/**
 * Main store exports
 *
 * This file serves as the public API for the store.
 * Import everything you need from here.
 *
 * @example
 * ```typescript
 * import { useStore } from '@/stores'
 *
 * function MyComponent() {
 *   const state = useStore()
 *   return <div>...</div>
 * }
 * ```
 */

// Main store
export { useStore, resetStore } from './store'

// Types (for advanced usage)
export type * from './types'
