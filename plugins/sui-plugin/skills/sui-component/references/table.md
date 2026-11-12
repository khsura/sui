# STable

**Import:** `import { STable } from '@khsura/sui'`

Data table with client-side sorting, selection and expansion state, grouping (optionally foldable), sticky header and columns, row header/footer rows, and optional pagination. `STableHeadCell` and `STableBodyCell` are also exported, but they are internal building blocks. `STablePagination` is **not** exported.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsTable.d.ts`. The `TableHeader`, `TableItemClass`, and `TableSortOrder` types are exported from `@khsura/sui`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headers` | `TableHeader[]` | **required** | Column definitions (see below) |
| `items` | `T[]` | **required** | Row objects |
| `itemKey` | `string` | first header's `value` | Field used to match **expanded** rows |
| `dense` | `boolean` | `false` | Compact cells |
| `loading` | `boolean` | `false` | Indeterminate progress bar. Hides the no-data row |
| `outlined` / `underlined` | `boolean` | `false` | Border styles |
| `rounded` / `tile` | `boolean` | `false` | Declared, but **no effect** (the table never reads them) |
| `hideHeader` | `boolean` | `false` | Hide `<thead>` |
| `hideVerticalBorders` | `boolean` | `false` | Remove column borders |
| `hideTopBottomBorders` | `boolean` | `false` | Remove outer top/bottom borders |
| `hidePagination` | `boolean` | `false` | Hides the pager only when `itemsPerPage` is unset or greater than the total |
| `stickyHeader` | `boolean` | `false` | Sticky header row (give the table a height limit) |
| `multiSort` | `boolean` | `false` | Sort by several columns |
| `groupBy` | `string \| string[]` | `undefined` | Group rows by item field(s). Group name = values joined with a space |
| `foldable` | `boolean` | `false` | Clicking a group row collapses or expands it |
| `selected` | `T[]` | `undefined` | Selected rows (`v-model:selected`) |
| `singleSelect` | `boolean` | `false` | At most one selected row |
| `expanded` | `T[]` | `undefined` | Expanded rows (`v-model:expanded`) |
| `singleExpand` | `boolean` | `false` | At most one expanded row |
| `shadowExpandedContent` | `boolean` | `false` | Inner shadow on expanded content |
| `totalItems` | `number` | `undefined` | Server-side total. When it is greater than `items.length`, items are **not** sliced per page |
| `itemsPerPageLabel` | `string` | `'Items per page: '` | Pager label text |
| `noDataText` | `string` | i18n `table.noData` → `'No data'` | Empty-state text (`#noData` slot overrides it) |
| `itemClass` / `itemStyle` | `TableItemClass<T>` / `TableItemStyle<T>` | `undefined` | Per-cell class/style (value or `({ item, cellKey, cellType }) => …`) |
| `itemRowClass` | `TableRowClass<T>` | `undefined` | `<tr>` class (value or `({ item, cellType }) => …`) |
| `itemHeader` / `itemFooter` | `string` | `''` | Item field. When it is truthy on a row, a full-width row is rendered above/below that row |
| `itemHeaderClass` / `itemHeaderStyle` / `itemFooterClass` / `itemFooterStyle` | as `itemClass` / `itemStyle` | `undefined` | Styling for those rows |
| `stickyLeftColumnsStart` | `number` | `0` | Index of the first left-sticky column |
| `stickyLeftColumnsSize` | `number` | `0` | Number of left-sticky columns (sticking activates on horizontal scroll) |
| `stickyLeftColumnsOffset` | `number` | `undefined` | Extra columns counted before sticking activates |
| `stickyRightColumn` | `boolean` | — | Stick the last column to the right |

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

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click:row` | `{ item, expand: () => void, isExpanded: boolean }` | A body row was clicked. Rows do **not** expand on their own: call `expand()` |
| `update:options` | `{ pageIndex, itemsPerPage, sortBy: { key, order }[] }` | Emitted when the page or page size changes (not when the sort changes) |
| `update:selected` / `update:expanded` | `T[]` | Model updates |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `item.<value>` | `{ item, value, header, row, col, group, select, expand, isSelected, isExpanded, isLeftSticked }` | Body cell |
| `header.<value>` | `{ header, isSticked }` | Header cell content |
| `group` | `{ group, items, isFolded, toggleFold }` | Group row content (default: the group name) |
| `itemHeader` / `itemFooter` | `{ item, value, row, group, select, expand, isSelected, isExpanded, … }` | Full-width rows from `itemHeader`/`itemFooter` |
| `expanded` | `{ item }` | Content of an expanded row |
| `noData` | — | Empty state |
| `itemsPerPageLabel` | — | Pager label |

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
| `{ key: 'name', title: 'Name' }` | `{ text: 'Name', value: 'name' }`. Using `key` throws a `TypeError` (`value` is undefined) |
| `#item.name` slot with a header whose `value` is not `'name'` | The slot suffix is the header's `value` |
| Expecting a built-in checkbox column with `v-model:selected` | No select column exists. Render one with `select` / `isSelected` from the slot scope |
| Expecting a column to be sortable by default | Set `sortable: true` per header |
| Expecting a pager by default | Bind `v-model:items-per-page` |
| Waiting for `update:options` to fetch on sort change | It fires only for page/page-size changes. Sorting is always client-side |
| Rebuilding item objects and expecting `selected` to persist | Selection matches by **object identity** (`itemKey` applies only to expansion) |
| Buttons inside a row also trigger `click:row` | Use `@click.stop` |
