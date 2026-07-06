import { NAVIGATION_GROUP_LABELS, NAVIGATION_ITEMS, NavigationGroup } from '~/config/domain'
import type { NavigationItem } from '~/config/domain'

export interface NavigationGroupView {
  label: string
  items: NavigationItem[]
}

export function useNavigationFeature() {
  const auth = useAuthStore()

  const items = computed((): NavigationItem[] => {
    const user = auth.user
    if (!user) return []
    return NAVIGATION_ITEMS.filter(
      (item) => !item.permissions || hasAnyPermission(user, item.permissions),
    )
  })

  const groups = computed((): NavigationGroupView[] => {
    return Object.values(NavigationGroup)
      .map((group) => ({
        label: NAVIGATION_GROUP_LABELS[group],
        items: items.value.filter((item) => item.group === group),
      }))
      .filter((group) => group.items.length > 0)
  })

  return { items, groups }
}
