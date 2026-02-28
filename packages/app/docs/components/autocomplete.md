# SAutocomplete

**Import:** `import { SAutocomplete } from '@khsura/sui'`

Searchable dropdown input with filtering, multiple selection, chips, and async support.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SelectItem[] \| string[]` | `[]` | Available options |
| `modelValue` | `any \| any[]` | `undefined` | Selected value(s) |
| `multiple` | `boolean` | `false` | Allow selecting multiple items |
| `chips` | `boolean` | `false` | Display selected items as chips |
| `closableChips` | `boolean` | `false` | Allow removing chips individually |
| `placeholder` | `string` | `undefined` | Input placeholder text |
| `loading` | `boolean` | `false` | Show loading indicator (async search) |
| `clearable` | `boolean` | `false` | Show clear all button |
| `divided` | `boolean` | `false` | Dividers between dropdown items |
| `dense` | `boolean` | `false` | Compact height |
| `filterMode` | `'start' \| 'contains' \| 'exact' \| 'none'` | `'contains'` | Built-in filter behavior |
| `filter` | `(item: SelectItem, queryText: string) => boolean` | `undefined` | Custom filter function (overrides `filterMode`) |
| `debounce` | `number` | `undefined` | Input debounce delay in ms |
| `delimiter` | `string \| string[] \| RegExp` | `undefined` | Split input into multiple values by delimiter |
| `autocomplete` | `'on' \| 'off'` | `undefined` | Browser autocomplete hint |
| `name` | `string` | `undefined` | Input name attribute |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |
| `disabled` | `boolean` | `false` | Disable input |
| `location` | `string` | `'bottom'` | Dropdown position |
| `offsetX` / `offsetY` | `number` | `null` | Dropdown offset |

### SelectItem shape

```typescript
type SelectItem = {
  title: string  // Displayed text
  value: any     // Stored value
}
```

## Model

`v-model` — single value or array (when `multiple`).

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:search-input` | `string` | Fired on each keystroke — use for async search |

## Usage

```vue
<!-- Basic searchable select -->
<SAutocomplete
  v-model="country"
  :items="countries"
  placeholder="Search country..."
/>

<!-- Multiple selection with chips -->
<SAutocomplete
  v-model="selectedTags"
  :items="allTags"
  multiple
  chips
  closable-chips
  placeholder="Add tags..."
/>

<!-- Async server-side search -->
<SAutocomplete
  v-model="selectedUser"
  :items="userResults"
  :loading="isSearching"
  filter-mode="none"
  placeholder="Search users..."
  @update:search-input="searchUsers"
/>

<!-- Custom filter (case-insensitive starts-with) -->
<SAutocomplete
  v-model="selected"
  :items="items"
  :filter="(item, q) => item.title.toLowerCase().startsWith(q.toLowerCase())"
/>

<!-- With objects -->
<SAutocomplete
  v-model="selectedCity"
  :items="cities"
  placeholder="Select city"
/>
<!-- cities: [{ title: 'New York', value: 'nyc' }, ...] -->
<!-- selectedCity will be the value ('nyc'), not the full object -->
```

```typescript
// Async search example
const searchUsers = debounce(async (query: string) => {
  if (!query) return
  isSearching.value = true
  userResults.value = await api.searchUsers(query)
  isSearching.value = false
}, 300)
```

## Notes

- When `multiple: false`, `v-model` is the selected item's `value` (not the full `SelectItem`).
- When `multiple: true`, `v-model` is an array of selected `value`s.
- For async filtering, set `filter-mode="none"` to disable built-in filtering and handle it server-side via `@update:search-input`.
- `closableChips` requires `chips` to be enabled.
