# Gandalf UI

> **⚠️ Si esta carpeta no tiene componentes, Gandalf todavía no está en este
> proyecto. No es un bug ni algo roto.** El template trae la estructura y las
> convenciones, no una copia embebida del sistema de diseño. Mientras esté vacía,
> ignora todo lo que dice este documento y compón directamente sobre `ui/`
> (shadcn-vue). Nada del template depende de que Gandalf esté presente.

El sistema de diseño de Unergy, montado sobre shadcn/ui (que a su vez envuelve
Reka UI). No es una librería que se reinventa: es la capa que le da a todos los
proyectos los mismos colores semánticos, las mismas variantes y las mismas
primitivas componibles.

Esta carpeta se llena copiando Gandalf desde su fuente, no escribiéndolo a mano.
`prettier` y `eslint` la ignoran a propósito, igual que a `ui/`: es código
vendido, y formatearlo o lintarlo aquí sería pelearse con la siguiente
sincronización. Su higiene interna la verifica el repo de Gandalf.

## `base/` — atómicos

Componentes `G<Nombre>` que envuelven una primitiva de `ui/`. Cada uno:

- **Genérico** — no conoce el dominio de Unergy (nada de `Factura`, `Cliente`).
- **Una sola responsabilidad.**
- **Componible** — slots antes que layouts rígidos.
- **Variantes con CVA**, exportadas desde el `index.ts` de su carpeta.
- **Envuelve `@/components/ui/<nombre>`, nunca `reka-ui` directamente.** `ui/` es
  la única capa que habla con Reka UI, así que un cambio interno de shadcn se
  absorbe en un solo sitio. (`import type { XProps } from 'reka-ui'` sí vale: un
  tipo no arrastra la librería al bundle.)
- **API-compatible con su equivalente de shadcn**: acepta las mismas props,
  slots y eventos, más las de Gandalf (`variant`, `size`, `color`). Cambiar un
  import de `ui/` por el de Gandalf no obliga a tocar el uso.

```
base/<componente>/
  G<Componente>.vue
  index.ts          → export { default as G… } + los variants de CVA
```

## `kit/` — compuestos

Patrones que combinan varios `base/` en una unidad opinada — un checkbox dentro
de una card, un field con validación ya cableada. Solo importan de `base/`,
nunca de `ui/`, y siguen siendo genéricos.

## Al agregar un componente

1. `base/<componente>/G<Componente>.vue` + `index.ts`.
2. Envolver la primitiva de `@/components/ui/`, nunca `reka-ui`.
3. Variantes con `cva` en el `index.ts`, más el tipo `VariantProps`.
4. `reactiveOmit(props, 'class', 'variant', …)` **antes** de `v-bind`, para que
   las props de Gandalf no se filtren al elemento HTML.
5. `v-model` en todo lo seleccionable (`modelValue` + `update:modelValue`), más
   un evento `select` con el objeto completo cuando haga falta metadata.
6. Estado compartido entre padre e hijos de un compound component vía
   `provide`/`inject` — ver `GTabsList` → `GTabsTrigger` como referencia.
7. Página de doc en `content/docs/<componente>.md` y entrada en la tabla de
   `content/docs/index.md`.

El tipo que hablan los componentes seleccionables (`GDropdown`, `GCombobox`)
llega con Gandalf:

```ts
type Option = {
  label: string
  value: string | number
  disabled?: boolean
  color?: `#${string}` // hex only, enforced by the type
}
```
