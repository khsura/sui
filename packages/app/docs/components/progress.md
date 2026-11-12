# Progress Components

**Import:** `import { SProgressLinear, SProgressCircular } from '@khsura/sui'`

---

## SProgressLinear

Horizontal bar progress indicator.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| string` | `0` | Progress value (0–100) |
| `indeterminate` | `boolean` | `false` | Animated indeterminate state (unknown progress) |
| `color` | `string` | `'info'` | Bar color — preset name or CSS color |
| `backgroundColor` | `string \| null` | `undefined` | Track background color (falls back to `color`) |
| `backgroundOpacity` | `string \| number \| null` | `undefined` | Track opacity |
| `size` | `string \| number \| null` | `undefined` | Bar height (number = px) |
| `position` | `'static' \| 'fixed' \| 'absolute' \| 'relative' \| 'sticky'` | `undefined` | Only `'fixed'` and `'absolute'` add positioning styles (for page-level loaders) |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Rendered inside the bar container (e.g. a label) |

### Events

None.

---

## SProgressCircular

Circular/spinner progress indicator.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Progress value (0–100, clamped) |
| `indeterminate` | `boolean` | `false` | Animated spinning state |
| `color` | `string \| null` | `undefined` | Arc color — preset name or CSS color (text color; inherits `currentColor`) |
| `size` | `number \| string` | `32` | Diameter in px — must be numeric (`'2rem'` breaks) |
| `width` | `number` | `4` | Stroke width of the arc in px |
| `rotate` | `number` | `undefined` | Starting angle offset (degrees) |
| `theme` | `AppThemeType` | `undefined` | Theme override |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Content rendered in the center of the circle |

### Events

None.

---

## Usage

```vue
<!-- Determinate linear progress -->
<SProgressLinear :value="uploadProgress" color="primary" />

<!-- Indeterminate linear (loading bar) -->
<SProgressLinear indeterminate color="primary" />

<!-- Page-level loader (fixed top) -->
<SProgressLinear
  v-if="isLoading"
  indeterminate
  color="primary"
  position="fixed"
  style="top: 0; z-index: 9999;"
/>

<!-- Thick bar -->
<SProgressLinear :value="75" :size="8" color="success" />

<!-- Colored track -->
<SProgressLinear
  :value="50"
  color="primary"
  background-color="primary"
  :background-opacity="0.2"
/>

<!-- Circular spinner (loading) -->
<SProgressCircular indeterminate color="primary" />

<!-- Determinate circular progress -->
<SProgressCircular :value="score" :size="80" :width="6" color="success" />

<!-- With center label -->
<SProgressCircular :value="75" :size="100" :width="8" color="primary">
  75%
</SProgressCircular>

<!-- Small inline spinner -->
<SProgressCircular indeterminate :size="20" color="primary" />

<!-- Loading button: prefer SButton's built-in prop -->
<SButton :loading="isSaving" color="primary">Save</SButton>
```

## Notes

- `SButton` has a built-in `loading` prop that shows a `SProgressCircular` automatically — prefer that over manually composing.
- `indeterminate` is for unknown progress durations; use `value` (0–100) for known progress.
- For page-level loading bars (like NProgress), use `SProgressLinear` with `position="fixed"` at the top of the viewport.
- `SProgressLinear` defaults to `color="info"`, not primary.
- `SProgressCircular` always reports `aria-valuenow="60"`; set your own `aria-valuenow` if accessibility matters.
