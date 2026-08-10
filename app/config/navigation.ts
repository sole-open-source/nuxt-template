import type { Component } from 'vue'
import type { Permission } from '~/config/permissions'
import { HouseIcon, ShieldIcon } from '@lucide/vue'

export enum NavigationGroup {
  Main = 'main',
  Admin = 'admin',
}

export interface NavigationItem {
  title: string
  icon: Component
  to: string
  group: NavigationGroup
  /**
   * Hides the item when the user lacks it. Presentation only — the route
   * middleware is what enforces the page, and it looks the permission up in
   * AUTH_ROUTE_PERMISSIONS. Keep the two in agreement or the menu will offer a
   * link that 403s.
   */
  requiredPermission: Permission
}

// ─── Navigation items ─────────────────────────────────────────────────────────
// Add/remove items here. The sidebar and the site header derive from this list.
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: 'Dashboard',
    icon: HouseIcon,
    to: '/',
    group: NavigationGroup.Main,
    requiredPermission: 'dashboard:read',
  },
  {
    title: 'Admin',
    icon: ShieldIcon,
    to: '/admin',
    group: NavigationGroup.Admin,
    requiredPermission: 'users:read',
  },
]

export const NAVIGATION_GROUP_LABELS: Record<NavigationGroup, string> = {
  [NavigationGroup.Main]: 'Main',
  [NavigationGroup.Admin]: 'Administration',
}
