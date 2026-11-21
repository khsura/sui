# STooltip

**Import:** `import { STooltip } from '@khsura/sui'`

Small floating label shown while hovering an activator. Built on the `SMenu` positioning system (content centered on the activator, 8px gap).

Types: `node_modules/@khsura/sui/@types/definitions/props/propsTooltip.d.ts`

<!-- generated:api:start STooltip -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**STooltip props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activator` | `string \| HTMLElement \| ComponentPublicInstance \| null` | — | no | — |
| `closeOnClick` | `boolean` | — | no | — |
| `closeOnContentClick` | `boolean` | — | no | — |
| `closeOnScroll` | `boolean` | — | no | — |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `contentClass` | `string \| string[] \| Record<string, boolean>` | — | no | — |
| `contentStyle` | `StyleValue` | — | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `height` | `string \| number \| null` | — | no | — |
| `location` | `LocationRaw` | — | no | — |
| `maxHeight` | `string \| number \| null` | — | no | — |
| `maxWidth` | `string \| number \| null` | — | no | — |
| `minHeight` | `string \| number \| null` | — | no | — |
| `minWidth` | `string \| number \| null` | — | no | — |
| `modelValue` | `boolean` | — | no | — |
| `offsetX` | `number \| null` | — | no | — |
| `offsetY` | `number \| null` | — | no | — |
| `opacity` | `string \| number` | — | no | — |
| `position` | `Position` | — | no | `absolute`, `fixed`, `relative`, `static`, `sticky` |
| `preventCloseOnClick` | `boolean` | — | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `screenPadding` | `number \| null` | — | no | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |
| `width` | `string \| number \| null` | — | no | — |

**STooltip slots**

| Slot | Slot props |
| --- | --- |
| `activator` | `{}` |
| `default` | `{}` |

**STooltip events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: boolean \| undefined]` |

<!-- generated:api:end STooltip -->

**STooltip notes**

- `location`: `'top'`, `'bottom'`, `'left'`, `'right'`. **Unset = overlaps the activator** — always pass one
- `color`: Background. Use a CSS color (`'#333'`, `'rgb(...)'`); preset names are hidden by the default translucent background
- `offsetX` / `offsetY`: Extra offset in px
- `position`: `'fixed'` = viewport-relative positioning
- `width` / `height` / `min*` / `max*`: Tooltip dimensions
- `activator` (slot): Hover target. STooltip wraps it in its own `<div>` that carries the hover/click listeners — do not bind anything
- `default` (slot): Tooltip content

Other `SMenu` props are accepted by the types but are not meaningful for a tooltip.

## Model

`v-model: boolean` — optional; set by hover (and toggled by clicking the activator).

## Usage

```vue
<STooltip location="top">
  <template #activator>
    <SButton variant="icon"><SIcon icon="mdi-information" /></SButton>
  </template>
  More information
</STooltip>

<STooltip location="right" color="#1e293b">
  <template #activator>
    <span>Hover me</span>
  </template>
  Help text
</STooltip>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `#activator="{ on, attrs }"` + `v-on="on"` | `#activator` with no scope — `on`/`attrs` are undefined here (unlike SMenu/SDialog) |
| `<STooltip>` without `location` | `location="top"` (or bottom/left/right) |
| `color="primary"` | A CSS color, e.g. `color="#1e293b"` |
| `disabled` to suppress the tooltip | Not supported — hover still opens it; use `v-if` on the tooltip |

- The activator wrapper is a block `<div>`; wrap inline text if layout matters.
- Long text wraps at 320px (less on narrow screens), and the tooltip flips or shifts to stay 8px inside the viewport.
- The app must be wrapped in `<SApp>` (tooltips teleport into its overlay container).
- `opacity` appears in the prop types but has no effect.
