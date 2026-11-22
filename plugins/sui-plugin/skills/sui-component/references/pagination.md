# SPagination

**Import:** `import { SPagination } from '@khsura/sui'`

Standalone page navigation: a `<nav aria-label="Pagination">` with previous/next buttons, page buttons (hidden pages become "…"), and optional first/last buttons. The current page gets `aria-current="page"`. It switches to a compact layout by itself when it does not fit (at 375 px, for example), so it never scrolls the page sideways. Inside `STable`, use the table's built-in pagination instead.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsPagination.d.ts`

Docs: https://sui.surakh.com/?path=/docs/ui-components-pagination--docs

<!-- generated:api:start SPagination -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SPagination props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `"Pagination"` | no | — | Accessible name of the `<nav>` landmark. Defaults to `'Pagination'`. |
| `color` | `string` | `"primary"` | no | — | — |
| `colorThreshold` | `number` | — | no | — | — |
| `compact` | `boolean` | `undefined` | no | — | Compact mode: no first/last buttons and at most 5 page slots. Leave it unset and SPagination switches to it by itself when the full list does not fit its width (on a phone, for example). `true` or `false` forces it. |
| `disabled` | `boolean \| null` | `false` | no | — | — |
| `firstAriaLabel` | `string` | `"First page"` | no | — | Accessible name of the first-page button. Defaults to `'First page'`. |
| `lastAriaLabel` | `string` | `"Last page"` | no | — | Accessible name of the last-page button. Defaults to `'Last page'`. |
| `length` | `number` | — | yes | — | Number of pages (not the number of rows): `Math.ceil(totalItems / itemsPerPage)`. |
| `modelValue` | `number` | `undefined` | no | — | Current page, starting at 1. Use `v-model`. Values outside `1…length` are clamped. Defaults to `1`. |
| `nextAriaLabel` | `string` | `"Next page"` | no | — | Accessible name of the next-page button. Defaults to `'Next page'`. |
| `pageAriaLabel` | `string` | `"Page"` | no | — | Accessible name of a page button, followed by its number: `'Page'` gives "Page 3". Defaults to `'Page'`. |
| `prevAriaLabel` | `string` | `"Previous page"` | no | — | Accessible name of the previous-page button. Defaults to `'Previous page'`. |
| `showFirstLastPage` | `boolean` | `false` | no | — | Shows the first-page and last-page buttons beside the previous and next buttons. Hidden in compact mode. |
| `size` | `SizePropertyType` | — | no | `default`, `extra`, `large`, `mini`, `small` | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` | — |
| `totalVisible` | `number` | `undefined` | no | — | Most slots to show, pages and ellipses together (not counting the arrow buttons). Hidden pages become "…", and the first and last page stay visible. Defaults to `7`. |

**SPagination slots**

None.

**SPagination events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: number]` |

<!-- generated:api:end SPagination -->

**SPagination notes**

- `length` is the number of **pages**, not rows: `Math.ceil(totalItems / itemsPerPage)`.
- `modelValue` starts at 1 (STable's `pageIndex` starts at 0). Out-of-range values are clamped; `update:modelValue` is not emitted for a click on the current page.
- `totalVisible` (default 7) counts pages **and** ellipses, not the arrow buttons. An ellipsis always hides two pages or more; the first and last page stay visible.
- `compact` unset = automatic: when the full row does not fit, it hides the first/last buttons and shows at most 5 page slots. `true` / `false` force it.
- `color` (default `primary`) colours only the current page; the other pages are text buttons.
- Every button has an English accessible name; translate with `ariaLabel`, `pageAriaLabel`, `prevAriaLabel`, `nextAriaLabel`, `firstAriaLabel`, `lastAriaLabel`.

## Usage

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { SPagination } from '@khsura/sui'

const page = ref(1)
const itemsPerPage = 20
const totalItems = ref(482)
const pageCount = computed(() => Math.ceil(totalItems.value / itemsPerPage))
</script>

<template>
  <SPagination v-model="page" :length="pageCount" show-first-last-page />
</template>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `:length="items.length"` or `:length="totalItems"` (rows) | `:length="Math.ceil(totalItems / itemsPerPage)"` (pages) — the validator's `pagination-length-rows` rule flags it |
| `v-model="pageIndex"` (0-based, copied from STable) | A 1-based `page` ref; derive `page - 1` where an index is needed — `pagination-zero-based` rule |
| `:items-per-page`, `:total-items`, `rows-per-page` | Not props. Compute `length` yourself; put an `SSelect` beside it for rows per page, or use STable's pagination |
| Vuetify `rounded`, `variant`, `density`, `active-color`, `prev-icon`, `start` | Not supported. `color` colours the current page; `size` scales the buttons |
| Wrapping it in `overflow-x: auto` "for mobile" | Not needed: it switches to compact mode by itself when it does not fit |
| `<STablePagination>` | Not exported. `SPagination` standalone, or STable's built-in pagination |
