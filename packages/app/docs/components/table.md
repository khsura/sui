# STable

**Import:** `import { STable, STableBodyCell, STableHeadCell, STablePagination } from '@khsura/sui'`

Full-featured data table with sorting, selection, expansion, grouping, sticky columns, and pagination.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headers` | `TableHeader[]` | **required** | Column definitions |
| `items` | `T[]` | **required** | Row data array |
| `dense` | `boolean` | `false` | Compact row height |
| `loading` | `boolean` | `false` | Show loading state |
| `outlined` | `boolean` | `false` | Outlined border style |
| `underlined` | `boolean` | `false` | Bottom border only |
| `rounded` | `boolean` | `false` | Rounded corners |
| `tile` | `boolean` | `false` | No border radius |
| `hideHeader` | `boolean` | `false` | Hide the header row |
| `hideVerticalBorders` | `boolean` | `false` | Remove column borders |
| `hideTopBottomBorders` | `boolean` | `false` | Remove outer top/bottom borders |
| `hidePagination` | `boolean` | `false` | Hide pagination controls |
| `stickyHeader` | `boolean` | `false` | Fix header on scroll |
| `multiSort` | `boolean` | `false` | Allow sorting by multiple columns |
| `groupBy` | `string \| string[]` | `undefined` | Group rows by column key(s) |
| `selected` | `T[]` | `undefined` | Selected rows (use with `v-model:selected`) |
| `expanded` | `T[]` | `undefined` | Expanded rows (use with `v-model:expanded`) |
| `singleSelect` | `boolean` | `false` | Allow only one row selected at a time |
| `singleExpand` | `boolean` | `false` | Allow only one row expanded at a time |
| `shadowExpandedContent` | `boolean` | `false` | Shadow under expanded content |
| `itemKey` | `string` | `'id'` | Unique key field in item objects |
| `totalItems` | `number` | `undefined` | Total item count (for server-side pagination) |
| `itemsPerPageLabel` | `string` | `undefined` | Custom items-per-page label |
| `itemClass` | `TableItemClass<T>` | `undefined` | Dynamic CSS class for rows |
| `itemStyle` | `TableItemStyle<T>` | `undefined` | Dynamic inline styles for rows |
| `itemRowClass` | `TableRowClass<T>` | `undefined` | Class applied to `<tr>` element |
| `itemHeader` | `string` | `undefined` | Key for row header slot |
| `itemFooter` | `string` | `undefined` | Key for row footer slot |
| `stickyLeftColumnsSize` | `number` | `undefined` | Number of sticky columns from left |
| `stickyLeftColumnsStart` | `number` | `undefined` | Start index for sticky left columns |
| `stickyLeftColumnsOffset` | `number` | `undefined` | Offset for sticky left columns |
| `stickyRightColumn` | `boolean` | `false` | Stick the last column to the right |

### TableHeader shape

```typescript
type TableHeader = {
  key: string           // Maps to item property
  title: string         // Column heading text
  sortable?: boolean    // Enable column sorting
  align?: 'start' | 'center' | 'end'
  width?: string | number
  sticky?: boolean      // Stick this column
  colspan?: number      // Header cell colspan
}
```

## Model

- `v-model:selected` — `T[]` of selected rows
- `v-model:expanded` — `T[]` of expanded rows
- `v-model:itemsPerPage` — `number` for pagination

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:options` | `TableOptions` | Sort/pagination changed |

## Slots

| Slot | Description |
|------|-------------|
| `header.{key}` | Custom header cell for column `key` |
| `item.{key}` | Custom body cell for column `key` — receives `{ item, header }` |
| `itemHeader` | Custom row header (pinned above a row) |
| `itemFooter` | Custom row footer (pinned below a row) |
| `expanded` | Expanded row content — receives `{ item }` |
| `group` | Group header row — receives `{ group }` |
| `itemsPerPageLabel` | Custom pagination label |

## Usage

```vue
<script setup lang="ts">
const headers = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'role', title: 'Role' },
  { key: 'actions', title: '', align: 'end' },
]

const items = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
])

const selected = ref([])
</script>

<template>
  <!-- Basic table -->
  <STable :headers="headers" :items="items" />

  <!-- With row selection -->
  <STable
    :headers="headers"
    :items="items"
    v-model:selected="selected"
    item-key="id"
  />

  <!-- Sticky header + dense -->
  <STable
    :headers="headers"
    :items="items"
    sticky-header
    dense
    style="max-height: 400px;"
  />

  <!-- Custom cell rendering -->
  <STable :headers="headers" :items="items">
    <template #item.role="{ item }">
      <SChip :color="item.role === 'Admin' ? 'primary' : 'default'" small>
        {{ item.role }}
      </SChip>
    </template>
    <template #item.actions="{ item }">
      <SButton variant="icon" @click="edit(item)">
        <SIcon icon="mdi-pencil" />
      </SButton>
      <SButton variant="icon" color="error" @click="remove(item)">
        <SIcon icon="mdi-delete" />
      </SButton>
    </template>
  </STable>

  <!-- Expandable rows -->
  <STable
    :headers="headers"
    :items="items"
    v-model:expanded="expanded"
    single-expand
  >
    <template #expanded="{ item }">
      <div class="s_pa__4">
        Expanded detail for {{ item.name }}
      </div>
    </template>
  </STable>

  <!-- Grouped -->
  <STable :headers="headers" :items="items" group-by="role" />

  <!-- Multi-sort -->
  <STable :headers="headers" :items="items" multi-sort />
</template>
```

## Notes

- Use `item-key` to specify the unique identifier field; defaults to `'id'`.
- For server-side pagination, listen to `@update:options` and provide `total-items`.
- Slot names for `item.{key}` use the `key` from your `headers` array.
- Sticky columns require explicit `width` defined in the `headers` config.
