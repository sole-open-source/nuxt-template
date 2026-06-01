import { PERMISSION_GROUPS } from '~/config/domain'
import type { PermissionGroup } from '~/config/domain'
import type { User } from '~/types'

export function hasPermission(user: User, group: PermissionGroup): boolean {
  if (user.roles.includes('admin' as never)) return true
  return (PERMISSION_GROUPS[group] as readonly string[]).some((r) =>
    user.roles.includes(r as never),
  )
}
