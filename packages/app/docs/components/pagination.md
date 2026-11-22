# SPagination

**Import:** `import { SPagination } from '@khsura/sui'`

Page navigation for a list split into pages. It renders a `<nav>` landmark holding a list of page buttons, previous and next buttons, and optionally first-page and last-page buttons. When there are more pages than `totalVisible`, the hidden pages become an ellipsis ("…"), and the first and last page stay visible. On a narrow screen it switches to a compact layout by itself, so it never scrolls the page sideways.

Live examples: [SPagination in Storybook](https://sui.surakh.com/?path=/docs/ui-components-pagination--docs)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | `1` | Current page, starting at 1. Use `v-model`. Values outside `1…length` are clamped |
| `length` | `number` | — (required) | Number of **pages**, not rows: `Math.ceil(totalItems / itemsPerPage)` |
| `totalVisible` | `number` | `7` | Most slots to show, pages and ellipses together (the arrow buttons do not count) |
| `showFirstLastPage` | `boolean` | `false` | Adds first-page and last-page buttons. Hidden in compact mode |
| `compact` | `boolean` | `undefined` | Compact layout: no first/last buttons, at most 5 page slots. Unset = automatic when the full list does not fit |
| `disabled` | `boolean` | `false` | Disables every button |
| `color` | `string` | `'primary'` | Background colour of the current page — preset name or CSS colour. Other pages use text buttons |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size of the buttons |
| `colorThreshold` | `number` | `undefined` | Auto text contrast threshold for the current page |
| `theme` | `AppThemeType` | `undefined` | Per-component theme override |
| `ariaLabel` | `string` | `'Pagination'` | Accessible name of the `<nav>` landmark |
| `pageAriaLabel` | `string` | `'Page'` | Prefix of each page button's name: "Page 3" |
| `firstAriaLabel` | `string` | `'First page'` | Name of the first-page button |
| `prevAriaLabel` | `string` | `'Previous page'` | Name of the previous-page button |
| `nextAriaLabel` | `string` | `'Next page'` | Name of the next-page button |
| `lastAriaLabel` | `string` | `'Last page'` | Name of the last-page button |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number` | The page the user picked (already clamped). Not emitted for a click on the current page |

## Slots

None.

## Usage

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const page = ref(1)
const itemsPerPage = 20
const totalItems = 482
const pageCount = computed(() => Math.ceil(totalItems / itemsPerPage))
</script>

<template>
  <!-- Basic -->
  <SPagination v-model="page" :length="pageCount" />

  <!-- First/last buttons, more slots, another colour -->
  <SPagination v-model="page" :length="pageCount" :total-visible="9" show-first-last-page color="success" />

  <!-- Small, and always compact (a sidebar, a card footer) -->
  <SPagination v-model="page" :length="pageCount" size="small" compact />

  <!-- Translated names -->
  <SPagination
    v-model="page"
    :length="pageCount"
    aria-label="Хуудаслалт"
    page-aria-label="Хуудас"
    prev-aria-label="Өмнөх"
    next-aria-label="Дараах"
  />
</template>
```

Inside an `STable`, use its built-in pagination (`STablePagination`) instead: it also shows the rows-per-page select and the "1 - 10 / 95" range.

## Page list

`totalVisible` counts every slot, ellipses included, and an ellipsis always stands for two pages or more. With 20 pages and the default of 7:

| Current page | Slots |
|---|---|
| 1 – 4 | `1 2 3 4 5 … 20` |
| 10 | `1 … 9 10 11 … 20` |
| 17 – 20 | `1 … 16 17 18 19 20` |

Below 5 slots there is no room for "first, …, current, …, last", so the list is a plain window of pages around the current one.

## Compact mode

When `compact` is unset, SPagination measures its width. If the buttons it would show do not fit on one row, it hides the first/last buttons and shows at most 5 page slots (fewer, if even those do not fit). At 375 px this happens with the default size once `showFirstLastPage` is set. Set `compact` to `true` or `false` to force a layout.

## Accessibility

- A `<nav>` landmark named by `ariaLabel` ("Pagination"), holding a `<ul>` list of buttons. Give each SPagination on a page its own `ariaLabel` when there are several.
- The current page has `aria-current="page"`. Every page button is named "Page N" (`pageAriaLabel`), and each arrow button has its own name.
- Every button is a native `<button>`: Tab reaches it, Enter and Space activate it. Arrows at the first or last page are disabled. The keyboard focus ring uses the `focusRing` app colour.
- The ellipsis is `aria-hidden`.
- The current page's text colour is picked for contrast with `color`.

## Notes

- `length` is the number of pages. Passing the number of rows (`:length="items.length"`) is the most common mistake.
- The page is 1-based. STable's `pageIndex` is 0-based; do not mix the two.
- There is no `rows-per-page` or `items-per-page` prop. Put an `SSelect` beside it, or use STable's pagination.
- Vuetify's `total-visible`, `show-first-last-page`, `disabled`, `size` and `color` work the same way. There is no `rounded`, `variant`, `density`, `start` or `prev-icon` prop.
- In a flex row beside other content, the pagination shrinks to the space left. Once it has switched to compact there, it stays compact (its width follows its content); give it `style="flex: 1"` to let it grow back.
