# SOverlay

**Import:** `import { SOverlay } from '@khsura/sui'`

Low-level layer primitive. Teleports its slot into the overlay container rendered by `SApp`, optionally with a dark scrim. Used internally by `SDialog`, `SMenu`, `STooltip`, `SSnackbar`, `SSelect`, `SAutocomplete` and `SNavigationDrawer`. Prefer those components; use `SOverlay` only for custom full-screen layers.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsOverlay.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `boolean \| null` | `undefined` | Show/hide the slot (and scrim) |
| `scrim` | `boolean` | `false` | 50% black backdrop; makes the layer `position: fixed; inset: 0` |
| `zIndex` | `number` | `undefined` | z-index of the layer (only with `scrim` or `position="fixed"`) |
| `position` | `'fixed' \| ...` | `undefined` | `'fixed'` wraps content in the full-viewport layer without a scrim |
| `transition` | `string` | `undefined` | Vue `<Transition>` name for the content |
| `disabled` | `boolean` | `false` | Disables the teleport (renders in place) |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ attrs, value }` | Content, rendered only while `value` is true. Bind `v-bind="attrs"` (adds the content class: absolute, clickable) |

## Events

None — the scrim does not emit clicks.

## Usage

```vue
<SOverlay :value="isLoading" scrim>
  <template #default="{ attrs }">
    <div v-bind="attrs" style="inset: 0; display: grid; place-items: center">
      <SProgressCircular indeterminate color="primary" />
    </div>
  </template>
</SOverlay>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `position="absolute"` + `scrim` inside a `position: relative` box to cover only that box | Not possible: with `scrim` the layer is teleported and `fixed` to the whole viewport |
| No `<SApp>` root | Wrap the app in `<SApp>` — the teleport target lives there |
| Expecting scrim click to close | Add your own close button; no event is emitted |
