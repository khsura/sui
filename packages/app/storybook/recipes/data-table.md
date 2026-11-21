---
title: Data table with sorting and pagination
whenToUse: A list of records shown as a table with sortable columns, custom cells and a pager.
components: STable, SChip
---

- Headers are `{ text, value }` (`TableHeader` from `@khsura/sui`). `{ title, key }` throws.
- A column sorts only when its header has `sortable: true`. Sorting is client-side.
- The pager appears only when `v-model:items-per-page` is bound. Page size options are 10/25/50/100 plus your value.
- Custom cells use `#item.<value>` slots (`#item.status`), receiving `{ item, value, header, ... }`; custom headers use `#header.<value>`.
- For server-side paging listen to `@update:options` and pass `total-items`; it is not emitted on sort changes.
- Buttons inside a row also trigger `@click:row`; use `@click.stop` on them.
