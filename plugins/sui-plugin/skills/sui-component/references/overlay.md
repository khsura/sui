# SOverlay

**Import:** `import { SOverlay } from '@khsura/sui'`

Low-level layer primitive. Teleports its slot into the overlay container rendered by `SApp`, optionally with a dark scrim. Used internally by `SDialog`, `SMenu`, `STooltip`, `SSnackbar`, `SSelect`, `SAutocomplete` and `SNavigationDrawer`. Prefer those components; use `SOverlay` only for custom full-screen layers.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsOverlay.d.ts`

<!-- generated:api:start SOverlay -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SOverlay props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | — | no | — |
| `position` | `Position` | — | no | `absolute`, `fixed`, `relative`, `static`, `sticky` |
| `scrim` | `boolean` | — | no | — |
| `transition` | `string` | — | no | — |
| `value` | `boolean \| null` | — | no | — |
| `zIndex` | `number` | — | no | — |

**SOverlay slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{ attrs: { class: string; }; value: true; }` |

**SOverlay events**

None.

<!-- generated:api:end SOverlay -->

**SOverlay notes**

- `value`: Show/hide the slot (and scrim)
- `scrim`: 50% black backdrop; makes the layer `position: fixed; inset: 0`
- `zIndex`: z-index of the layer (only with `scrim` or `position="fixed"`)
- `position`: `'fixed'` wraps content in the full-viewport layer without a scrim
- `transition`: Vue `<Transition>` name for the content
- `disabled`: Disables the teleport (renders in place)
- `default` (slot): Content, rendered only while `value` is true. Bind `v-bind="attrs"` (adds the content class: absolute, clickable)

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
