# STooltip

**Import:** `import { STooltip } from '@khsura/sui'`

Small floating label shown while hovering an activator. Built on the `SMenu` positioning system (content centered on the activator, 8px gap).

Types: `node_modules/@khsura/sui/@types/definitions/props/propsTooltip.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `location` | `string \| string[]` | `undefined` | `'top'`, `'bottom'`, `'left'`, `'right'`. **Unset = overlaps the activator** — always pass one |
| `color` | `string` | `undefined` | Background. Use a CSS color (`'#333'`, `'rgb(...)'`); preset names are hidden by the default translucent background |
| `offsetX` / `offsetY` | `number \| null` | `undefined` | Extra offset in px |
| `position` | `'fixed' \| ...` | `undefined` | `'fixed'` = viewport-relative positioning |
| `width` / `height` / `min*` / `max*` | `string \| number` | `undefined` | Tooltip dimensions |

Other `SMenu` props are accepted by the types but are not meaningful for a tooltip.

## Model

`v-model: boolean` — optional; set by hover (and toggled by clicking the activator).

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `activator` | **none** | Hover target. STooltip wraps it in its own `<div>` that carries the hover/click listeners — do not bind anything |
| `default` | — | Tooltip content |

## Events

None.

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
- The app must be wrapped in `<SApp>` (tooltips teleport into its overlay container).
- `opacity` appears in the prop types but has no effect.
