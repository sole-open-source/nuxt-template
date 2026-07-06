import { NAVIGATION_ITEMS } from '~/config/domain'
import type { NavigationItem } from '~/config/domain'

export function useNavigationFeature() {
  const auth = useAuthStore()

  const items = computed((): NavigationItem[] => {
    const user = auth.user
    if (!user) return []
    return NAVIGATION_ITEMS.filter((item) => !item.permission || hasPermission(user, item.permission))
  })

  return { items }
}
