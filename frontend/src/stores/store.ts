import { create } from 'zustand'
import { withMiddleware } from './middleware'
import type { StoreState } from './types'

/**
 * Main application store
 *
 * This is a minimal Zustand setup ready to be extended.
 * Add your state slices here as your application needs grow.
 *
 * Example:
 * ```typescript
 * export const useStore = create<StoreState>()(
 *   withMiddleware(() => ({
 *     count: 0,
 *     increment: () => set((state) => ({ count: state.count + 1 })),
 *   }))
 * )
 * ```
 */
export const useStore = create<StoreState>()(
  withMiddleware(() => ({
    _initialized: true,
  }))
)

/**
 * Reset entire store to initial state
 */
export const resetStore = () => {
  useStore.setState({ _initialized: true })
}
