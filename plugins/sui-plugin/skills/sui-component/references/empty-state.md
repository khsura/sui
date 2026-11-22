# SEmptyState

**Import:** `import { SEmptyState } from '@khsura/sui'`

The "nothing here yet" block: a decorative icon or illustration, a short title, a supporting sentence and an optional action button, centred in a column. It is a plain `<div class="s_emptyState">` (no role, no Tab stop of its own) that takes the full width of its parent and wraps instead of overflowing, also at 375 px. Use it on an empty page or card, and in the `#noData` slot of `STable`, `SSelect` and `SAutocomplete`.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsEmptyState.d.ts`

Docs: https://sui.surakh.com/?path=/docs/ui-components-emptystate--docs

<!-- generated:api:start SEmptyState -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SEmptyState props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `actionText` | `string` | — | no | — | Label of the built-in action button. The button is shown only when this is set; clicking it emits `action`. |
| `color` | `string \| null` | — | no | — | Colour of the icon only (preset name or CSS colour), not a background: an empty state has no background of its own. |
| `icon` | `string` | — | no | — | Material Design icon shown above the title, such as `mdi-inbox-outline`. Ignored when `image` is set. Decorative: hidden from screen readers. |
| `image` | `string` | — | no | — | Illustration URL shown above the title. Wins over `icon`. Decorative (`alt=""`): put the meaning in `title` and `text`. |
| `size` | `SizePropertyType` | — | no | `default`, `extra`, `large`, `mini`, `small` | — |
| `text` | `string` | — | no | — | Supporting sentence under the title that says why it is empty or what to do next. |
| `theme` | `AppThemeType` | — | no | `dark`, `light` | — |
| `title` | `string` | — | no | — | Short headline, such as `No orders yet`. Rendered as text, not as a heading element. |

**SEmptyState slots**

| Slot | Slot props | Description |
| --- | --- | --- |
| `actions` | `any` | Replaces the built-in action button, such as two SButtons or a link. |
| `default` | `any` | Extra content between the text and the actions. |
| `media` | `any` | Replaces the icon or image, such as an illustration component. Keep it decorative. |
| `text` | `any` | Replaces the `text` sentence. |
| `title` | `any` | Replaces the `title` text. |

**SEmptyState events**

| Event | Payload |
| --- | --- |
| `action` | `[event: Event]` |

<!-- generated:api:end SEmptyState -->

**SEmptyState notes**

- Each part renders only when its prop or slot is set; `actionText` alone adds a primary `SButton` that emits `action`.
- `image` wins over `icon`. Both are decorative (`aria-hidden` / `alt=""`): the meaning goes in `title` and `text`.
- `color` colours the **icon only**; there is no background colour.
- `size` scales padding, icon, image, title, text and the action button. Use `size="small"` in a table cell and `size="mini"` in a select or autocomplete menu.
- The title is plain text, not a heading. For a page-level heading use `<template #title><h2>…</h2></template>`.

## Usage

```vue
<SEmptyState
  icon="mdi-inbox-outline"
  title="No orders yet"
  text="Orders you create appear here."
  action-text="Create order"
  @action="openNewOrder"
/>

<!-- Several actions or a link: the actions slot -->
<SEmptyState icon="mdi-account-multiple-outline" title="No members">
  <template #actions>
    <SButton color="primary" @click="invite">Invite</SButton>
    <SButton variant="text" to="/help/members">Learn more</SButton>
  </template>
</SEmptyState>

<!-- STable: without the slot the row keeps its plain noDataText -->
<STable :headers="headers" :items="orders">
  <template #noData>
    <SEmptyState size="small" icon="mdi-cart-outline" title="No orders yet" />
  </template>
</STable>

<!-- SSelect / SAutocomplete: opt-in, an empty menu stays blank without noDataText or the slot -->
<SSelect label="Warehouse" :items="warehouses">
  <template #noData>
    <SEmptyState size="mini" icon="mdi-warehouse" title="No warehouses" />
  </template>
</SSelect>
<SAutocomplete :items="fruits">
  <template #noData="{ query }">
    <SEmptyState size="mini" icon="mdi-magnify" :title="`Nothing matches “${query}”`" />
  </template>
</SAutocomplete>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SEmptyState headline="…" />` (Vuetify) | `title="…"` (there is no `headline`) |
| `<SEmptyState bg-color="grey" />` or expecting `color` to fill a background | `color` colours the icon; put the background on the parent |
| `<SEmptyState action-text="Go" href="/new" />` / `:to` | `<template #actions><SButton to="/new">Go</SButton></template>` |
| `@click:action="…"` (Vuetify event name) | `@action="…"` |
| `action-text` without `@action` (a button that does nothing) | Add `@action`, or use the `actions` slot |
| `<img>` or `<SIcon>` in the default slot | `image="…"` / `icon="…"`, or the `media` slot |
| A hand-made `<div class="text-center"><SIcon …/><p>No data</p></div>` in `#noData` | `<SEmptyState size="small" icon="…" title="…" />` |
| `<SSelect :items="[]" no-data-text="…">` expected to show without opening | The message shows in the **open** menu only |
| An `SEmptyState` inside the default slot of `SSelect` / `SAutocomplete` | The `#noData` slot |
