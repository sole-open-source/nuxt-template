/**
 * Generic filter state — instantiate per feature with its own shape.
 *
 * Usage: `const { filters, hasActive, reset } = useFilters({ search: '', status: '' })`
 */
export function useFilters<T extends Record<string, unknown>>(initial: T) {
  const filters = reactive({ ...initial }) as T

  const hasActive = computed(() =>
    Object.values(filters).some((value) => value !== '' && value !== null && value !== undefined),
  )

  function set<K extends keyof T>(key: K, value: T[K]) {
    filters[key] = value
  }

  function reset() {
    Object.assign(filters, initial)
  }

  return { filters, hasActive, set, reset }
}
