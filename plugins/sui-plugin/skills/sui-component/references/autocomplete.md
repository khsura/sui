# SAutocomplete

**Import:** `import { SAutocomplete } from '@khsura/sui'`

Searchable dropdown input with filtering, multiple selection, chips, free-text entries and async search.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsAutocomplete.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` (`v-model`) | `string \| number \| null` (or an array of them when `multiple`) | `undefined` | Selected item `value`(s) |
| `items` | `SelectItem[] \| string[]` | `undefined` | Options |
| `multiple` | `boolean` | `false` | Multi-select; model becomes an array |
| `chips` | `boolean` | `false` | Show selected items as chips |
| `closableChips` | `boolean` | `false` | × icon on each selected item (works with or without `chips`) |
| `allowUnlisted` | `boolean` | `false` | Allow typed values not in `items`; adds an `Add "…"` row and emits `createItem` |
| `filterMode` | `'start' \| 'contains' \| 'exact' \| 'none'` | `'contains'` | Built-in, case-insensitive filter |
| `filter` | `(item: SelectItem, queryText: string) => boolean` | `undefined` | Custom filter (overrides `filterMode` unless it is `'none'`) |
| `debounce` | `number` (ms) | `500` | Delay before `searchItem` is emitted |
| `delimiter` | `string \| string[] \| RegExp` | `undefined` | Keys that commit the typed text (like Enter) |
| `loading` | `boolean` | `false` | Show a spinner (hides the clear button) |
| `clearable` | `boolean` | `false` | Clear button when a value is set |
| `divided` | `boolean` | `false` | Dividers between list items |
| `dense` | `boolean` | `false` | Dense list |
| `label` | `string \| null` | `undefined` | Label above the field |
| `id` | `string` | auto | Input id (label `for`) |
| `hideDetails` | `boolean` | `undefined` | Hide the label |
| `placeholder` | `string` | `undefined` | Input placeholder |
| `autocomplete` | `'on' \| 'off'` | `undefined` | Native `autocomplete` attribute |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |
| `location` | `LocationRaw` | `'bottom'` | Dropdown position (flips automatically) |
| `offsetX` / `offsetY` | `number \| null` | `undefined` | Dropdown offset |

`name` and `disabled` are typed but have no effect (see Gotchas). There is **no `rules` prop**.

```ts
interface SelectItem {
  text: string                          // displayed text
  value: string | number | null | undefined
  disabled?: boolean
}
// string[] items use the string as both text and value
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | value or value[] | Selection changed |
| `searchItem` (`@search-item`) | `string` | Current query, `debounce` ms after the last keydown — use for async search |
| `createItem` (`@create-item`) | `SelectItem` | An unlisted value was added (`allowUnlisted`) |

## Usage

```vue
<!-- Basic -->
<SAutocomplete v-model="city" :items="cities" label="City" placeholder="Search…" />
<!-- cities: [{ text: 'New York', value: 'nyc' }]; city === 'nyc' -->

<!-- Multiple with closable chips -->
<SAutocomplete v-model="tags" :items="allTags" multiple chips closable-chips />

<!-- Async server-side search -->
<SAutocomplete
  v-model="userId"
  :items="userResults"
  :loading="isSearching"
  filter-mode="none"
  :debounce="300"
  @search-item="searchUsers"
/>

<!-- Free-text tags, comma commits -->
<SAutocomplete
  v-model="labels"
  :items="knownLabels"
  multiple
  chips
  allow-unlisted
  delimiter=","
  @create-item="item => saveLabel(item.text)"
/>
```

```ts
const searchUsers = async (query: string) => {
  if (!query) return
  isSearching.value = true
  userResults.value = await api.searchUsers(query) // map to { text, value }
  isSearching.value = false
}
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `@update:search-input="…"` | `@search-item="…"` — `update:search-input` is never emitted |
| `{ title: 'New York', value: 'nyc' }` | `{ text: 'New York', value: 'nyc' }` |
| `:rules="[…]"` inside `SForm` | Not supported — SAutocomplete does not register with `SForm`; validate the model yourself |
| `disabled` to lock the field | Has no effect on the input; render read-only text or a disabled `SSelect` instead |
| `name="country"` for native forms | Input name is always `autocomplete`; submit the model value yourself |
| Debouncing `@search-item` again | It is already debounced (`debounce`, default 500 ms) |

- Single mode: typing text that doesn't match an item exactly and blurring **clears** the model (unless `allowUnlisted`).
- Single mode, no chips: the selected item's text is shown in the input itself.
- Selected items keep their labels when `items` is replaced (async results), so chips don't go blank.
- Toggling `multiple` at runtime drops a single value when switching back to single mode.
