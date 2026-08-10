# Componentes

Cinco capas, de menos a más conocimiento del dominio. Un componente solo puede
saber lo que sabe su capa o una más abajo.

- **`ui/`** — primitivas de shadcn-vue, tal cual las genera el CLI. **Intocables**:
  no se editan ni se extienden (están fuera de `prettier`/`eslint` porque el CLI
  las sobreescribe). Es la única capa que habla con Reka UI. ¿Necesitas una
  variante? Se envuelve en `gandalf/base/`. Se agregan con
  `bunx shadcn-vue@latest add <componente>`.
- **`gandalf/base/`** — los átomos del sistema de diseño: `GBadge`, `GTabs`,
  `GField`… Envuelven una primitiva de `ui/` y le suman los colores semánticos y
  las variantes de Unergy, manteniendo la API de shadcn. Genéricos.
- **`gandalf/kit/`** — compuestos desde `base/`: un checkbox dentro de una card,
  un field con validación cableada. Nunca importan de `ui/`. Genéricos.
- **`blocks/`** — composiciones a nivel de app, sin lógica de negocio:
  `PageHeader`, `EmptyState`, `CardIcon` y `AsyncView` (los cuatro estados de un
  `useQuery`). Crea uno **solo cuando la misma composición se repite 3 veces** y
  un slot no alcanza; si el slot resuelve, usa el slot.
- **`layout/`** — el shell: `AppSidebar`, `NavMain`, `NavUser`, `SiteHeader`. Solo
  los usan los layouts, nunca una página. El sidebar lee `useAuth()` para
  esconder links, pero esconder un link no es control de acceso: eso lo hace el
  middleware.

Las cinco se auto-importan: se usan sin importar nada.

> **Si `gandalf/` no tiene componentes, Gandalf no está en este proyecto todavía
> — no es un bug.** El template trae la estructura, no una copia del sistema de
> diseño. Mientras esté vacía, ignora las dos capas de Gandalf y compón sobre
> `ui/` directamente. Su guía está en [`gandalf/README.md`](./gandalf/README.md).

## Componentes de feature

Un componente que nombra una entidad del negocio no va aquí, va en su slice
(`app/features/auth/components/LoginForm.vue`) y se importa por ruta. Es el
único caso sin auto-import, y a propósito: el import deja visible que la pieza
pertenece a un slice y no es genérica.

**La regla para ubicar uno nuevo:** si nombra una entidad del negocio →
`features/`; si rodea a la página → `layout/`; si compone varios `G*` en un
patrón reutilizable → `blocks/`; si combina átomos del sistema de diseño →
`gandalf/kit/`; si envuelve una primitiva de `ui/` → `gandalf/base/`. Y antes de
crearlo, busca si ya existe: la tercera repetición justifica una abstracción, la
primera y la segunda no.

## Límites entre capas

Ninguno lo verifica una herramienta — son convenciones, y se sostienen en code
review:

- solo `ui/` habla con Reka UI; el resto usa `gandalf/` o `ui/`
- `gandalf/kit/` compone desde `gandalf/base/`, no desde `ui/`
- nada en `gandalf/` conoce el dominio; eso vive en `features/<slice>/components/`

`ui/` y `gandalf/` están fuera de `prettier` y `eslint` a propósito: son código
vendido y las herramientas los sobreescriben o los sincronizan.

## Fuera de aquí

Los componentes no llaman a la API ni guardan estado compartido. Piden datos a un
service (`~/features/<slice>/services/`, lo único que habla con la API), guardan el
resultado en un `useQuery` y lo pintan. El resto vive en `~/core/`, `~/config/`,
`~/composables/` y `~/utils/`.

Las reglas completas están en [`AGENTS.md`](../../AGENTS.md).
