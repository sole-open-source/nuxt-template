/**
 * Generic pagination state.
 *
 * Usage: `const pagination = usePagination()`
 */
export function usePagination(initialPageSize = 20) {
  const page = ref(1)
  const pageSize = ref(initialPageSize)
  const total = ref(0)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const hasNext = computed(() => page.value < totalPages.value)
  const hasPrev = computed(() => page.value > 1)
  const offset = computed(() => (page.value - 1) * pageSize.value)

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext,
    hasPrev,
    offset,
    next: () => {
      if (hasNext.value) page.value++
    },
    prev: () => {
      if (hasPrev.value) page.value--
    },
    goTo: (target: number) => {
      page.value = Math.max(1, Math.min(target, totalPages.value))
    },
    reset: () => {
      page.value = 1
    },
  }
}
