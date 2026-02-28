# SOverlay

**Import:** `import { SOverlay } from '@khsura/sui'`

Low-level overlay/backdrop component. Used internally by `SDialog`, `SMenu`, and `SSheet`. Can also be used directly for custom overlay patterns.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `boolean` | `false` | Show/hide the overlay |
| `scrim` | `boolean` | `false` | Dark semi-transparent backdrop |
| `zIndex` | `number` | `undefined` | CSS z-index |
| `disabled` | `boolean` | `false` | Disable overlay behavior |
| `transition` | `string` | `undefined` | Named Vue transition |
| `position` | `'fixed' \| 'absolute'` | `'fixed'` | CSS positioning strategy |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ attrs, value }` | Content rendered inside the overlay. Bind `v-bind="attrs"` for proper positioning |

## Events

None.

## Usage

```vue
<!-- Custom loading overlay -->
<SOverlay :value="isLoading" scrim>
  <template #default="{ attrs }">
    <div v-bind="attrs" class="loading-content">
      <SProgressCircular indeterminate color="primary" />
    </div>
  </template>
</SOverlay>

<!-- Absolute overlay (within a positioned container) -->
<div style="position: relative;">
  <SOverlay :value="isBlocked" position="absolute" scrim>
    <template #default="{ attrs }">
      <div v-bind="attrs">Locked</div>
    </template>
  </SOverlay>
  <!-- Content below -->
</div>
```

## Notes

- Prefer using `SDialog` or `SSheet` for most overlay use cases — `SOverlay` is the primitive beneath them.
- Always bind `v-bind="attrs"` to the slotted content for correct absolute positioning.
