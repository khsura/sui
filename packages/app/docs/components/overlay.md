# SOverlay

**Import:** `import { SOverlay } from '@khsura/sui'`

Low-level overlay/backdrop component. Teleports its slot into the overlay container rendered by `SApp`, optionally with a dark scrim. Used internally by `SDialog`, `SMenu`, `STooltip`, `SSnackbar`, `SSelect`, `SAutocomplete`, `SDatePickerInput` and `SNavigationDrawer`. Can also be used directly for custom full-screen layers.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `boolean \| null` | `undefined` | Show/hide the slot (and scrim) |
| `scrim` | `boolean` | `false` | 50% black backdrop; makes the layer `position: fixed; inset: 0` over the whole viewport |
| `zIndex` | `number` | `undefined` | z-index of the layer (only applied with `scrim` or `position="fixed"`) |
| `disabled` | `boolean` | `false` | Disables the teleport (renders in place) |
| `transition` | `string` | `undefined` | Named Vue transition for the content |
| `position` | `'fixed' \| ...` | `undefined` | `'fixed'` wraps the content in the full-viewport layer without a scrim |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ attrs, value }` | Content, rendered only while `value` is true. Bind `v-bind="attrs"` (adds the `s_overlay__content` class: absolute, clickable) |

## Events

None — the scrim does not emit clicks.

## Usage

```vue
<!-- Full-screen loading overlay -->
<SOverlay :value="isLoading" scrim>
  <template #default="{ attrs }">
    <div v-bind="attrs" style="inset: 0; display: grid; place-items: center">
      <SProgressCircular indeterminate color="primary" />
    </div>
  </template>
</SOverlay>

<!-- Blocking only one container: SOverlay cannot do this (with `scrim` it is
     fixed to the whole viewport). Use a plain absolutely positioned element. -->
<div style="position: relative;">
  <div v-if="isBlocked" style="position: absolute; inset: 0; display: grid; place-items: center; background: rgba(0, 0, 0, 0.5);">
    Locked
  </div>
  <!-- Content below -->
</div>
```

## Notes

- Prefer `SDialog`, `SMenu`, etc. for most overlay use cases — `SOverlay` is the primitive beneath them.
- The app must be wrapped in `<SApp>` — the teleport target lives there.
- With `scrim` (or `position="fixed"`) the layer always covers the whole viewport; it cannot be confined to a `position: relative` container.
- Always bind `v-bind="attrs"` to the slotted content.
- Clicking the scrim does nothing — provide your own close control.
