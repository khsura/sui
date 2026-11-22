# SSkeletonLoader

**Import:** `import { SSkeletonLoader } from '@khsura/sui'`

Loading placeholder: draws bones in the shape of the coming content (text lines, avatar, card, list items, table), then shows its default slot once `loading` is `false`. While loading it is one `role="status"` with `aria-busy="true"`; the bones are `aria-hidden`. The shimmer stops for `prefers-reduced-motion`, and the bones follow the light/dark theme by themselves.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsSkeletonLoader.d.ts`

Docs: https://sui.surakh.com/?path=/docs/ui-components-skeletonloader--docs

<!-- generated:api:start SSkeletonLoader -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SSkeletonLoader props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `boilerplate` | `boolean` | `false` | no | — | Draws still bones, without the shimmer animation (the shimmer also stops for `prefers-reduced-motion`). |
| `height` | `number \| string \| null` | — | no | — | — |
| `loading` | `boolean` | `false` | no | — | Shows the skeleton while `true` and the default slot once `false`. Without a default slot the skeleton is always shown, so a standalone `<SSkeletonLoader type="card" />` needs no `loading`. |
| `loadingText` | `string` | `"Loading…"` | no | — | Accessible name announced while the skeleton is shown. Defaults to `'Loading…'`. |
| `maxHeight` | `number \| string \| null` | — | no | — | — |
| `maxWidth` | `number \| string \| null` | — | no | — | — |
| `minHeight` | `number \| string \| null` | — | no | — | — |
| `minWidth` | `number \| string \| null` | — | no | — | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` | — |
| `type` | `string` | `"text"` | no | — | What to draw: presets joined by commas, each with an optional `@N` repeat count. Presets: `text`, `heading`, `avatar`, `button`, `image`, `card`, `list-item`, `list-item-avatar`, `table-row`, `table`. Example: `'avatar, text@3'`. Unknown presets are ignored. Defaults to `'text'`. |
| `width` | `number \| string \| null` | — | no | — | — |

**SSkeletonLoader slots**

| Slot | Slot props | Description |
| --- | --- | --- |
| `default` | `any` | The real content, shown once `loading` is `false`. |

**SSkeletonLoader events**

None.

<!-- generated:api:end SSkeletonLoader -->

**SSkeletonLoader notes**

- `type` presets: `text`, `heading`, `avatar`, `button`, `image`, `card`, `list-item`, `list-item-avatar`, `table-row`, `table`. Join with commas, repeat with `@N`: `type="avatar, text@3"`. Unknown presets are silently ignored.
- Preset sizes match SUI: `avatar` 40px (SAvatar), `button` 36px (SButton), `list-item` 48px (SListItem), `table-row` 48px (STable), `card` with SCard's 16px padding. The layout does not jump when the content replaces the skeleton.
- `loading` + content inside = swap. No content inside = the skeleton always shows (`loading` is ignored).
- The root is full width; narrow it with `width` / `max-width`.

## Usage

```vue
<SSkeletonLoader type="card" :loading="isLoading">
  <SCard>…</SCard>
</SSkeletonLoader>

<SSkeletonLoader type="list-item-avatar@3" :loading="isLoading" loading-text="Loading contacts">
  <SList>…</SList>
</SSkeletonLoader>

<!-- standalone placeholder, toggled with v-if -->
<SSkeletonLoader v-if="isLoading" type="table" />
<STable v-else :headers="headers" :items="items" />
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SSkeletonLoader :loading="isLoading" type="card" />` then the content as a sibling (the skeleton never hides) | Put the content inside: `<SSkeletonLoader :loading="isLoading" type="card"><SCard>…</SCard></SSkeletonLoader>`, or `v-if` / `v-else` |
| Vuetify presets: `type="paragraph"`, `sentences`, `article`, `list-item-two-line`, `chip`, `actions`, `table-tbody` | `text@3`, `text@2`, `heading, text@3`, `list-item-avatar`, `button`, `button@2`, `table-row@5` |
| `type="text*3"` or `type="text x3"` | `type="text@3"` |
| `:type="['avatar', 'text']"` (an array) | One string: `type="avatar, text"` |
| `color="grey"`, `elevation="2"`, `size="large"` on SSkeletonLoader | Not props. Size it with `width` / `max-width` / `height`; it takes its tint from the theme |
| `SProgressCircular indeterminate` as a list placeholder | `SSkeletonLoader type="list-item-avatar@5"` keeps the layout steady |
| Hard-coded dark bones (`style="background: #333"`) | Nothing: bones follow the theme; use `theme="dark"` only to force one |
