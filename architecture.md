# Arquitectura Nuxt SaaS — Guía Técnica Definitiva

> Domain-First Layered Architecture para aplicaciones SaaS construidas con Nuxt 4 + Vue 3.5.
> Esta guía define la estructura, patrones, convenciones y fundaciones que deben existir **antes del primer feature**.

---

## Stack

| Capa            | Tecnología                | Justificación                                                |
| --------------- | ------------------------- | ------------------------------------------------------------ |
| Framework       | Nuxt 4.x                  | SSR/SPA/hybrid, auto-imports, file-based routing, middleware |
| UI              | Vue 3.5 + Composition API | `ref`, `computed`, `watch`, script setup                     |
| Lenguaje        | TypeScript strict         | —                                                            |
| Estado          | Pinia 3.x                 | Store por dominio, DevTools, SSR-compatible                  |
| Estilos         | TailwindCSS v4            | —                                                            |
| Componentes     | shadcn-vue                | Copia el código, sin dependencia de versión                  |
| Formularios     | VeeValidate 4 + Zod       | Validación unificada client-side, type-safe                  |
| HTTP            | $api plugin + ofetch      | Cliente centralizado con interceptors, tipado                |
| Auth            | JWT + refresh token       | Implementación propia sobre el plugin $api                   |
| Email           | Resend                    | —                                                            |
| Billing         | Stripe                    | —                                                            |
| Archivos        | Uploadthing               | —                                                            |
| Runtime         | Bun                       | —                                                            |
| Tests unitarios | Vitest + @vue/test-utils  | —                                                            |
| Tests E2E       | Playwright                | —                                                            |

---

## Principios fundamentales

**1. Las fundaciones se crean antes del primer feature.**
`parseApiError`, `withLoading`, `AsyncViewState`, el logger, y los formatters canónicos existen en el commit inicial. No se crean "cuando se necesiten" — para entonces ya habrá 10 implementaciones distintas.

**2. Auto-imports = convención forzada.**
Nuxt auto-importa desde `composables/`, `components/`, `utils/`. Eso significa que la organización por carpeta es la arquitectura. Una carpeta en el lugar equivocado es código fuera del sistema.

**3. `lib/` nunca se auto-importa.**
Todo lo que vive en `lib/` se importa explícitamente con `~/lib/`. Eso lo hace visible — si importas desde `lib/`, sabes que estás tocando infraestructura, no lógica de negocio.

**4. El componente solo habla con el feature composable.**
Ningún componente importa stores directamente. El Feature Composable en `composables/features/` es la única interfaz entre la UI y el estado.

**5. Auth es un feature, no infraestructura.**
`composables/features/auth/` sabe qué roles existen, qué planes tienen qué capacidades. Eso es negocio. `lib/` no conoce nada de eso.

**6. Un patrón, un lugar.**
`parseApiError` en `lib/helpers/error.ts`. `formatCurrency` en `utils/number.ts`. `withLoading` en `lib/helpers/loading.ts`. No hay alternativas, no hay duplicados. Si existe un estándar, se usa. Punto.

**7. Thin pages.**
Las páginas (`pages/*.vue`) son wrappers de máximo 15 líneas. Solo montan el componente View del dominio y definen `definePageMeta`. Sin lógica, sin imports de stores, sin cálculos.

---

## Estructura de directorios

```
├── nuxt.config.ts
├── app.vue
│
├── pages/                        ← thin pages, file-based routing
│   ├── index.vue                 ← redirect a la ruta por defecto del usuario
│   ├── (auth)/
│   │   ├── login.vue
│   │   └── register.vue
│   └── (app)/
│       ├── dashboard/
│       │   └── index.vue
│       └── [domain]/
│           ├── index.vue
│           └── [id].vue
│
├── layouts/
│   ├── default.vue               ← layout de app: sidebar + topbar
│   └── auth.vue                  ← layout limpio para login/register
│
├── middleware/
│   ├── auth.global.ts            ← guard de autenticación global
│   └── permissions.ts            ← guard de permisos por ruta
│
├── plugins/
│   ├── api.ts                    ← $api: cliente HTTP principal
│   ├── logger.ts                 ← $logger: logger estructurado
│   └── error-handler.ts          ← manejador global de errores no capturados
│
├── components/                   ← auto-importados por Nuxt
│   ├── ui/                       ← shadcn-vue (NO modificar)
│   ├── base/                     ← átomos de la marca
│   ├── common/                   ← moléculas sin dominio
│   ├── patterns/                 ← organismos sin dominio
│   └── domain/                   ← componentes de negocio
│       └── [domain]/             ← sin prescripción de subcarpetas internas
│
├── composables/                  ← auto-importados por Nuxt
│   ├── features/                 ← orquestadores por dominio
│   │   ├── auth/                 ← feature de auth (NO va en lib/)
│   │   │   ├── useAuthFeature.ts ← orquestador de sesión
│   │   │   ├── permissions.ts    ← hasPermission(), canUseFeature()
│   │   │   └── index.ts          ← API pública del feature
│   │   └── [domain]/
│   │       └── use[Domain]Feature.ts
│   └── common/                   ← composables genéricos reutilizables
│       ├── useDisclosure.ts
│       ├── useFilterPanel.ts
│       └── useAsyncState.ts
│
├── stores/                       ← Pinia, importados explícitamente
│   └── [domain]/
│       └── use[Entity]Store.ts
│
├── utils/                        ← auto-importados por Nuxt
│   ├── number.ts                 ← formatCurrency, formatPercent (CANÓNICOS)
│   ├── date.ts                   ← formatDate, relativeTime
│   └── string.ts                 ← slugify, truncate
│
├── lib/                          ← NO auto-importado. Import explícito siempre.
│   ├── helpers/
│   │   ├── loading.ts            ← withLoading()
│   │   ├── error.ts              ← parseApiError(), getErrorMessage()
│   │   └── logger.ts             ← instancia del logger (usada por el plugin)
│   └── api/
│       └── client.ts             ← factory del cliente ofetch
│
├── config/
│   └── domain/                   ← constantes de negocio, sin lógica
│       ├── permissions.ts        ← PERMISSION_GROUPS
│       ├── billing-plans.ts      ← PLAN_FEATURES
│       └── pagination.ts         ← PAGE_SIZES
│
├── types/
│   ├── nuxt-app.d.ts             ← augmentación de plugins ($api, $logger)
│   ├── ui/
│   │   └── view-state.ts         ← AsyncViewState
│   ├── auth/
│   │   ├── user.ts               ← User, Session
│   │   └── roles.ts              ← UserRole enum
│   └── saas/
│       ├── org.ts                ← Organization, Membership
│       └── billing.ts            ← Plan, Subscription
│
└── server/                       ← API routes de Nuxt (si se usa)
    └── api/
        └── webhooks/
            └── stripe.post.ts
```

---

## Capas de la arquitectura

### `lib/helpers/error.ts` — parseApiError canónico

Este archivo existe antes del primer store. No hay alternativas. Todos los `catch` del proyecto usan `parseApiError`.

```typescript
// lib/helpers/error.ts

export interface ApiErrorShape {
  message: string
  statusCode?: number
  data?: unknown
}

/**
 * Normaliza cualquier error a un string legible.
 * Maneja errores de ofetch, Error nativos, y strings.
 */
export function parseApiError(err: unknown): string {
  // Error de ofetch con body estructurado
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>

    // ofetch: err.data.detail / err.data.message
    if (e.data && typeof e.data === 'object') {
      const d = e.data as Record<string, unknown>
      if (typeof d.detail === 'string') return d.detail
      if (typeof d.message === 'string') return d.message
      if (typeof d.error === 'string') return d.error
    }

    // Error nativo
    if (typeof (e as Error).message === 'string') return (e as Error).message
  }

  if (typeof err === 'string') return err
  return 'Error desconocido'
}

export function getErrorMessage(err: unknown): string {
  return parseApiError(err)
}
```

---

### `lib/helpers/loading.ts` — withLoading

Elimina el boilerplate de try/catch/finally. Todos los actions de stores lo usan.

```typescript
// lib/helpers/loading.ts
import { parseApiError } from './error'

export interface LoadingState {
  loading: boolean
  error: string | null
}

export async function withLoading<T>(
  state: LoadingState,
  action: () => Promise<T>,
  opts?: { silent?: boolean },
): Promise<T> {
  state.loading = true
  state.error = null
  try {
    return await action()
  } catch (err) {
    if (!opts?.silent) state.error = parseApiError(err)
    throw err
  } finally {
    state.loading = false
  }
}
```

---

### `lib/helpers/logger.ts` — logger estructurado

Nunca `console.log` en código de producción. El plugin `$logger` expone esta instancia.

```typescript
// lib/helpers/logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  timestamp: string
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  }

  if (import.meta.dev) {
    // En desarrollo: legible
    const styles: Record<LogLevel, string> = {
      debug: 'color: #888',
      info: 'color: #4fc3f7',
      warn: 'color: #ffb74d',
      error: 'color: #ef5350; font-weight: bold',
    }
    console.log(`%c[${level.toUpperCase()}] ${message}`, styles[level], context ?? '')
  } else {
    // En producción: JSON estructurado para ingestión en Sentry/Datadog/etc.
    console.log(JSON.stringify(entry))
  }
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => log('debug', msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
}
```

---

### `plugins/api.ts` — cliente HTTP tipado

Un solo cliente. Ningún fetch nativo en stores ni composables.

```typescript
// plugins/api.ts
import { $fetch, type FetchOptions } from 'ofetch'
import type { NitroFetchRequest } from 'nitropack'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (auth.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${auth.token}`,
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        auth.logout()
        navigateTo('/login')
      }
    },
  })

  return {
    provide: { api },
  }
})
```

```typescript
// types/nuxt-app.d.ts — augmentación de plugins
// SIN ESTO: useNuxtApp() as any en todos los stores
import type { $Fetch } from 'ofetch'
import type { logger } from '~/lib/helpers/logger'

declare module '#app' {
  interface NuxtApp {
    $api: $Fetch
    $logger: typeof logger
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: $Fetch
    $logger: typeof logger
  }
}

export {}
```

---

### `types/ui/view-state.ts` — AsyncViewState

```typescript
export type AsyncViewState = 'idle' | 'loading' | 'success' | 'error' | 'empty'
```

Reemplaza `isLoading + hasError + isEmpty`. Estado único y exclusivo — nunca `loading` y `error` simultáneamente.

---

### `utils/number.ts` — formatters canónicos

Un solo archivo. No hay `formatCurrency` en componentes ni en `lib/`. Si existe acá, se usa. Si no existe, se agrega acá.

```typescript
// utils/number.ts
const DEFAULT_LOCALE = 'es-CO'
const DEFAULT_CURRENCY = 'COP'

export function formatCurrency(
  value: number | string,
  opts?: { currency?: string; locale?: string; compact?: boolean },
): string {
  const amount = typeof value === 'string' ? parseFloat(value) : value
  const locale = opts?.locale ?? DEFAULT_LOCALE
  const currency = opts?.currency ?? DEFAULT_CURRENCY

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: opts?.compact ? 'compact' : 'standard',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE).format(value)
}
```

---

### `config/domain/` — constantes del negocio

Solo datos. Sin lógica. Sin funciones. Si necesita un `if`, no pertenece acá.

```typescript
// config/domain/permissions.ts
import { UserRole } from '~/types/auth/roles'

export const PERMISSION_GROUPS = {
  Lands: [UserRole.ORIGINATOR_STAFF, UserRole.ORIGINATOR_LEADER, UserRole.VALIDATOR_LEADER],
  Projects: [UserRole.ORIGINATOR_STAFF, UserRole.ORIGINATOR_LEADER, UserRole.DEAL_LEADER],
  Investment: [UserRole.DEAL_LEADER, UserRole.VALIDATOR_LEADER],
  EPC: [UserRole.DEAL_EPC],
  Dataroom: [UserRole.DATAROOM_ACCESS],
} as const

export type PermissionGroup = keyof typeof PERMISSION_GROUPS
```

```typescript
// config/domain/billing-plans.ts
export const PLAN_FEATURES = {
  starter: { maxUsers: 5, canExport: false, canApiAccess: false },
  pro: { maxUsers: 25, canExport: true, canApiAccess: false },
  scale: { maxUsers: Infinity, canExport: true, canApiAccess: true },
} as const

export type Plan = keyof typeof PLAN_FEATURES
export type PlanFeature = keyof (typeof PLAN_FEATURES)['starter']
```

---

### `stores/[domain]/` — Pinia stores

**Convención única: Options API.** No se mezcla con Setup API. Un store por entidad principal. Todos tienen `resetState()`.

```typescript
// stores/projects/useProjectsStore.ts
import { defineStore } from 'pinia'
import { withLoading } from '~/lib/helpers/loading'
import type { Project, CreateProjectInput } from '~/types/projects'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    items: [] as Project[],
    selected: null as Project | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    hasItems: (s) => s.items.length > 0,
    activeItems: (s) => s.items.filter((p) => p.status === 'active'),
  },

  actions: {
    async fetchAll(orgId: string) {
      const { $api } = useNuxtApp()
      await withLoading(this, () =>
        $api<Project[]>(`/orgs/${orgId}/projects`).then((data) => {
          this.items = data
        }),
      )
    },

    async create(orgId: string, input: CreateProjectInput) {
      const { $api } = useNuxtApp()
      const created = await $api<Project>(`/orgs/${orgId}/projects`, {
        method: 'POST',
        body: input,
      })
      this.items = [...this.items, created]
      return created
    },

    async remove(id: string) {
      const { $api } = useNuxtApp()
      await $api(`/projects/${id}`, { method: 'DELETE' })
      this.items = this.items.filter((p) => p.id !== id)
      if (this.selected?.id === id) this.selected = null
    },

    select(id: string) {
      this.selected = this.items.find((p) => p.id === id) ?? null
    },

    // Siempre presente — el feature composable lo llama en onUnmounted
    resetState() {
      this.items = []
      this.selected = null
      this.loading = false
      this.error = null
    },
  },
})
```

---

### `composables/features/auth/` — Feature de autenticación

Auth no es infraestructura. Sabe qué roles existen y qué planes tienen qué capacidades. Por eso vive en `features/`, no en `lib/`.

```typescript
// composables/features/auth/permissions.ts
import { PERMISSION_GROUPS, PLAN_FEATURES } from '~/config/domain'
import type { User, Plan, PermissionGroup, PlanFeature } from '~/types'

export function hasPermission(user: User, group: PermissionGroup): boolean {
  if (user.roles.includes('is_administrator')) return true
  return (PERMISSION_GROUPS[group] as readonly string[]).some((r) => user.roles.includes(r))
}

export function canUseFeature(plan: Plan, feature: PlanFeature): boolean {
  const value = PLAN_FEATURES[plan][feature]
  if (typeof value === 'number') return value > 0
  return Boolean(value)
}

export function isWithinPlanLimit(plan: Plan, feature: PlanFeature, current: number): boolean {
  const limit = PLAN_FEATURES[plan][feature]
  if (typeof limit !== 'number') return false
  return current < limit
}
```

```typescript
// composables/features/auth/index.ts — API pública
export { hasPermission, canUseFeature, isWithinPlanLimit } from './permissions'
export { useAuthFeature } from './useAuthFeature'
```

---

### `composables/features/[domain]/` — Orquestadores

El orquestador es la única pieza que sabe cuántos stores existen para un dominio. Coordina, deriva el view model, y maneja el lifecycle.

**Reglas:**

- Crea e instancia los stores necesarios
- Deriva `viewState` como `AsyncViewState`
- Calcula datos procesados — el componente nunca hace `.filter()` ni `.sort()` inline
- Expone acciones compuestas
- Llama `resetState()` en `onUnmounted`
- No importa componentes
- No hace llamadas HTTP directas

```typescript
// composables/features/projects/useProjectsFeature.ts
import type { AsyncViewState } from '~/types/ui/view-state'
import type { CreateProjectInput } from '~/types/projects'

export function useProjectsFeature(orgId: MaybeRef<string>) {
  const store = useProjectsStore()
  const filters = useFilterPanel({ search: '', status: '' })

  // View state — el componente nunca lo calcula
  const viewState = computed((): AsyncViewState => {
    if (store.loading) return 'loading'
    if (store.error) return 'error'
    if (filteredItems.value.length === 0) return 'empty'
    return 'success'
  })

  // Datos procesados — listos para el template
  const filteredItems = computed(() =>
    store.items.filter((p) => {
      const matchesSearch = filters.search.value
        ? p.name.toLowerCase().includes(filters.search.value.toLowerCase())
        : true
      const matchesStatus = filters.status.value ? p.status === filters.status.value : true
      return matchesSearch && matchesStatus
    }),
  )

  // Lifecycle
  onMounted(() => store.fetchAll(toValue(orgId)))
  onUnmounted(() => store.resetState())

  return {
    // Estado
    viewState,
    items: filteredItems,
    selected: computed(() => store.selected),
    error: computed(() => store.error),
    // Filtros
    search: filters.search,
    status: filters.status,
    setSearch: (v: string) => {
      filters.search.value = v
    },
    setStatus: (v: string) => {
      filters.status.value = v
    },
    // Acciones
    create: (input: CreateProjectInput) => store.create(toValue(orgId), input),
    remove: store.remove,
    select: store.select,
  }
}
```

---

### `components/` — Pirámide de componentes

Nuxt auto-importa todo desde `components/`. La organización interna define la arquitectura.

```
ui/          ← shadcn-vue. No se modifica.
base/        ← Átomos de la marca. AppButton, AppBadge, AppAvatar.
common/      ← Moléculas sin dominio. EmptyState, ErrorState, DataTable.
patterns/    ← Organismos complejos sin dominio. ResourceCard, FormSection.
domain/      ← Componentes de dominio.
  [domain]/  ← Sin prescripción de subcarpetas.
```

**¿Domain feature-specific vs `domain/`?**

En Nuxt, todos los componentes viven en `components/`. La distinción se hace por convención:

- Componente usado solo por un feature → `components/domain/projects/`
- Componente compartido entre features → `components/domain/` (idem, pero documentado en el componente)

**`base/` — átomos de la marca**

```vue
<!-- components/base/AppButton.vue -->
<script setup lang="ts">
import { Button } from '~/components/ui/button'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const { variant = 'primary', size = 'md', loading = false } = defineProps<Props>()
</script>

<template>
  <Button :variant :size :disabled="loading">
    <span v-if="loading" class="spinner" />
    <slot />
  </Button>
</template>
```

**`common/` — moléculas sin dominio**

```vue
<!-- components/common/EmptyState.vue -->
<script setup lang="ts">
interface Props {
  title: string
  description?: string
}
defineProps<Props>()
const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div class="flex flex-col items-center gap-4 py-16 text-center">
    <slot name="icon" />
    <div>
      <p class="text-lg font-medium">{{ title }}</p>
      <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
    </div>
    <slot name="action" />
  </div>
</template>
```

**`domain/[domain]/` — componentes de negocio**

El componente raíz del feature (el que instancia el Feature Composable) vive acá.

```vue
<!-- components/domain/projects/ProjectsView.vue -->
<script setup lang="ts">
interface Props {
  orgId: string
}
const { orgId } = defineProps<Props>()

const feature = useProjectsFeature(orgId)
const modal = useDisclosure()
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <input
        type="search"
        :value="feature.search.value"
        placeholder="Buscar proyectos..."
        @input="(e) => feature.setSearch((e.target as HTMLInputElement).value)"
        class="input"
      />
      <AppButton @click="modal.open">Nuevo proyecto</AppButton>
    </div>

    <ProjectsSkeleton v-if="feature.viewState.value === 'loading'" />

    <ErrorState
      v-else-if="feature.viewState.value === 'error'"
      :message="feature.error.value"
      @retry="store.fetchAll(orgId)"
    />

    <EmptyState
      v-else-if="feature.viewState.value === 'empty'"
      title="No hay proyectos"
      description="Crea el primero para comenzar"
    >
      <template #action>
        <AppButton @click="modal.open">Crear proyecto</AppButton>
      </template>
    </EmptyState>

    <div v-else class="grid grid-cols-3 gap-4">
      <ProjectCard
        v-for="project in feature.items.value"
        :key="project.id"
        :project
        @select="feature.select(project.id)"
        @delete="feature.remove(project.id)"
      />
    </div>
  </div>

  <CreateProjectModal
    v-if="modal.isOpen.value"
    @close="modal.close"
    @create="
      async (input) => {
        await feature.create(input)
        modal.close()
      }
    "
  />
</template>
```

---

### `pages/` — Thin pages

Las páginas son wrappers. Sin lógica, sin stores, sin cálculos.

```vue
<!-- pages/(app)/projects/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const route = useRoute()
const org = useOrgStore()
</script>

<template>
  <ProjectsView :org-id="org.current.id" />
</template>
```

**Regla absoluta:** Si una página supera 20 líneas, algo está mal. El componente View falta o no se usa.

---

### `middleware/auth.global.ts` — Auth guard global

Un solo lugar para la lógica de autenticación. No hay guards inline en páginas.

```typescript
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const publicRoutes = ['/login', '/register', '/verify']
  if (publicRoutes.some((r) => to.path.startsWith(r))) return

  const auth = useAuthStore()

  if (auth.status === 'loading') return

  if (auth.status !== 'authenticated') {
    return navigateTo({ path: '/login', query: { next: to.fullPath } })
  }
})
```

---

## Patrones clave

### `useDisclosure` — reemplaza `isXxxOpen = ref(false)`

```typescript
// composables/common/useDisclosure.ts
export function useDisclosure(initial = false) {
  const isOpen = ref(initial)

  return {
    isOpen: readonly(isOpen),
    open: () => {
      isOpen.value = true
    },
    close: () => {
      isOpen.value = false
    },
    toggle: () => {
      isOpen.value = !isOpen.value
    },
  }
}
```

Uso:

```typescript
const modal = useDisclosure()
const dropdown = useDisclosure()
const sidebar = useDisclosure(true)

// En template
modal.isOpen.value
modal.open()
```

---

### `useFilterPanel` — reemplaza N refs de filtros paralelos

```typescript
// composables/common/useFilterPanel.ts
export function useFilterPanel<T extends Record<string, unknown>>(initial: T) {
  const filters = reactive({ ...initial }) as T

  const hasActiveFilters = computed(() =>
    Object.values(filters).some((v) => v !== '' && v !== null && v !== undefined),
  )

  function reset() {
    Object.assign(filters, initial)
  }

  const panel = useDisclosure()

  return {
    filters,
    hasActiveFilters,
    reset,
    ...panel,
  }
}
```

Uso:

```typescript
const filterPanel = useFilterPanel({
  search: '',
  status: '',
  from: null as Date | null,
  to: null as Date | null,
})

// En template
filterPanel.filters.status = 'active'
filterPanel.hasActiveFilters.value
filterPanel.reset()
```

---

### `useAsyncState` — wrapper tipado para operaciones async puntuales

Para operaciones únicas (no fetch de listas), sin necesidad de un store completo.

```typescript
// composables/common/useAsyncState.ts
import { withLoading } from '~/lib/helpers/loading'
import type { AsyncViewState } from '~/types/ui/view-state'

export function useAsyncState<T>(action: () => Promise<T>) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const viewState = computed((): AsyncViewState => {
    if (loading.value) return 'loading'
    if (error.value) return 'error'
    if (!data.value) return 'idle'
    return 'success'
  })

  async function execute() {
    await withLoading({ loading: loading.value, error: error.value } as any, async () => {
      data.value = await action()
    })
  }

  return { data: readonly(data), viewState, error: readonly(error), execute }
}
```

---

### Formularios con VeeValidate + Zod

El patrón estándar desde el día 1. No hay validación manual con `if (value.length < 3)`.

```typescript
// Siempre: schema en archivo separado o al inicio del script
const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  description: z.string().optional(),
  status: z.enum(['active', 'draft']),
})

type FormValues = z.infer<typeof schema>
```

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

const emit = defineEmits<{ submit: [values: FormValues]; cancel: [] }>()

const { handleSubmit, errors, isSubmitting } = useForm<FormValues>({
  validationSchema: toTypedSchema(schema),
  initialValues: { status: 'draft' },
})

const onSubmit = handleSubmit(async (values) => {
  emit('submit', values)
})
</script>

<template>
  <form @submit="onSubmit">
    <Field name="name" v-slot="{ field, errorMessage }">
      <AppInput v-bind="field" :error="errorMessage" label="Nombre" />
    </Field>
    <AppButton type="submit" :loading="isSubmitting">Guardar</AppButton>
  </form>
</template>
```

---

### Multi-tenancy con composable compartido

La organización activa vive en un store, no en un contexto. El store se inicializa en el layout.

```typescript
// stores/org/useOrgStore.ts
export const useOrgStore = defineStore('org', {
  state: () => ({
    current: null as Organization | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchCurrent() {
      const { $api } = useNuxtApp()
      await withLoading(this, async () => {
        this.current = await $api<Organization>('/orgs/current')
      })
    },
    resetState() {
      this.current = null
      this.loading = false
      this.error = null
    },
  },
})
```

```vue
<!-- layouts/default.vue -->
<script setup lang="ts">
const org = useOrgStore()
const auth = useAuthStore()

onMounted(() => org.fetchCurrent())
</script>
```

---

## Fundaciones críticas — obligatorias antes del primer feature

Estas piezas no se crean "cuando se necesiten". Se crean en el commit inicial del proyecto.

### 1. ESLint: `no-console` enforced

```javascript
// eslint.config.mjs
export default [
  {
    rules: {
      'no-console': ['error', { allow: [] }],
      // Solo lib/helpers/logger.ts tiene permiso
    },
  },
  {
    files: ['lib/helpers/logger.ts'],
    rules: { 'no-console': 'off' },
  },
]
```

Sin esta regla, `console.log` de debug llega a producción. Pasó en el proyecto auditado.

### 2. Pre-commit: ESLint + Prettier + commitlint

```json
// package.json
{
  "lint-staged": {
    "*.{ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  },
  "commitlint": {
    "extends": ["@commitlint/config-conventional"]
  }
}
```

```bash
# Setup inicial
bun add -D lint-staged husky @commitlint/cli @commitlint/config-conventional
bunx husky install
bunx husky add .husky/pre-commit "bunx lint-staged"
bunx husky add .husky/commit-msg "bunx commitlint --edit"
```

Commits válidos: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`.

### 3. Vitest: setup con ejemplo canónico

```typescript
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
  },
})
```

Estructura de tests (co-located):

```
utils/
  number.ts
  number.test.ts       ← tests junto al archivo
stores/
  projects/
    useProjectsStore.ts
    useProjectsStore.test.ts
```

Primer test que debe existir (valida que los formatters son correctos):

```typescript
// utils/number.test.ts
import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercent } from './number'

describe('formatCurrency', () => {
  it('formatea en COP por defecto', () => {
    expect(formatCurrency(1000)).toBe('$ 1.000')
  })
  it('acepta currency alternativo', () => {
    expect(formatCurrency(1000, { currency: 'USD' })).toContain('1.000')
  })
})

describe('formatPercent', () => {
  it('formatea porcentaje correctamente', () => {
    expect(formatPercent(75.5)).toBe('75,5 %')
  })
})
```

### 4. Variables de entorno: validadas al inicio

```typescript
// nuxt.config.ts
import { z } from 'zod'

// Valida antes de arrancar — falla rápido con mensaje claro
const envSchema = z.object({
  API_BASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
})

const env = envSchema.safeParse(process.env)
if (!env.success) {
  console.error('Variables de entorno inválidas:', env.error.flatten())
  process.exit(1)
}

export default defineNuxtConfig({
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    stripeKey: process.env.STRIPE_SECRET_KEY,
    public: {
      apiBase: process.env.API_BASE_URL,
    },
  },
})
```

### 5. CLAUDE.md — convenciones escritas y obligatorias

```markdown
# CLAUDE.md

## Convenciones obligatorias

### Errores

SIEMPRE usar `parseApiError(err)` de `~/lib/helpers/error.ts`.
NUNCA: `err.message`, `err.data.detail`, strings hardcodeados en catch.

### Loading state

SIEMPRE usar `withLoading(this, action)` de `~/lib/helpers/loading.ts`.
NUNCA: `this.loading = true` / `try` / `finally` manual.

### Logging

SIEMPRE usar `$logger` (plugin) o el logger de `~/lib/helpers/logger.ts`.
NUNCA: `console.log`, `console.error`, `console.warn`.

### Formatters

SIEMPRE usar utils de `~/utils/number.ts` y `~/utils/date.ts`.
NUNCA: `new Intl.NumberFormat(...)` inline en componentes.

### Formularios

SIEMPRE: `useForm + toTypedSchema(zodSchema)` de VeeValidate.
NUNCA: validación manual con `if (value.length < 3)`.

### Stores

Usar SOLO Options API. Siempre incluir `resetState()`.
El feature composable llama `resetState()` en `onUnmounted`.

### TypeScript

NUNCA: `as any`, `useNuxtApp() as any`.
Augmentar plugins en `types/nuxt-app.d.ts`.
```

---

## Reglas de importación

```
pages/
  → importa componentes de domain/ (el componente View del dominio)
  → NO importa stores directamente
  → NO importa feature composables directamente (el View lo hace)

components/domain/[domain]/
  → importa desde composables/features/[domain]/ (su feature composable)
  → importa desde components/base/, common/, patterns/
  → NO importa stores directamente
  → NO importa desde domain/ de otros dominios

composables/features/[domain]/
  → importa desde stores/[domain]/ (sus propios stores)
  → importa desde composables/common/ (useDisclosure, useFilterPanel)
  → importa desde config/domain/ y types/
  → NO importa componentes
  → NO hace fetch directo ($api)

composables/features/auth/
  → importa desde config/domain/ (PERMISSION_GROUPS, PLAN_FEATURES)
  → importa desde types/
  → NO importa desde lib/ (no es infraestructura)

stores/[domain]/
  → importa desde lib/helpers/ (withLoading, parseApiError)
  → importa desde types/
  → usa $api via useNuxtApp()
  → NO importa desde composables/features/ ni components/

utils/
  → funciones puras, sin imports de otras capas del proyecto

lib/
  → solo TypeScript y dependencias externas, sin imports del proyecto
  → NO importa desde composables/, components/, stores/, config/

config/domain/
  → solo imports de types/
  → NO contiene funciones ni lógica

server/
  → solo importa desde types/ y lib/
  → NUNCA importado desde el cliente
```

---

## Convenciones de naming

| Elemento                       | Convención               | Ejemplo                                   |
| ------------------------------ | ------------------------ | ----------------------------------------- |
| Archivos de componente         | PascalCase               | `ProjectCard.vue`                         |
| Archivos de store              | camelCase, prefijo `use` | `useProjectsStore.ts`                     |
| Archivos de feature composable | camelCase, prefijo `use` | `useProjectsFeature.ts`                   |
| Archivos de utils              | kebab-case               | `number.ts`, `date.ts`                    |
| Factory de store               | `use[X]Store`            | `useProjectsStore`                        |
| Factory de feature             | `use[X]Feature`          | `useProjectsFeature`                      |
| Composables genéricos          | `use[X]`                 | `useDisclosure`, `useFilterPanel`         |
| Constantes de config           | SCREAMING_SNAKE_CASE     | `PERMISSION_GROUPS`                       |
| Tipos e interfaces             | PascalCase               | `Project`, `Organization`                 |
| Enums                          | PascalCase               | `UserRole`, `ProjectStatus`               |
| Props                          | camelCase                | `orgId`, `initialData`                    |
| Emits                          | kebab-case               | `@update:modelValue`, `@close`, `@create` |
| IDs de Pinia store             | kebab-case               | `'projects'`, `'auth'`, `'org'`           |

---

## Anti-patrones a evitar

**❌ parseApiError personalizado en cada store**

```typescript
// MAL — 4 implementaciones distintas en el proyecto auditado
catch (err: any) {
    this.error = err.data?.detail || err.message || 'Error desconocido'
}
```

**✅ Un solo lugar**

```typescript
import { parseApiError } from '~/lib/helpers/error'
catch (err) {
    this.error = parseApiError(err)
}
```

---

**❌ `useNuxtApp() as any`**

```typescript
// MAL — 60+ ocurrencias en el proyecto auditado
const { $api } = useNuxtApp() as any
```

**✅ Augmentación tipada en `types/nuxt-app.d.ts`**

```typescript
const { $api } = useNuxtApp() // TypeScript conoce $api
```

---

**❌ formatCurrency inline**

```typescript
// MAL — 51 implementaciones locales en el proyecto auditado
new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value)
```

**✅ El util canónico**

```typescript
formatCurrency(value) // auto-importado desde utils/number.ts
```

---

**❌ Stores sin `resetState()`**

```typescript
// MAL — el estado queda "sucio" entre navegaciones
const useProjectsStore = defineStore('projects', { ... })
// No hay manera de limpiar el estado al salir de la ruta
```

**✅ Siempre presente, siempre llamado en onUnmounted del feature**

```typescript
onUnmounted(() => store.resetState())
```

---

**❌ Importar stores en componentes**

```vue
<!-- MAL — el componente conoce la implementación -->
<script setup>
const store = useProjectsStore()
const items = computed(() => store.items.filter(...))
</script>
```

**✅ El feature composable encapsula todo**

```vue
<script setup>
const feature = useProjectsFeature(orgId)
// feature.items ya viene filtrado y procesado
</script>
```

---

**❌ Lógica en páginas**

```vue
<!-- MAL — la página sabe demasiado -->
<script setup>
const store = useProjectsStore()
onMounted(() => store.fetchAll(route.params.orgId))
</script>
```

**✅ La página solo monta el View**

```vue
<script setup>
definePageMeta({ layout: 'default', middleware: ['auth'] })
const org = useOrgStore()
</script>
<template>
  <ProjectsView :org-id="org.current.id" />
</template>
```

---

**❌ `console.log` en código de producción**

```typescript
// MAL — 393 ocurrencias en el proyecto auditado
console.log('✅ Conectado con...')
console.error('Error fetching data:', err)
```

**✅ Logger estructurado**

```typescript
const { $logger } = useNuxtApp()
$logger.info('Conectado', { service: 'helios' })
$logger.error('Error fetching data', { err: parseApiError(err) })
```

---

**❌ Múltiples booleans de estado**

```typescript
// MAL — pueden ser true simultáneamente
const isLoading = ref(false)
const hasError = ref(false)
const isEmpty = ref(false)
```

**✅ AsyncViewState: estado único y exclusivo**

```typescript
const viewState = computed((): AsyncViewState => {
  if (store.loading) return 'loading'
  if (store.error) return 'error'
  if (!store.items.length) return 'empty'
  return 'success'
})
```

---

**❌ Validación de formularios manual**

```vue
<!-- MAL — 423 validaciones inline en el proyecto auditado -->
<script setup>
function validate() {
  if (!name.value || name.value.length < 2) {
    error.value = 'Mínimo 2 caracteres'
    return false
  }
  return true
}
</script>
```

**✅ VeeValidate + Zod desde el día 1**

```typescript
const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(schema),
})
```
