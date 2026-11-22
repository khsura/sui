# STable

**Import:** `import { STable } from '@khsura/sui'`

Data table with client-side sorting, selection and expansion state, grouping (optionally foldable), sticky header and columns, row header/footer rows, and optional pagination. `STableHeadCell` and `STableBodyCell` are also exported, but they are internal building blocks. `STablePagination` is **not** exported.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsTable.d.ts`. The `TableHeader`, `TableItemClass`, and `TableSortOrder` types are exported from `@khsura/sui`.

<!-- generated:api:start STable -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**STable props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `dense` | `boolean` | `false` | no | — | — |
| `density` | `DensityType \| null` | — | no | `comfortable`, `compact`, `default` | Vertical density: `default` (today's look), `comfortable` (one step tighter) or `compact` (two steps). Set it once for the app with `createSUI({ defaults: { global: { density } } })` instead of overriding heights or paddings per component. |
| `expanded` | `T[]` | — | no | — | — |
| `foldable` | `boolean` | `false` | no | — | — |
| `folded` | `boolean \| string[]` | `[]` | no | — | — |
| `groupBy` | `string \| string[]` | — | no | — | — |
| `headers` | `TableHeader<string>[]` | `[]` | yes | — | — |
| `hideHeader` | `boolean` | `false` | no | — | — |
| `hidePagination` | `boolean` | `false` | no | — | — |
| `hideTopBottomBorders` | `boolean` | `false` | no | — | — |
| `hideVerticalBorders` | `boolean` | `false` | no | — | — |
| `itemClass` | `TableItemClass<T, string>` | — | no | — | — |
| `itemFooter` | `string` | `""` | no | — | — |
| `itemFooterClass` | `TableItemClass<T, string>` | — | no | — | — |
| `itemFooterStyle` | `TableItemStyle<T, string>` | — | no | — | — |
| `itemHeader` | `string` | `""` | no | — | — |
| `itemHeaderClass` | `TableItemClass<T, string>` | — | no | — | — |
| `itemHeaderStyle` | `TableItemStyle<T, string>` | — | no | — | — |
| `itemKey` | `string` | — | no | — | — |
| `itemRowClass` | `TableRowClass<T>` | — | no | — | — |
| `itemStyle` | `TableItemStyle<T, string>` | — | no | — | — |
| `items` | `T[]` | `[]` | yes | — | — |
| `itemsPerPage` | `number` | — | no | — | — |
| `itemsPerPageLabel` | `string` | — | no | — | — |
| `loading` | `boolean` | — | no | — | — |
| `loadingText` | `string` | — | no | — | — |
| `multiSort` | `boolean` | `false` | no | — | — |
| `noDataText` | `string` | — | no | — | — |
| `outlined` | `boolean` | `false` | no | — | — |
| `rounded` | `boolean` | — | no | — | — |
| `selected` | `T[]` | — | no | — | — |
| `shadowExpandedContent` | `boolean` | `false` | no | — | — |
| `singleExpand` | `boolean` | — | no | — | — |
| `singleSelect` | `boolean` | — | no | — | — |
| `stickyHeader` | `boolean` | `false` | no | — | — |
| `stickyLeftColumnsOffset` | `number` | — | no | — | — |
| `stickyLeftColumnsSize` | `number` | `0` | no | — | — |
| `stickyLeftColumnsStart` | `number` | `0` | no | — | — |
| `stickyRightColumn` | `boolean` | — | no | — | — |
| `tile` | `boolean` | — | no | — | — |
| `totalItems` | `number` | — | no | — | — |
| `underlined` | `boolean` | — | no | — | — |

**STable slots**

| Slot | Slot props | Description |
| --- | --- | --- |
| `expanded` | `{ item: T; }` | Content of an expanded row. |
| `group` | `TableGroupSlotProps<T>` | Group row content, rendered when `groupBy` is set. |
| `header.<column>` (pattern `^header\..+$`) | `TableHeaderSlotProps` | Header cell of one column; the key is `header.` followed by the column's `value`. |
| `item.<column>` (pattern `^item\..+$`) | `TableItemSlotProps<T>` | Body cell of one column; the key is `item.` followed by the column's `value`. |
| `itemFooter` | `TableItemFooterSlotProps<T>` | Full-width row below an item, rendered when `itemFooter` is set and the item has that key. |
| `itemHeader` | `TableItemHeaderSlotProps<T>` | Full-width row above an item, rendered when `itemHeader` is set and the item has that key. |
| `itemsPerPageLabel` | `any` | Label of the items-per-page selector in the pagination. |
| `loadingData` | `any` | Shown instead of the rows while `loading` is set and `items` is still empty. |
| `noData` | `any` | Shown instead of the rows when `items` is empty and not loading. |

**STable events**

| Event | Payload |
| --- | --- |
| `click:row` | `[value: { item: T; expand: () => void; isExpanded: boolean; }]` |
| `update:expanded` | `[value: T[]]` |
| `update:folded` | `[value: boolean \| string[]]` |
| `update:itemsPerPage` | `[value: number \| undefined]` |
| `update:options` | `[{ pageIndex: number; itemsPerPage: number; sortBy: { key: string; order: TableSortOrder; }[]; }]` |
| `update:selected` | `[value: T[]]` |

<!-- generated:api:end STable -->

**STable notes**

- `headers`: Column definitions (see below)
- `items`: Row objects
- `itemKey`: Field used to match **expanded** rows (default: first header's `value`)
- `dense`: Compact cells
- `loading`: Indeterminate progress bar. Hides the no-data row; while `items` is still empty it shows a full-width loading row instead
- `loadingText`: Text of that loading row (`#loadingData` slot overrides it) (default: i18n `table.loading` → `'Loading…'`)
- `outlined` / `underlined`: Border styles
- `rounded` / `tile`: Declared, but **no effect** (the table never reads them)
- `hideHeader`: Hide `<thead>`
- `hideVerticalBorders`: Remove column borders
- `hideTopBottomBorders`: Remove outer top/bottom borders
- `hidePagination`: Hides the pager only when `itemsPerPage` is unset or greater than the total
- `stickyHeader`: Sticky header row. Give the table a height limit (`style="max-height: 400px"` or a `height`): the rows scroll inside the table, the header sticks and the pagination stays visible below
- `multiSort`: Sort by several columns
- `groupBy`: Group rows by item field(s). Group name = values joined with a space
- `foldable`: Clicking a group row collapses or expands it
- `selected`: Selected rows (`v-model:selected`)
- `singleSelect`: At most one selected row
- `expanded`: Expanded rows (`v-model:expanded`)
- `singleExpand`: At most one expanded row
- `shadowExpandedContent`: Inner shadow on expanded content
- `totalItems`: Server-side total. When it is greater than `items.length`, items are **not** sliced per page
- `itemsPerPageLabel`: Pager label text (default: `'Items per page: '`)
- `noDataText`: Empty-state text (`#noData` slot overrides it) (default: i18n `table.noData` → `'No data'`)
- `itemClass` / `itemStyle`: Per-cell class/style (value or `({ item, cellKey, cellType }) => …`)
- `itemRowClass`: `<tr>` class (value or `({ item, cellType }) => …`)
- `itemHeader` / `itemFooter`: Item field. When it is truthy on a row, a full-width row is rendered above/below that row (default: `''`)
- `itemHeaderClass` / `itemHeaderStyle` / `itemFooterClass` / `itemFooterStyle`: Styling for those rows
- `stickyLeftColumnsStart`: Index of the first left-sticky column
- `stickyLeftColumnsSize`: Number of left-sticky columns (sticking activates on horizontal scroll)
- `stickyLeftColumnsOffset`: Extra columns counted before sticking activates
- `stickyRightColumn`: Stick the last column to the right
- `click:row` (event): A body row was clicked. Rows do **not** expand on their own: call `expand()`
- `update:options` (event): Emitted when the page or page size changes (not when the sort changes)
- `update:selected` / `update:expanded` (event): Model updates
- `item.<value>` (slot): Body cell
- `header.<value>` (slot): Header cell content
- `group` (slot): Group row content (default: the group name)
- `itemHeader` / `itemFooter` (slot): Full-width rows from `itemHeader`/`itemFooter`
- `expanded` (slot): Content of an expanded row
- `noData` (slot): Empty state — put an `SEmptyState` here for an icon, title or action: `<template #noData><SEmptyState size="small" icon="mdi-cart-outline" title="No orders yet" /></template>`
- `loadingData` (slot): Loading row, shown while `loading` is set and `items` is empty
- `itemsPerPageLabel` (slot): Pager label

### TableHeader

```ts
interface TableHeader {
  text: string                 // heading text
  value: string                // item field; also the slot suffix: #item.<value>, #header.<value>
  align?: 'start' | 'center' | 'end'
  sortable?: boolean           // sort button shown ONLY when true
  sort?: (a, b, order?: TableSortOrder) => number
  width?: string | number
  textWrap?: boolean
  noGutters?: boolean          // header cell
  cellNoGutters?: boolean      // body cells
  class?: string | string[] | Record<string, boolean>
  cellClass?: TableItemClass
  cellStyle?: TableItemStyle
  scope?: 'colgroup' | 'col'   // two-row grouped headers
  colspan?: number
  rowspan?: number
  groupable?: boolean
}
```

## Models

- `v-model:selected`: `T[]`
- `v-model:expanded`: `T[]`
- `v-model:items-per-page`: `number`. **The pager is rendered only when this is set.** Options are 10/25/50/100 plus your value.
- `v-model:folded`: `boolean | string[]`, the collapsed group names (`true` = all collapsed). Default `[]`. Works without binding.

## Usage

```vue
<script setup lang="ts">
import type { TableHeader } from '@khsura/sui'

const headers: TableHeader[] = [
  { text: 'Select', value: 'select' },
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Role', value: 'role' },
  { text: '', value: 'actions', align: 'end' },
]
const items = ref([
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'User' },
])
const selected = ref([])
const expanded = ref([])
const perPage = ref(10)
</script>

<template>
  <STable
    :headers="headers" :items="items" item-key="id"
    v-model:selected="selected" v-model:expanded="expanded" v-model:items-per-page="perPage"
    @click:row="({ expand }) => expand()"
  >
    <template #item.select="{ isSelected, select }">
      <SCheckbox :model-value="isSelected" @update:model-value="select()" />
    </template>
    <template #item.actions="{ item }">
      <SButton variant="icon" @click.stop="edit(item)"><SIcon icon="mdi-pencil" /></SButton>
    </template>
    <template #expanded="{ item }">
      <div class="s_pa__4">Details for {{ item.name }}</div>
    </template>
  </STable>

  <!-- Foldable groups, all collapsed initially -->
  <STable :headers="headers" :items="items" group-by="role" foldable v-model:folded="folded">
    <template #group="{ group, items, isFolded }">{{ group }} ({{ items.length }})</template>
  </STable>
</template>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| A hand-made `<div><SIcon …/><p>No data</p></div>` in `#noData` | `<SEmptyState size="small" icon="…" title="…" />` in `#noData` |
| `{ key: 'name', title: 'Name' }` | `{ text: 'Name', value: 'name' }`. Using `key` throws a `TypeError` (`value` is undefined) |
| `#item.name` slot with a header whose `value` is not `'name'` | The slot suffix is the header's `value` |
| Expecting a built-in checkbox column with `v-model:selected` | No select column exists. Render one with `select` / `isSelected` from the slot scope |
| Expecting a column to be sortable by default | Set `sortable: true` per header |
| Expecting a pager by default | Bind `v-model:items-per-page` |
| Waiting for `update:options` to fetch on sort change | It fires only for page/page-size changes. Sorting is always client-side |
| Rebuilding item objects and expecting `selected` to persist | Selection matches by **object identity** (`itemKey` applies only to expansion) |
| Buttons inside a row also trigger `click:row` | Use `@click.stop` |
| Using `STable` without importing it (registered globally with `app.component` and no `GlobalComponents` types) and expecting typed `#item.<value>` slots | The slot `item` is typed from `items` only when the template knows the component type: import `STable` from `@khsura/sui` in the SFC (Nuxt's generated component types also work). Otherwise `item` is `any` |
| Wrapping `STable` in a fixed-height `div` to get a sticky header | Put the height limit on `STable` itself. Older versions clipped the rows and the pagination instead of scrolling them |
