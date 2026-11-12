# SAlert

**Import:** `import { SAlert } from '@khsura/sui'`

Simple colored message box (flex row, vertically centered, rounded). It has no icon, title, type or dismiss button — compose those yourself in the slot.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsAlert.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Preset name or CSS color (default background = theme `card` color) |
| `colorThreshold` | `number` | `undefined` | Luminance threshold for automatic light/dark text |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `'default'` | Padding, font size and min-height |
| `dense` | `boolean` | `false` | Smaller padding and min-height |
| `minHeight` | `number` | computed from `size` | Min height in px |
| `fixedHeight` | `boolean` | `false` | `height: 100%; overflow: hidden`, and render even when empty (reserves space) |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Alert content. **If empty, nothing is rendered** (unless `fixedHeight`) |

## Events

None.

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
