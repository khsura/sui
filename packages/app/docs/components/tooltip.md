# STooltip

**Import:** `import { STooltip } from '@khsura/sui'`

Floating label shown on hover over an activator element.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `location` | `string` | `'bottom'` | Position relative to activator: `'top'`, `'bottom'`, `'left'`, `'right'` |
| `color` | `string` | `undefined` | Tooltip background color |
| `opacity` | `number \| string` | `undefined` | Background opacity |
| `offsetX` | `number \| null` | `null` | Horizontal offset (px) |
| `offsetY` | `number \| null` | `null` | Vertical offset (px) |
| `disabled` | `boolean` | `false` | Disable tooltip |
| `width` / `height` | `string \| number` | `undefined` | Tooltip dimensions |
| `maxWidth` / `maxHeight` | `string \| number` | `undefined` | Max dimensions |

## Model

`v-model` — `boolean` to programmatically show/hide.

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `activator` | `{ on, attrs }` | The element that triggers the tooltip on hover |
| `default` | — | Tooltip content (text or HTML) |

## Events

None.

## Usage

```vue
<!-- Basic tooltip -->
<STooltip location="top">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs" variant="icon">
      <SIcon icon="mdi-information" />
    </SButton>
  </template>
  More information about this feature
</STooltip>

<!-- Colored tooltip -->
<STooltip color="primary" location="right">
  <template #activator="{ on, attrs }">
    <SIcon icon="mdi-help-circle" v-on="on" v-bind="attrs" />
  </template>
  Help text here
</STooltip>

<!-- On a text element -->
<STooltip location="bottom">
  <template #activator="{ on, attrs }">
    <span v-on="on" v-bind="attrs">Hover me</span>
  </template>
  Tooltip content
</STooltip>

<!-- Controlled visibility -->
<STooltip v-model="showTip" location="top">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Action</SButton>
  </template>
  Tooltip
</STooltip>
```

## Notes

- Always bind both `v-on="on"` and `v-bind="attrs"` to the activator element.
- Tooltip inherits `SMenu` props since it extends the menu positioning system.
- For icon buttons, prefer wrapping the `SButton` with `variant="icon"` rather than a raw element.
