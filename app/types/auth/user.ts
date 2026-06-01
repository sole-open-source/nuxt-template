import type { UserRole } from './roles'

export interface User {
  id: string
  email: string
  name: string
  roles: UserRole[]
  avatarUrl?: string
  createdAt: string
}

export interface Session {
  user: User
  token: string
  refreshToken: string
  expiresAt: string
}
