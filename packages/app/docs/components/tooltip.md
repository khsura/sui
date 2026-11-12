# STooltip

**Import:** `import { STooltip } from '@khsura/sui'`

Floating label shown on hover over an activator element. Built on the `SMenu` positioning system (content centered on the activator, 8px gap).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `location` | `string \| string[]` | `undefined` | Position relative to activator: `'top'`, `'bottom'`, `'left'`, `'right'`. **Unset = overlaps the activator** — always pass one |
| `color` | `string` | `undefined` | Tooltip background. Use a CSS color (`'#1e293b'`, `'rgb(...)'`); a preset name (e.g. `'primary'`) is hidden by the default translucent background |
| `opacity` | `number \| string` | `undefined` | Declared in the type but has no effect |
| `offsetX` | `number \| null` | `undefined` | Extra horizontal offset (px) |
| `offsetY` | `number \| null` | `undefined` | Extra vertical offset (px) |
| `position` | `'fixed' \| ...` | `undefined` | `'fixed'` = viewport-relative positioning |
| `disabled` | `boolean` | `false` | Does **not** suppress the tooltip (hover still opens it) — use `v-if` instead |
| `width` / `height` | `string \| number` | `undefined` | Tooltip dimensions |
| `maxWidth` / `maxHeight` | `string \| number` | `undefined` | Max dimensions |

Other `SMenu` props are accepted by the type but are not meaningful for a tooltip.

## Model

`v-model` — `boolean`, optional. Set by hovering (and toggled by clicking the activator); can also be set programmatically.

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `activator` | **none** | The hover target. STooltip wraps it in its own `<div>` that carries the hover/click listeners — do not bind `on`/`attrs` (they are undefined here, unlike SMenu/SDialog) |
| `default` | — | Tooltip content |

## Events

None.

## Usage

```vue
<!-- Basic tooltip -->
<STooltip location="top">
  <template #activator>
    <SButton variant="icon">
      <SIcon icon="mdi-information" />
    </SButton>
  </template>
  More information about this feature
</STooltip>

<!-- Colored tooltip (CSS color) -->
<STooltip color="#1e293b" location="right">
  <template #activator>
    <SIcon icon="mdi-help-circle" />
  </template>
  Help text here
</STooltip>

<!-- On a text element -->
<STooltip location="bottom">
  <template #activator>
    <span>Hover me</span>
  </template>
  Tooltip content
</STooltip>

<!-- Controlled visibility -->
<STooltip v-model="showTip" location="top">
  <template #activator>
    <SButton>Action</SButton>
  </template>
  Tooltip
</STooltip>
```

## Notes

- Unlike `SMenu`/`SDialog`, the activator slot passes no `on`/`attrs` — just put the element in `#activator`.
- Always set `location`; without it the tooltip covers its activator.
- The activator wrapper is a block `<div>`; wrap inline text if layout matters.
- The app must be wrapped in `<SApp>` (tooltips teleport into its overlay container).
