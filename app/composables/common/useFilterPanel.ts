export function useFilterPanel<T extends Record<string, unknown>>(initial: T) {
  const filters = reactive({ ...initial }) as T

  const hasActiveFilters = computed(() =>
    Object.values(filters).some((v) => v !== '' && v !== null && v !== undefined),
  )

  function reset() {
    Object.assign(filters, initial)
  }

  const panel = useDisclosure()

  return {
    filters,
    hasActiveFilters,
    reset,
    ...panel,
  }
}
