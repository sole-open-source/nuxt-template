/**
 * Toggle state for modals, drawers, dropdowns, etc.
 *
 * Usage: `const modal = useDisclosure()` — or `useDisclosure(true)` to start open.
 * `open` is a ref, so it binds straight to a shadcn `v-model:open`.
 */
export function useDisclosure(initial = false) {
  const open = ref(initial)

  return {
    open,
    show: () => {
      open.value = true
    },
    hide: () => {
      open.value = false
    },
    toggle: () => {
      open.value = !open.value
    },
  }
}
