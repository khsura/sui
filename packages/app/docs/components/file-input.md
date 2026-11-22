# SFileInput

**Import:** `import { SFileInput, getFileInputRules } from '@khsura/sui'`

A file picker built like SInput: a label, a field box that shows the chosen files (names, chips or a count) and the error line. It renders a real `<input type="file">` laid invisibly over the field, so a click anywhere on the field, Tab, Enter and Space all reach the browser's own picker. `variant="dropzone"` turns the field into a large dashed area that also takes files dragged onto it (it uses `SDroppable`).

Live examples: [SFileInput in Storybook](https://sui.surakh.com/?path=/docs/ui-components-fileinput--docs)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` (`v-model`) | `File[] \| null` | `undefined` | The chosen files. Always an array, even without `multiple`; `null` after clearing |
| `label` | `string` | `undefined` | Label above the field, tied to the input. With `hideDetails` it is hidden and becomes the `aria-label` (as in SInput) |
| `placeholder` | `string` | `undefined` | Text in the field while no file is chosen |
| `ariaLabel` | `string` | `undefined` | Accessible name without a visible label; wins over `label` |
| `ariaLabelledby` | `string` | `undefined` | Id of the element that names the input |
| `name` | `string` | `undefined` | The native input's `name`, for a plain form submit |
| `multiple` | `boolean` | `false` | Allow several files |
| `accept` | `string` | `undefined` | Allowed types: `.csv,.xlsx`, `image/*`, `application/pdf`. The picker filters by it; dropped files that do not match are left out and emitted in `reject` |
| `display` | `'names' \| 'chips' \| 'count'` | `'names'` | How the files are shown. `count` shows `countText` for two or more files and the name for one |
| `variant` | `'input' \| 'dropzone'` | `'input'` | A text-field box, or a drop area |
| `clearable` | `boolean` | `false` | Show a clear button while files are chosen |
| `clearAriaLabel` | `string` | `'Clear'` | Accessible name of the clear button |
| `showSize` | `boolean` | `false` | Show each file's size, such as `report.csv (1.5 KB)` |
| `loading` | `boolean` | `false` | Show a spinner and block picking and dropping (`aria-busy`) |
| `loadingAriaLabel` | `string` | `'Loading'` | Accessible name of the spinner |
| `countText` | `string` | `'{count} files'` | The `count` display text; `{count}` is replaced |
| `dropText` | `string` | `'Drop files here or click to browse'` | The drop zone's call to action |
| `icon` | `string` | `'mdi-paperclip'` / `'mdi-cloud-upload-outline'` | Icon per variant; `''` hides it |
| `dense` | `boolean` | `false` | Smaller paddings |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Text size, as SInput |
| `rules` | `FormInputModelValueRule[]` | `undefined` | Validation rules; see `getFileInputRules` below |
| `error` | `boolean` | `false` | Force the error look |
| `hideDetails` | `boolean` | `false` | Hide the label and the error line |
| `hideError` | `boolean` | `false` | Hide only the error line |
| `disabled` | `boolean` | `false` | Disable the field |
| `readonly` | `boolean` | `false` | Keep the files shown but block picking, dropping and clearing |
| `id` | `string` | generated | The input's id |
| `density` | `'default' \| 'comfortable' \| 'compact'` | `undefined` (acts as `'default'`) | Vertical density: `comfortable` / `compact` lower the field by 4 / 8px, matching SButton. Defaults to `defaults.global.density`; see docs/density.md (not the dropzone) |

## Slots

None.

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `File[] \| null` | The files changed |
| `change` | `File[] \| null` | The files changed (the files, not a DOM event) |
| `reject` | `File[]` | Files left out: a dropped file that does not match `accept`, or the extra files without `multiple` |
| `clear` | — | The clear button emptied the field |
| `update:error`, `update:errors`, `update:dirty` | as SInput | Validation state |

Exposed: `validate()` and `clear()`.

## Rules helper

`getFileInputRules(options)` returns rules for the `rules` prop. Every option is optional:

| Option | Type | Check |
|--------|------|-------|
| `required` | `boolean` | At least one file |
| `maxSize` | `number` (bytes) | No file is larger: `5 * 1024 * 1024` for 5 MB |
| `accept` | `string` | Every file matches the `accept` format (a dropped file skips the picker's filter) |
| `maxFiles` | `number` | At most this many files |
| `messages` | `{ required, tooLarge, wrongType, tooMany }` | Functions that return your own (translated) texts |

The texts that name a file are HTML-escaped, because the error line renders HTML. `getIsFileAccepted(file, accept)` and `formatFileSize(bytes)` are exported too.

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SFileInput, getFileInputRules } from '@khsura/sui'

const accept = '.csv,.xlsx'
const workbook = ref<File[] | null>(null)
const rules = getFileInputRules({ required: true, accept, maxSize: 5 * 1024 * 1024 })
</script>

<template>
  <!-- A spreadsheet import -->
  <SFileInput v-model="workbook" label="Employee workbook" :accept="accept" :rules="rules" show-size clearable />

  <!-- The same as a drop area -->
  <SFileInput v-model="workbook" variant="dropzone" label="Employee workbook" :accept="accept" :rules="rules"
    drop-text="Drop a .csv or .xlsx file, or click to browse" />

  <!-- Parse right after picking: the change event passes the files -->
  <SFileInput label="Attendance sheet" :accept="accept" :loading="previewing" @change="(files) => preview(files?.[0])" />
</template>
```

An image with a preview: keep the preview outside (an `SAvatar` or `SImage` with `URL.createObjectURL(files[0])`) and use SFileInput only to pick.

## Accessibility

- A real `<input type="file">`, named by the `label` (`for`/`id`), `ariaLabel` or `ariaLabelledby`. With `hideDetails` the label becomes its `aria-label`.
- One Tab stop (plus the clear button). Enter and Space open the picker in every browser. The focus ring (`focusRing` colour) is drawn on the field box under `:focus-visible`.
- The chosen file name, or `3 files`, is announced through a visually hidden `role="status"` element.
- A rule error sets `aria-invalid` and points `aria-describedby` at the error line.
- Dark mode: all colours come from the theme.

## Notes

- The model is always `File[] | null`, never a single `File`: read `files?.[0]` for one file.
- `@change` passes the files, not an `Event`: `$event.target.files` is `undefined`.
- Do not hide an `<input type="file">` and open it from an `SButton` with `ref.click()`: the hidden input has no label, ignores `rules` and shows no file name. Use SFileInput (`variant="dropzone"` for a larger target).
- Long file names truncate with an ellipsis; the field never grows past its parent, so it fits a 375px screen and shares an `SFormRow` line with a button.
- Setting the model to `null` resets the native input, so picking the same file again fires `change`.
- No Vuetify-only props: `chips` is `display="chips"`, `counter` is `display="count"`, `prepend-icon` is `icon`.
