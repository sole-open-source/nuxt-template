# Componentes

Cuatro capas, de menos a más conocimiento del dominio. Un componente solo puede
saber lo que sabe su capa o una más abajo.

- **`ui/`** — shadcn-vue, tal cual lo genera el CLI. **Intocable**: no se edita ni
  se extiende (está fuera de `prettier`/`eslint` porque el CLI lo sobreescribe).
  ¿Necesitas una variante? Se compone por fuera. Se agregan con
  `bunx shadcn-vue@latest add <componente>`.
- **`kit/`** — envoltorios propios sobre `ui/` que fijan una decisión repetida.
  `AppAvatar` siempre pone las iniciales como fallback.
- **`blocks/`** — piezas de página genéricas: `PageHeader`, `EmptyState`,
  `CardIcon` y `AsyncView` (los cuatro estados de un `useQuery`).
- **`layout/`** — el shell: `AppSidebar`, `NavMain`, `NavUser`, `SiteHeader`. Solo
  los usan los layouts, nunca una página. El sidebar lee `useAuth()` para esconder
  links, pero esconder un link no es control de acceso: eso lo hace el middleware.

Estos cuatro se auto-importan: se usan sin importar nada.

## Componentes de feature

Un componente que nombra una entidad del negocio no va aquí, va en su slice
(`app/features/users/components/UserFormDialog.vue`) y se importa por ruta. Es el
único caso sin auto-import, y a propósito: el import deja visible que la pieza
pertenece a un slice y no es genérica.

**La regla para ubicar uno nuevo:** si nombra una entidad del negocio → `features/`;
si rodea a la página → `layout/`; si envuelve un componente de `ui/` → `kit/`; si es
una sección de página → `blocks/`. Y antes de crearlo, busca si ya existe: la
tercera repetición justifica una abstracción, la primera y la segunda no.

## Fuera de aquí

Los componentes no llaman a la API ni guardan estado compartido. Piden datos a un
service (`~/features/<slice>/services/`, lo único que habla con la API), guardan el
resultado en un `useQuery` y lo pintan. El resto vive en `~/core/`, `~/config/`,
`~/composables/` y `~/utils/`.

Las reglas completas están en [`AGENTS.md`](../../AGENTS.md).
