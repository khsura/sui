# SAutocomplete

**Import:** `import { SAutocomplete } from '@khsura/sui'`

Searchable dropdown input with filtering, multiple selection, chips, free-text entries and async search.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsAutocomplete.d.ts`

<!-- generated:api:start SAutocomplete -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SAutocomplete props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activator` | `string \| HTMLElement \| ComponentPublicInstance \| null` | — | no | — |
| `allowUnlisted` | `boolean` | — | no | — |
| `ariaLabel` | `string \| null` | — | no | — |
| `autocomplete` | `string` | `"off"` | no | — |
| `chips` | `boolean` | — | no | — |
| `clearAriaLabel` | `string` | `"Clear"` | no | — |
| `clearable` | `boolean` | — | no | — |
| `closableChips` | `boolean` | — | no | — |
| `closeOnClick` | `boolean` | — | no | — |
| `closeOnContentClick` | `boolean` | — | no | — |
| `closeOnScroll` | `boolean` | — | no | — |
| `contentClass` | `string \| string[] \| Record<string, boolean>` | — | no | — |
| `contentStyle` | `StyleValue` | — | no | — |
| `debounce` | `number` | `500` | no | — |
| `delimiter` | `string \| RegExp \| string[]` | — | no | — |
| `dense` | `boolean` | — | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `divided` | `boolean` | — | no | — |
| `filter` | `((item: SelectItem, queryText: string) => boolean)` | — | no | — |
| `filterMode` | `"start" \| "contains" \| "exact" \| "none"` | `"contains"` | no | `contains`, `exact`, `none`, `start` |
| `height` | `string \| number \| null` | — | no | — |
| `hideDetails` | `boolean` | — | no | — |
| `id` | `string` | — | no | — |
| `items` | `string[] \| SelectItem[]` | — | no | — |
| `label` | `string \| null` | — | no | — |
| `loading` | `boolean` | — | no | — |
| `loadingAriaLabel` | `string` | `"Loading"` | no | — |
| `location` | `LocationRaw` | `"bottom"` | no | — |
| `maxHeight` | `string \| number \| null` | — | no | — |
| `maxWidth` | `string \| number \| null` | — | no | — |
| `minHeight` | `string \| number \| null` | — | no | — |
| `minWidth` | `string \| number \| null` | — | no | — |
| `modelValue` | `(AutocompleteModelType<T> & (AutocompleteModelType<T> \| null))` | — | no | — |
| `multiple` | `T` | — | no | — |
| `name` | `string` | — | no | — |
| `offsetX` | `number \| null` | — | no | — |
| `offsetY` | `number \| null` | — | no | — |
| `onUpdateSearchInput` | `((value: string) => void)` | — | no | — |
| `placeholder` | `string` | — | no | — |
| `position` | `Position` | — | no | `absolute`, `fixed`, `relative`, `static`, `sticky` |
| `preventCloseOnClick` | `boolean` | — | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `screenPadding` | `number \| null` | — | no | — |
| `size` | `SizePropertyType` | — | no | `default`, `extra`, `large`, `mini`, `small` |
| `width` | `string \| number \| null` | — | no | — |

**SAutocomplete slots**

None.

**SAutocomplete events**

| Event | Payload |
| --- | --- |
| `createItem` | `[SelectItem]` |
| `searchItem` | `[string]` |
| `update:modelValue` | `[value: AutocompleteModelType<T> \| null \| undefined]` |

<!-- generated:api:end SAutocomplete -->

**SAutocomplete notes**

- `modelValue` (`v-model`): Selected item `value`(s)
- `items`: Options
- `multiple`: Multi-select; model becomes an array (default: `false`)
- `chips`: Show selected items as chips
- `closableChips`: × icon on each selected item (works with or without `chips`)
- `allowUnlisted`: Allow typed values not in `items`; adds an `Add "…"` row and emits `createItem`
- `filterMode`: Built-in, case-insensitive filter
- `filter`: Custom filter (overrides `filterMode` unless it is `'none'`)
- `debounce`: Delay before `searchItem` is emitted
- `delimiter`: Keys that commit the typed text (like Enter)
- `loading`: Show a spinner (hides the clear button)
- `clearable`: Clear button when a value is set
- `divided`: Dividers between list items
- `dense`: Dense list
- `label`: Label above the field
- `id`: Input id (label `for`) (default: auto)
- `hideDetails`: Hide the label
- `placeholder`: Input placeholder
- `autocomplete`: Native `autocomplete` attribute
- `size`: Input font size, as on `SInput` (`large` 1.25rem, `extra` 1.5rem, never below 16px)
- `location`: Dropdown position (flips automatically)
- `offsetX` / `offsetY`: Dropdown offset
- `update:modelValue` (event): Selection changed
- `searchItem` (`@search-item`) (event): Current query, `debounce` ms after the last keydown — use for async search
- `createItem` (`@create-item`) (event): An unlisted value was added (`allowUnlisted`)

`name` and `disabled` are typed but have no effect (see Gotchas). There is **no `rules` prop**.

```ts
interface SelectItem {
  text: string                          // displayed text
  value: string | number | null | undefined
  disabled?: boolean
}
// string[] items use the string as both text and value
```

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
- The list opens on the roomier side of the field and stays 8px inside the viewport (shifted left near the right edge); no placement workaround needed.
- A long option stays on one line and ends in an ellipsis; its full text is in the option's `title`. No custom item slot needed for long labels.
