# SProgressLinear / SProgressCircular

**Import:** `import { SProgressLinear, SProgressCircular } from '@khsura/sui'`

Types: `node_modules/@khsura/sui/@types/definitions/props/propsProgressLinear.d.ts`, `propsProgressCircular.d.ts`

---

## SProgressLinear

Horizontal progress bar.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| string` | `0` | Progress 0–100 |
| `indeterminate` | `boolean` | `false` | Animated, unknown duration |
| `color` | `string` | `'info'` | Bar color (preset name or CSS color) |
| `backgroundColor` | `string \| null` | `undefined` | Track color. Falls back to `color` |
| `backgroundOpacity` | `string \| number \| null` | `undefined` | Track opacity |
| `size` | `string \| number \| null` | `undefined` | Bar height (number = px) |
| `position` | `'static' \| 'fixed' \| 'absolute' \| 'relative' \| 'sticky'` | `undefined` | Only `fixed` and `absolute` add positioning styles |

| Slot | Description |
|------|-------------|
| `default` | Rendered inside the bar container (e.g. a label) |

No events.

---

## SProgressCircular

Circular progress / spinner.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Progress 0–100 (clamped) |
| `indeterminate` | `boolean` | `false` | Spinning state |
| `color` | `string \| null` | `undefined` | Arc color (text-color based, inherits `currentColor`) |
| `size` | `number \| string` | `32` | Diameter in px. Must be numeric (`'2rem'` breaks) |
| `width` | `number` | `4` | Stroke width in px |
| `rotate` | `number` | `undefined` | Starting angle offset in degrees |
| `theme` | `AppThemeType` | `undefined` | Theme override |

| Slot | Description |
|------|-------------|
| `default` | Content centered in the circle |

No events.

---

## Usage

```vue
<template>
  <SProgressLinear :value="uploadProgress" color="primary" />
  <SProgressLinear indeterminate color="primary" />
  <SProgressLinear :value="50" :size="8" color="primary" background-color="primary" :background-opacity="0.2" />

  <!-- Page-level loader -->
  <SProgressLinear v-if="isLoading" indeterminate color="primary" position="fixed" style="top: 0; z-index: 9999" />

  <SProgressCircular indeterminate color="primary" />
  <SProgressCircular :value="75" :size="100" :width="8" color="primary">75%</SProgressCircular>
  <SProgressCircular indeterminate :size="20" color="primary" />

  <!-- Loading button: prefer the built-in prop -->
  <SButton :loading="isSaving" color="primary">Save</SButton>
</template>
```

## Gotchas

- ✅ Use `SButton`'s `loading` prop instead of putting a spinner inside a button by hand.
- ❌ `<SProgressCircular size="2rem">` → ✅ `:size="32"` (px number).
- `SProgressLinear` defaults to `color="info"`, not primary.
- `SProgressCircular` always reports `aria-valuenow="60"`. If accessibility matters, set your own `aria-valuenow`.
