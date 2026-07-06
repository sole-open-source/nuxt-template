import { LayoutDashboard, ShieldCheck } from '@lucide/vue'
import type { Component } from 'vue'
import type { PermissionGroup } from './permissions'

export enum NavigationGroup {
  Main = 'main',
  Admin = 'admin',
}

export const NAVIGATION_GROUP_LABELS: Record<NavigationGroup, string> = {
  [NavigationGroup.Main]: 'Principal',
  [NavigationGroup.Admin]: 'Administración',
}

export interface NavigationItem {
  label: string
  to: string
  icon: Component
  group: NavigationGroup
  /** Si se omite, el ítem es visible para cualquier usuario autenticado. */
  permissions?: readonly PermissionGroup[]
}

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, group: NavigationGroup.Main },
  {
    label: 'Administración',
    to: '/admin',
    icon: ShieldCheck,
    group: NavigationGroup.Admin,
    permissions: ['Management'],
  },
]
