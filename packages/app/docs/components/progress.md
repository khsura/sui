# Progress Components

**Import:** `import { SProgressLinear, SProgressCircular } from '@khsura/sui'`

---

## SProgressLinear

Horizontal bar progress indicator.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| string` | `undefined` | Progress value (0–100) |
| `indeterminate` | `boolean` | `false` | Animated indeterminate state (unknown progress) |
| `color` | `string` | `undefined` | Bar color — preset name or CSS color |
| `backgroundColor` | `string \| null` | `undefined` | Track background color |
| `backgroundOpacity` | `string \| number \| null` | `undefined` | Track opacity |
| `size` | `string \| number \| null` | `undefined` | Bar height |
| `position` | `'fixed' \| 'absolute'` | `undefined` | CSS position (for page-level loaders) |

### Slots

None.

### Events

None.

---

## SProgressCircular

Circular/spinner progress indicator.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `undefined` | Progress value (0–100) |
| `indeterminate` | `boolean` | `false` | Animated spinning state |
| `color` | `string` | `undefined` | Arc color — preset name or CSS color |
| `size` | `number \| string` | `undefined` | Diameter of the circle |
| `width` | `number` | `undefined` | Stroke width of the arc |
| `rotate` | `number` | `undefined` | Starting angle offset (degrees) |

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

<!-- Inside a button (loading state) -->
<!-- Note: SButton has a built-in loading prop, but you can also use this: -->
<SButton :disabled="isLoading" color="primary">
  <SProgressCircular v-if="isLoading" indeterminate :size="18" />
  <span v-else>Save</span>
</SButton>
```

## Notes

- `SButton` has a built-in `loading` prop that shows a `SProgressCircular` automatically — prefer that over manually composing.
- `indeterminate` is for unknown progress durations; use `value` (0–100) for known progress.
- For page-level loading bars (like NProgress), use `SProgressLinear` with `position="fixed"` at the top of the viewport.
