import type { PermissionGroup } from '~/config/domain'

declare module 'vue-router' {
    interface RouteMeta {
        requiredPermission?: PermissionGroup
    }
}

export {}
