# STable

**Import:** `import { STable, STableBodyCell, STableHeadCell } from '@khsura/sui'`

Data table with client-side sorting, selection and expansion state, grouping (optionally foldable), sticky header and columns, row header/footer rows, and optional pagination. `STableBodyCell` and `STableHeadCell` are internal building blocks; `STablePagination` is **not** exported.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headers` | `TableHeader[]` | **required** | Column definitions |
| `items` | `T[]` | **required** | Row data array |
| `dense` | `boolean` | `false` | Compact cells |
| `loading` | `boolean` | `false` | Indeterminate progress bar; hides the no-data row |
| `outlined` | `boolean` | `false` | Outlined border style |
| `underlined` | `boolean` | `false` | Bottom border only |
| `rounded` | `boolean` | `undefined` | Declared but not read by the table (no effect) |
| `tile` | `boolean` | `undefined` | Declared but not read by the table (no effect) |
| `hideHeader` | `boolean` | `false` | Hide the header row |
| `hideVerticalBorders` | `boolean` | `false` | Remove column borders |
| `hideTopBottomBorders` | `boolean` | `false` | Remove outer top/bottom borders |
| `hidePagination` | `boolean` | `false` | Hide the pager, but only when `itemsPerPage` is unset or greater than the total |
| `stickyHeader` | `boolean` | `false` | Fix header on scroll (give the table a height limit) |
| `multiSort` | `boolean` | `false` | Allow sorting by multiple columns |
| `groupBy` | `string \| string[]` | `undefined` | Group rows by item field(s); the group name is the values joined with a space |
| `foldable` | `boolean` | `false` | Group rows can be collapsed by clicking the group header |
| `selected` | `T[]` | `undefined` | Selected rows (use with `v-model:selected`). Matched by object identity |
| `expanded` | `T[]` | `undefined` | Expanded rows (use with `v-model:expanded`) |
| `singleSelect` | `boolean` | `false` | Allow only one row selected at a time |
| `singleExpand` | `boolean` | `false` | Allow only one row expanded at a time |
| `shadowExpandedContent` | `boolean` | `false` | Inner shadow on expanded content |
| `itemKey` | `string` | `undefined` | Field used to match **expanded** rows. When unset, the first header's `value` is used |
| `totalItems` | `number` | `undefined` | Server-side total. When greater than `items.length`, items are not sliced per page |
| `itemsPerPageLabel` | `string` | `undefined` | Pager label text (the pager falls back to `'Items per page: '`) |
| `noDataText` | `string` | `undefined` | Empty-state text when `items` is empty. Falls back to i18n `table.noData`, then `'No data'`. Overridden by the `#noData` slot. |
| `itemClass` | `TableItemClass<T>` | `undefined` | Per-cell class (value or `({ item, cellKey, cellType }) => …`) |
| `itemStyle` | `TableItemStyle<T>` | `undefined` | Per-cell inline style (value or function, as `itemClass`) |
| `itemRowClass` | `TableRowClass<T>` | `undefined` | Class applied to the `<tr>` element |
| `itemHeader` | `string` | `''` | Item field; when truthy on a row, a full-width row is rendered above it |
| `itemFooter` | `string` | `''` | Item field; when truthy on a row, a full-width row is rendered below it |
| `itemHeaderClass` / `itemHeaderStyle` | as `itemClass` / `itemStyle` | `undefined` | Styling for `itemHeader` rows |
| `itemFooterClass` / `itemFooterStyle` | as `itemClass` / `itemStyle` | `undefined` | Styling for `itemFooter` rows |
| `stickyLeftColumnsSize` | `number` | `0` | Number of sticky columns from left (sticking activates on horizontal scroll) |
| `stickyLeftColumnsStart` | `number` | `0` | Start index for sticky left columns |
| `stickyLeftColumnsOffset` | `number` | `undefined` | Offset for sticky left columns |
| `stickyRightColumn` | `boolean` | `undefined` | Stick the last column to the right |

### TableHeader shape

```typescript
interface TableHeader {
  text: string          // Column heading text
  value: string         // Item property; also the slot suffix (#item.<value>, #header.<value>)
  align?: 'start' | 'center' | 'end'
  sortable?: boolean    // Sort button is shown only when true
  sort?: (a, b, order?: TableSortOrder) => number
  width?: string | number
  textWrap?: boolean
  noGutters?: boolean       // header cell
  cellNoGutters?: boolean   // body cells
  class?: string | string[] | Record<string, boolean>
  cellClass?: TableItemClass
  cellStyle?: TableItemStyle
  scope?: 'colgroup' | 'col'
  colspan?: number
  rowspan?: number
  groupable?: boolean
}
```

## Model

- `v-model:selected` — `T[]` of selected rows
- `v-model:expanded` — `T[]` of expanded rows
- `v-model:items-per-page` — `number`. **The pager is rendered only when this is set.** Options are 10/25/50/100 plus your value.
- `v-model:folded` — `boolean | string[]` of collapsed group names (`true` = all folded). Default `[]`; works without binding.

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click:row` | `{ item, expand: () => void, isExpanded: boolean }` | A body row was clicked. Rows do not expand on their own — call `expand()` |
| `update:options` | `{ pageIndex, itemsPerPage, sortBy: { key, order }[] }` | Page or page size changed (not emitted on sort changes; sorting is client-side) |
| `update:selected` | `T[]` | Selection changed |
| `update:expanded` | `T[]` | Expansion changed |

## Slots

| Slot | Description |
|------|-------------|
| `header.{value}` | Custom header cell for the column whose `value` matches — receives `{ header, isSticked }` |
| `item.{value}` | Custom body cell — receives `{ item, value, header, row, col, group, select, expand, isSelected, isExpanded, isLeftSticked }` |
| `itemHeader` | Full-width row above a row (see `itemHeader` prop) — receives `{ item, value, row, group, select, expand, isSelected, isExpanded }` |
| `itemFooter` | Full-width row below a row (see `itemFooter` prop) — same scope as `itemHeader` |
| `expanded` | Expanded row content — receives `{ item }` |
| `group` | Group header row — receives `{ group, items, isFolded, toggleFold }` |
| `itemsPerPageLabel` | Custom pagination label |
| `noData` | Empty-state content shown when `items` is empty (and not `loading`) |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { STable, SCheckbox, SChip, SButton, SIcon, type TableHeader } from '@khsura/sui'

const headers: TableHeader[] = [
  { text: '', value: 'select' },
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Email', value: 'email', sortable: true },
  { text: 'Role', value: 'role' },
  { text: '', value: 'actions', align: 'end' },
]

const items = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
])

const selected = ref([])
const expanded = ref([])
const perPage = ref(10)
const folded = ref<boolean | string[]>(true)
</script>

<template>
  <!-- Basic table -->
  <STable :headers="headers" :items="items" />

  <!-- Selection: no built-in checkbox column, render one from the slot scope -->
  <STable :headers="headers" :items="items" v-model:selected="selected">
    <template #item.select="{ isSelected, select }">
      <SCheckbox :model-value="isSelected" @update:model-value="select()" />
    </template>
  </STable>

  <!-- Sticky header + dense + pager -->
  <STable
    :headers="headers"
    :items="items"
    v-model:items-per-page="perPage"
    sticky-header
    dense
    style="max-height: 400px;"
  />

  <!-- Custom cell rendering -->
  <STable :headers="headers" :items="items">
    <template #item.role="{ item }">
      <SChip :color="item.role === 'Admin' ? 'primary' : 'default'">
        {{ item.role }}
      </SChip>
    </template>
    <template #item.actions="{ item }">
      <SButton variant="icon" @click.stop="edit(item)">
        <SIcon icon="mdi-pencil" />
      </SButton>
      <SButton variant="icon" color="error" @click.stop="remove(item)">
        <SIcon icon="mdi-delete" />
      </SButton>
    </template>
  </STable>

  <!-- Expandable rows: expand on row click -->
  <STable
    :headers="headers"
    :items="items"
    item-key="id"
    v-model:expanded="expanded"
    single-expand
    @click:row="({ expand }) => expand()"
  >
    <template #expanded="{ item }">
      <div class="s_pa__4">
        Expanded detail for {{ item.name }}
      </div>
    </template>
  </STable>

  <!-- Grouped -->
  <STable :headers="headers" :items="items" group-by="role" />
  <!-- Foldable groups, all collapsed initially -->
  <STable :headers="headers" :items="items" group-by="role" foldable v-model:folded="folded">
    <template #group="{ group, items: groupItems }">{{ group }} ({{ groupItems.length }})</template>
  </STable>

  <!-- Multi-sort -->
  <STable :headers="headers" :items="items" multi-sort />
</template>
```

## Notes

- Headers use `{ text, value }`. Using `{ key, title }` throws a `TypeError` (`value` is undefined).
- A column is sortable only when its header sets `sortable: true`.
- Slot names for `item.{value}` / `header.{value}` use the `value` from your `headers` array.
- The pager appears only when `v-model:items-per-page` is bound.
- `update:options` fires only for page / page-size changes. For server-side pagination, listen to it and provide `total-items`.
- Selection matches rows by object identity; `item-key` is only used to match expanded rows.
- Buttons inside a row also trigger `click:row` — use `@click.stop`.
