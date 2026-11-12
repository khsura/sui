# SAutocomplete

**Import:** `import { SAutocomplete } from '@khsura/sui'`

Searchable dropdown input with filtering, multiple selection, chips, free-text entries and async support.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SelectItem[] \| string[]` | `undefined` | Available options (a string is used as both `text` and `value`) |
| `modelValue` | `string \| number \| null` (array when `multiple`) | `undefined` | Selected value(s) |
| `multiple` | `boolean` | `false` | Allow selecting multiple items; the model becomes an array |
| `chips` | `boolean` | `false` | Display selected items as chips |
| `closableChips` | `boolean` | `false` | × icon on each selected item (works with or without `chips`) |
| `allowUnlisted` | `boolean` | `false` | Allow typed values not in `items` (used as both `text` and `value`); emits `createItem` |
| `label` | `string \| null` | `undefined` | Label above the field, tied to its input |
| `id` | `string` | generated | Input id (the label's `for`) |
| `hideDetails` | `boolean` | `undefined` | Hide the label |
| `placeholder` | `string` | `undefined` | Input placeholder text |
| `loading` | `boolean` | `false` | Show loading indicator (async search) |
| `clearable` | `boolean` | `false` | Show clear button when a value is set |
| `divided` | `boolean` | `false` | Dividers between dropdown items |
| `dense` | `boolean` | `false` | Dense list |
| `filterMode` | `'start' \| 'contains' \| 'exact' \| 'none'` | `'contains'` | Built-in, case-insensitive filter behavior |
| `filter` | `(item: SelectItem, queryText: string) => boolean` | `undefined` | Custom filter function (overrides `filterMode` unless it is `'none'`) |
| `debounce` | `number` | `500` | Delay in ms before `searchItem` is emitted |
| `delimiter` | `string \| string[] \| RegExp` | `undefined` | Keys that commit the typed text (like Enter) |
| `autocomplete` | `'on' \| 'off'` | `undefined` | Native `autocomplete` attribute |
| `name` | `string` | `undefined` | Typed but ignored — the input's name is always `autocomplete` |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |
| `disabled` | `boolean` | `undefined` | Typed but does not disable the text field |
| `location` | `string` | `'bottom'` | Dropdown position |
| `offsetX` / `offsetY` | `number \| null` | `undefined` | Dropdown offset |

There is no `rules` prop: SAutocomplete does not run validation rules or register with `SForm`.

### SelectItem shape

```typescript
interface SelectItem {
  text: string                               // Displayed text
  value: string | number | null | undefined  // Stored value
  disabled?: boolean
}
```

## Model

`v-model` — single value or array (when `multiple`).

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | value or value[] | Selection changed |
| `searchItem` (`@search-item`) | `string` | Current query, `debounce` ms after the last keystroke — use for async search |
| `createItem` (`@create-item`) | `SelectItem` | An unlisted value was added (`allowUnlisted`) |

## Usage

```vue
<!-- Basic searchable select -->
<SAutocomplete
  v-model="country"
  :items="countries"
  label="Country"
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
  :debounce="300"
  placeholder="Search users..."
  @search-item="searchUsers"
/>

<!-- Custom filter (case-insensitive starts-with) -->
<SAutocomplete
  v-model="selected"
  :items="items"
  :filter="(item, q) => item.text.toLowerCase().startsWith(q.toLowerCase())"
/>

<!-- Free-text tags, comma commits -->
<SAutocomplete
  v-model="labels"
  :items="knownLabels"
  multiple
  chips
  allow-unlisted
  delimiter=","
  @create-item="(item) => saveLabel(item.text)"
/>

<!-- With objects -->
<SAutocomplete
  v-model="selectedCity"
  :items="cities"
  placeholder="Select city"
/>
<!-- cities: [{ text: 'New York', value: 'nyc' }, ...] -->
<!-- selectedCity will be the value ('nyc'), not the full object -->
```

```typescript
// Async search example — `searchItem` is already debounced
const searchUsers = async (query: string) => {
  if (!query) return
  isSearching.value = true
  userResults.value = await api.searchUsers(query) // map to { text, value }
  isSearching.value = false
}
```

## Notes

- When `multiple: false`, `v-model` is the selected item's `value` (not the full `SelectItem`).
- When `multiple: true`, `v-model` is an array of selected `value`s.
- For async filtering, set `filter-mode="none"` to disable built-in filtering and handle it server-side via `@search-item`. `update:search-input` is never emitted.
- In single mode, typed text that doesn't match an item and is then blurred **clears** the value (unless `allowUnlisted`).
- `disabled` does not disable the text field, and `name` is ignored.
