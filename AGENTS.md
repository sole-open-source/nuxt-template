# AGENTS.md

Guía operativa para agentes de IA (y humanos) trabajando en este proyecto. Estas reglas son
obligatorias.

## Qué es este repo

Template de Nuxt 4 + Vue 3 para proyectos de consultoría. Consume una API externa (no tiene base
de datos) y trae resuelto lo aburrido: autenticación con cookies, permisos, layout con sidebar,
formularios, componentes. No es un framework y no debería convertirse en uno: el objetivo es que se
clone y se construya sin fricción ni sorpresas. Ver [`README.md`](./README.md) para el stack, la
estructura de carpetas y cómo arrancar.

## Documentación de arquitectura

No hay un `ARCHITECTURE.md` aparte. La fuente de verdad de la arquitectura es `app/` y `server/` —
ante una decisión estructural o una duda sobre un patrón, lee el código del área equivalente antes
de inventar uno nuevo.

## Proceso de trabajo

- Antes de escribir código: explora el repo, entiende la estructura de carpetas, las convenciones
  existentes y el código relacionado con la tarea.
- Busca implementaciones similares ya existentes y sigue el mismo patrón antes de inventar uno
  nuevo.
- Prioriza simplicidad y patrones ya establecidos por sobre soluciones rápidas o código "por
  cumplir".
- Ante ambigüedad entre dos enfoques válidos, elige el que ya predomina en el codebase; si el
  impacto es real y distinto entre ambos, pregunta en vez de asumir.
- No introduzcas dependencias nuevas sin necesidad clara; verifica primero si algo existente
  (`~/core`, `~/utils`, `~/composables`, `@vueuse/core`) resuelve el problema.
- No arrastres deuda entre tareas: deja `bun run lint`, `bun run typecheck` y `bun run test` en
  verde antes de dar algo por terminado.

## UI / Estilos

- **Tailwind siempre.** CSS custom solo si es estrictamente imposible con utilidades de Tailwind.
- **Si `app/components/gandalf/` no tiene componentes, Gandalf no está en este proyecto y todo lo
  que sigue sobre él no aplica — no es un bug ni algo pendiente de arreglar.** En ese caso compón
  directamente sobre `ui/` y sigue adelante.
- **Gandalf primero** (cuando está): si existe un componente del sistema de diseño aplicable
  (`GBadge`, `GTabs`, `GField`…), úsalo. Solo se baja a la primitiva de `ui/` cuando Gandalf todavía
  no la envuelve, y entonces lo correcto es agregar el wrapper a `gandalf/base/`.
- **shadcn después:** la primitiva se usa en su forma pura, sin modificarla ni agregarle clases
  extra salvo necesidad estricta.
- **Solo `ui/` habla con Reka UI.** Nada más importa `reka-ui` (los `import type` sí valen: un tipo
  no arrastra la librería al bundle).
- **`gandalf/` es genérico**, sin excepción: nada de `Factura`, `Cliente` ni ningún tipo del
  dominio. Eso vive en `features/<slice>/components/`.
- `app/components/gandalf/` es **intocable** por las mismas razones que `ui/`: es código vendido, lo
  sincroniza el sistema de diseño, y está fuera de `prettier`/`eslint`. Al agregar un `G*` se hace
  en el repo de Gandalf, no aquí. Convenciones en
  [`app/components/gandalf/README.md`](./app/components/gandalf/README.md).
- `app/components/ui/` (shadcn) es **intocable**: no editar, no extender, no borrar archivos ahí —
  está excluido de `prettier`/`eslint` a propósito. Compón variantes por fuera (wrappers, props,
  composición), nunca modificando la fuente. Para agregar componentes usa el CLI de shadcn-vue.
- Antes de crear un componente, lee [`app/components/README.md`](./app/components/README.md): explica
  las cuatro capas (`ui/`, `kit/`, `blocks/`, `layout/`), qué sabe cada una y cómo decidir en cuál va
  uno nuevo — o si en realidad pertenece a `features/<slice>/components/`.

## Arquitectura / Código

- **Services** son los únicos responsables de llamadas a la API desde el cliente. Nada de `$fetch`
  directo en componentes o composables. Un service extiende `BaseService` (`~/core/service.ts`) y
  vive en `features/<slice>/services/` — ver `features/auth/services/auth.ts` como referencia.
  Instáncialos dentro de `setup()` o de un composable, nunca a nivel de módulo.
- El servidor tiene su propia mitad: `server/utils/auth-api.ts` es el único que habla con la API de
  auth **y el único que conoce su forma**. Ahí viven las rutas, los tipos `External*` que viaja el
  cable y los mappers `toUser`/`toSession` que traducen a los tipos internos. Nada fuera de ese
  archivo ve un `access_token` ni un campo crudo del backend — apuntar el template a otra API es
  editar ese archivo y nada más. Nunca tipes una respuesta externa directamente como un tipo interno
  (`$fetch<User>(...)`): eso no valida, solo afirma, y un backend con otra forma compila igual y
  falla en runtime.
- **Composición sobre herencia** en componentes y composables: piezas pequeñas y componibles. La
  excepción deliberada es la jerarquía de services (`extends BaseService`), que existe para
  compartir la resolución de token/cliente API entre todos los services.
- **Prohibido magic strings:** usa constantes tipadas o `enum` para valores fijos, keys, rutas de
  API, estados. Para identidad de dominio con un conjunto cerrado de valores (`UserRole`), usa
  `enum`. Para tags de capacidad tipo `"recurso:acción"` (`Permission` en
  `~/config/permissions.ts`), un string-literal union con `as const satisfies` está bien — sigue el
  patrón que ya usa la pieza equivalente antes de introducir uno nuevo.

## Configuración

- Lo que cambia **una vez por proyecto** (branding, rutas de login) es un módulo plano:
  `app/config/app.ts`. Se puede importar desde cualquier lado, incluido Nitro.
- Lo que cambia **una vez por entorno** (URLs de API, flags de auth, opciones de cookie) vive en
  `runtimeConfig` (`nuxt.config.ts`) y se lee con `useRuntimeConfig()` — `useRuntimeConfig(event)`
  en el servidor. No metas en `.env` algo que nunca vas a cambiar entre entornos.

## Tipos

- **Nunca `any`**, sin excepciones (tampoco `as any` para esquivar un error de tipos). Si el tipo
  real es complejo o viene de una respuesta externa, revisa la fuente (`features/<slice>/types.ts`,
  `~/types/`) antes de tipar a mano. Si de verdad se desconoce la forma en tiempo de escritura, usa
  `unknown` y angosta el tipo antes de operar sobre él.
- Antes de crear un tipo nuevo, busca si ya existe uno equivalente en `~/types/` (compartido por más
  de un slice) o en `features/<slice>/types.ts` (propio de ese slice). Si algo parecido no es
  idéntico, verifica que sea el mismo concepto de dominio antes de reutilizarlo o fusionarlo.
- Si no existe un tipo adecuado, créalo donde corresponda según el punto anterior — nunca inline ni
  duplicado en el archivo que lo consume.

## Estado

- El estado reactivo compartido vive en composables dentro de `app/composables/` (`useAuth`,
  `useQuery`, `useDisclosure`, `useFilters`, `usePagination`). Antes de crear uno nuevo, evalúa si
  el estado es realmente compartido o si es local a un componente — en ese caso, un `ref` dentro del
  propio componente basta.
- **`ref` a nivel de módulo está prohibido para datos que dependan del usuario.** En SSR los módulos
  son singletons por proceso, no por request: un `ref` exportado con datos de usuario filtra datos
  entre usuarios — es la única de estas reglas cuya violación es un incidente de seguridad y no una
  molestia. El estado por request va en `useState`, en `event.context`, o en `provide/inject`. Si te
  encuentras escribiendo `if (import.meta.client)` alrededor de una mutación de estado global, esa
  no es una guarda: es la señal de que el estado está en el sitio equivocado.
- Los composables de estado no llaman a la API directamente: delegan en services.

## Permisos

Deny by default: rol desconocido → sin permisos, ruta no declarada → denegada. Un olvido debe
producir un 403, no un acceso. Al agregar una página o un permiso nuevo, decláralo explícitamente en
`~/config/permissions.ts` — no hay un valor "sin restricción" que puedas usar por descuido.

La decisión de página vive en `~/features/auth/access.ts` (pura) y la aplica
`app/middleware/auth.global.ts`, que corre tanto en SSR como en cada navegación del cliente. Los
endpoints se autorizan solos con `event.context.requirePermission(...)`, por método: leer una
colección y borrar de ella no son el mismo permiso. **Un handler nuevo bajo `server/api/` sin esa
llamada está abierto a cualquier sesión** — `server/api/endpoints.guard.test.ts` lo vuelve rojo.

## Convenciones de código

- Sigue el naming y la estructura de carpetas existentes (verifica antes de crear archivos).
- **Cero barrels propios:** nada de `index.ts` que reexporte (los de `components/ui/` son de shadcn
  y no cuentan). Importa por la ruta real con `~/…` (app) o `~~/…` (raíz del proyecto).
- **Auto-imports donde Nuxt los da:** `app/composables/`, `app/utils/`, los componentes de
  `components/{blocks,kit,layout}` y `components/ui/`, y los helpers de Nitro en `server/`. Todo lo
  demás — `core/`, `config/`, `features/`, `types/`, y nuestros propios `server/utils/` — se importa
  por ruta explícita: eso es lo que mantiene los tests corriendo fuera del build de Nuxt.
- Los componentes de feature (`app/features/<slice>/components/`) **no** se auto-importan a
  propósito: pertenecen a un slice, y importarlos por ruta es lo que lo deja visible en el call site.
- **Idiomático antes que ingenioso:** si Nuxt ya lo resuelve (`navigateTo`, `useState`, `useHead`,
  route middleware, `useRoute`), se usa eso. `watch`/`watchEffect` es para sincronizar con algo
  externo a Vue, nunca para comunicar componentes ni derivar valores — para eso está `computed`.
- Mantén los componentes enfocados: si uno crece en responsabilidades, extrae subcomponentes o
  composables. La lógica reutilizable vive en `app/composables/` o `app/utils/`, no duplicada en
  componentes.
- Si una función es pura y sin estado (formateo, validación, transformación) y es probable que se
  use en más de un lugar, extráela a `app/utils/`; si tiene estado/reactividad, a
  `app/composables/`. Antes de crear una nueva, revisa si ya existe algo equivalente ahí.
- **Cero exports sin consumidor, cero abstracciones "por si acaso":** la tercera repetición
  justifica una abstracción, la primera y la segunda no. Borrar es borrar — moverlo de carpeta o
  añadirle un test no lo convierte en usado.
- No dejes código muerto, comentarios de debug ni `console.log` en el código final.
- Los cambios deben ser mínimos y acotados a la tarea: no refactorices código no relacionado sin que
  se pida.

## Errores

Todo lo que se lanza o se atrapa pasa por `normalizeError` (`~/core/errors.ts`) y sale como
`AppError`. `error.message` siempre es seguro de mostrar. Los endpoints propios responden con el
cuerpo `{ status, message, payload? }` para que el cliente reciba un `AppError` tipado. Nada de
`console.error` suelto: `logger.error(scope, err)` es la única salida.

## Antes de dar algo por terminado

```sh
bun run lint       # sin errores
bun run typecheck  # cero errores
bun run test       # verde
```

Ejecútalos de verdad y lee la salida — no asumas que compiló.
