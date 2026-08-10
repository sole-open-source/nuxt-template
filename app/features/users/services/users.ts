import type { UserFormData } from '~/features/users/schemas'
import type { User } from '~/types/user'
import { BaseService } from '~/core/service'

export class UsersService extends BaseService {
  /**
   * Empty base URL: the demo endpoints live in this app, so requests stay
   * relative. Drop the second argument to target `runtimeConfig.public.apiBaseUrl`
   * once a real backend serves /users.
   */
  constructor(token: string | (() => string | null) = '') {
    super(token, '')
  }

  list(search?: string) {
    return this.api<User[]>('/api/users', { query: { q: search || undefined } })
  }

  create(data: UserFormData) {
    return this.api<User>('/api/users', { method: 'POST', body: data })
  }

  update(id: string, data: UserFormData) {
    return this.api<User>(`/api/users/${id}`, { method: 'PATCH', body: data })
  }

  remove(id: string) {
    return this.api(`/api/users/${id}`, { method: 'DELETE' })
  }
}
