export function useDisclosure(initial = false) {
  const isOpen = ref(initial)

  return {
    isOpen: readonly(isOpen),
    open: () => {
      isOpen.value = true
    },
    close: () => {
      isOpen.value = false
    },
    toggle: () => {
      isOpen.value = !isOpen.value
    },
  }
}
