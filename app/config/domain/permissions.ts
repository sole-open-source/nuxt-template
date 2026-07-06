import { UserRole } from '~/types/auth/roles'

export const PERMISSION_GROUPS = {
  Management: [UserRole.ADMIN],
  Content: [UserRole.ADMIN, UserRole.EDITOR],
  ReadOnly: [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER],
} as const

export type PermissionGroup = keyof typeof PERMISSION_GROUPS

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.EDITOR]: 'Editor',
  [UserRole.VIEWER]: 'Visor',
}
