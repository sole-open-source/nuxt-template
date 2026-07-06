import { LayoutDashboard, ShieldCheck } from '@lucide/vue'
import type { Component } from 'vue'
import type { PermissionGroup } from './permissions'

export interface NavigationItem {
  label: string
  to: string
  icon: Component
  /** Si se omite, el ítem es visible para cualquier usuario autenticado. */
  permission?: PermissionGroup
}

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Administración', to: '/admin', icon: ShieldCheck, permission: 'Management' },
]
