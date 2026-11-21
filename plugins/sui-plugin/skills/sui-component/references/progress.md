# SProgressLinear / SProgressCircular

**Import:** `import { SProgressLinear, SProgressCircular } from '@khsura/sui'`

Types: `node_modules/@khsura/sui/@types/definitions/props/propsProgressLinear.d.ts`, `propsProgressCircular.d.ts`

---

## SProgressLinear

Horizontal progress bar.

<!-- generated:api:start SProgressLinear -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SProgressLinear props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `"Loading"` | no | — | Accessible name of the progress bar. Defaults to `'Loading'`; name what is loading when you can. |
| `backgroundColor` | `string \| null` | — | no | — | — |
| `backgroundOpacity` | `string \| number \| null` | — | no | — | — |
| `color` | `string` | `"info"` | no | — | — |
| `indeterminate` | `boolean` | — | no | — | — |
| `position` | `Position` | — | no | `absolute`, `fixed`, `relative`, `static`, `sticky` | — |
| `size` | `string \| number \| null` | — | no | — | — |
| `value` | `string \| number` | `0` | no | — | — |

**SProgressLinear slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SProgressLinear events**

None.

<!-- generated:api:end SProgressLinear -->

**SProgressLinear notes**

- `value`: Progress 0–100
- `indeterminate`: Animated, unknown duration
- `color`: Bar color (preset name or CSS color)
- `backgroundColor`: Track color. Falls back to `color`
- `backgroundOpacity`: Track opacity
- `size`: Bar height (number = px)
- `position`: Only `fixed` and `absolute` add positioning styles
- `default` (slot): Rendered inside the bar container (e.g. a label)

No events.

---

## SProgressCircular

Circular progress / spinner.

<!-- generated:api:start SProgressCircular -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SProgressCircular props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `"Loading"` | no | — | Accessible name of the progress bar. Defaults to `'Loading'`; name what is loading when you can. |
| `color` | `string \| null` | — | no | — | — |
| `indeterminate` | `boolean` | — | no | — | — |
| `rotate` | `number` | — | no | — | — |
| `size` | `string \| number` | `32` | no | — | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` | — |
| `value` | `number` | `0` | no | — | — |
| `width` | `number` | `4` | no | — | — |

**SProgressCircular slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SProgressCircular events**

None.

<!-- generated:api:end SProgressCircular -->

**SProgressCircular notes**

- `value`: Progress 0–100 (clamped)
- `indeterminate`: Spinning state
- `color`: Arc color (text-color based, inherits `currentColor`)
- `size`: Diameter in px. Must be numeric (`'2rem'` breaks)
- `width`: Stroke width in px
- `rotate`: Starting angle offset in degrees
- `theme`: Theme override
- `default` (slot): Content centered in the circle

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
