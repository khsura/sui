# SAlert

**Import:** `import { SAlert } from '@khsura/sui'`

Simple colored message box (flex row, vertically centered, rounded). It has no icon, title, type or dismiss button — compose those yourself in the slot.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsAlert.d.ts`

<!-- generated:api:start SAlert -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SAlert props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `dense` | `boolean` | — | no | — |
| `fixedHeight` | `boolean` | — | no | — |
| `minHeight` | `number` | — | no | — |
| `size` | `SizePropertyType` | — | no | `default`, `extra`, `large`, `mini`, `small` |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |

**SAlert slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SAlert events**

None.

<!-- generated:api:end SAlert -->

**SAlert notes**

- `color`: Preset name or CSS color (default background = theme `card` color)
- `colorThreshold`: Luminance threshold for automatic light/dark text
- `size`: Padding, font size and min-height (default: `'default'`)
- `dense`: Smaller padding and min-height
- `minHeight`: Min height in px (default: computed from `size`)
- `fixedHeight`: `height: 100%; overflow: hidden`, and render even when empty (reserves space)
- `default` (slot): Alert content. **If empty, nothing is rendered** (unless `fixedHeight`)

## Usage

```vue
<SAlert color="error">Payment failed. Please try again.</SAlert>

<SAlert color="success" dense size="small">Saved</SAlert>

<!-- Icon + dismiss composed manually -->
<SAlert v-if="showWarning" color="warning">
  <SIcon icon="mdi-alert" />
  <span style="flex: 1">Your session expires soon.</span>
  <SButton variant="icon" @click="showWarning = false"><SIcon icon="mdi-close" /></SButton>
</SAlert>

<!-- Form error slot that keeps its height when there is no message -->
<SAlert color="error" fixed-height>{{ errorMessage }}</SAlert>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SAlert type="error" title="..." closable>` | Those props don't exist — use `color` and compose content in the slot |
| `<SAlert icon="mdi-alert">` | Nest `<SIcon>` in the slot (needs `@mdi/font` loaded) |
