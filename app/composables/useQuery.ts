import type { AppError } from '~/core/errors'
import { normalizeError } from '~/core/errors'

/**
 * Minimal async-call state for the client: data/error plus read-only flags.
 * Covers what happens after the first render — data fetched with `useAsyncData`
 * during SSR doesn't need this.
 *
 * One query tracks one call at a time. Overlapping `run()` calls are not
 * ordered: the last one to *resolve* wins, which may not be the last one
 * started. If you fire it per keystroke, debounce at the call site.
 */
export interface Query<T> {
  data: T | null
  error: AppError | null
  isLoading: boolean
  run: (fetcher: () => Promise<T>) => Promise<void>
}

export function useQuery<T>(): Query<T> {
  // `shallowRef` because API responses are reassigned wholesale, never mutated:
  // deep reactivity on a list of rows costs a proxy per row and buys nothing.
  const data = shallowRef<T | null>(null)
  const error = shallowRef<AppError | null>(null)
  const isLoading = ref(false)

  async function run(fetcher: () => Promise<T>): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      data.value = await fetcher()
    } catch (err) {
      error.value = normalizeError(err)
    } finally {
      isLoading.value = false
    }
  }

  // The cast is the price of `reactive()` unwrapping a ref of an unresolved
  // generic: at runtime the object is exactly `Query<T>`.
  return reactive({ data, error, isLoading, run }) as Query<T>
}
