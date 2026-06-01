import { withLoading } from '~/lib/helpers/loading'
import type { AsyncViewState } from '~/types/ui/view-state'

export function useAsyncState<T>(action: () => Promise<T>) {
  const data = ref<T | null>(null)
  const state = reactive({ loading: false, error: null as string | null })

  const viewState = computed((): AsyncViewState => {
    if (state.loading) return 'loading'
    if (state.error) return 'error'
    if (!data.value) return 'idle'
    return 'success'
  })

  async function execute() {
    await withLoading(state, async () => {
      data.value = await action()
    })
  }

  return {
    data: readonly(data),
    viewState,
    error: computed(() => state.error),
    execute,
  }
}
