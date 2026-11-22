# SFileInput

**Import:** `import { SFileInput, getFileInputRules } from '@khsura/sui'`

A file picker built like SInput (label, field box, error line, `rules`) over a real, invisible `<input type="file">`. Shows the chosen files as names, chips or a count. `variant="dropzone"` makes a large drop area that also takes dragged files.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsFileInput.d.ts`

Docs: https://sui.surakh.com/?path=/docs/ui-components-fileinput--docs

<!-- generated:api:start SFileInput -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SFileInput props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `accept` | `string` | — | no | — | Allowed types in the native format: `.csv,.xlsx`, `image/*`, `application/pdf`. Dropped files that do not match are rejected (the `reject` event). |
| `ariaLabel` | `string` | — | no | — | Accessible name when there is no visible `label`; wins over `label`. |
| `ariaLabelledby` | `string` | — | no | — | Id of the element that names the file input. |
| `clearAriaLabel` | `string` | `"Clear"` | no | — | Accessible name of the clear button. |
| `clearable` | `boolean` | — | no | — | Show a button that clears the chosen files. |
| `countText` | `string` | `"{count} files"` | no | — | The `count` display text for several files; `{count}` is replaced by the number. |
| `dense` | `boolean` | — | no | — | Smaller paddings, as SInput's `dense`. |
| `dirty` | `boolean` | — | no | — | — |
| `disabled` | `boolean \| null` | — | no | — | — |
| `display` | `"chips" \| "count" \| "names"` | `"names"` | no | `chips`, `count`, `names` | How the chosen files are shown: their names, one chip each, or a count such as `3 files`. |
| `dropText` | `string` | `"Drop files here or click to browse"` | no | — | The `dropzone` variant's call to action. |
| `error` | `boolean` | — | no | — | — |
| `hideDetails` | `boolean` | — | no | — | — |
| `hideError` | `boolean` | — | no | — | — |
| `icon` | `string` | — | no | — | Material Design icon before the selection (`input`) or above the text (`dropzone`); `''` hides it. |
| `id` | `string` | — | no | — | — |
| `label` | `string` | — | no | — | Visible label above the field, tied to the file input. With `hideDetails` it is hidden and becomes the `aria-label`, as in SInput. |
| `loading` | `boolean` | — | no | — | Show a spinner and block picking, e.g. while the chosen file uploads or is parsed. |
| `loadingAriaLabel` | `string` | `"Loading"` | no | — | Accessible name of the loading spinner. |
| `modelValue` | `File[] \| null` | — | no | — | — |
| `multiple` | `boolean` | — | no | — | Allow several files. The model is always a `File[]` (or `null` when empty), even for one file. |
| `name` | `string` | — | no | — | The native input's `name`, so a plain `<form>` submit sends the files. |
| `placeholder` | `string` | — | no | — | Text shown in the field while no file is chosen. |
| `readonly` | `boolean \| null` | — | no | — | — |
| `rules` | `FormInputModelValueRule[]` | — | no | — | — |
| `showSize` | `boolean` | — | no | — | Show each file's size next to its name. |
| `size` | `SizePropertyType` | — | no | `default`, `extra`, `large`, `mini`, `small` | — |
| `variant` | `"dropzone" \| "input"` | `"input"` | no | `dropzone`, `input` | `input`: a text-field box. `dropzone`: a large area that also takes dragged files. |

**SFileInput slots**

None.

**SFileInput events**

| Event | Payload |
| --- | --- |
| `change` | `[File[] \| null]` |
| `clear` | `[]` |
| `reject` | `[File[]]` |
| `update:dirty` | `[boolean]` |
| `update:error` | `[boolean]` |
| `update:errors` | `[string[]]` |
| `update:modelValue` | `[value: File[] \| null \| undefined]` |

<!-- generated:api:end SFileInput -->

**SFileInput notes**

- `v-model`: always `File[] | null` — an array even without `multiple`, `null` after clearing. Read `files?.[0]` for one file.
- `change` (event): passes the files (`File[] | null`), not a DOM event.
- `reject` (event): dropped files that do not match `accept`, or the extra files without `multiple`.
- `rules`: build them with `getFileInputRules({ required, maxSize, accept, maxFiles, messages })`; `maxSize` is in bytes.

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
  <SFileInput v-model="workbook" label="Employee workbook" :accept="accept" :rules="rules" show-size clearable />

  <SFileInput v-model="workbook" variant="dropzone" label="Employee workbook" :accept="accept" :rules="rules" />

  <!-- act right after picking -->
  <SFileInput label="Attendance sheet" :accept="accept" :loading="previewing" @change="(files) => preview(files?.[0])" />
</template>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<input ref="file" type="file" class="hidden">` + `<SButton @click="file?.click()">` | `<SFileInput v-model="files" label="…" accept="…" />` — labelled, keyboard-reachable, runs `rules`, shows the file name |
| `<SInput type="file">` | `<SFileInput>` |
| `<SDroppable>` + your own hidden input for an upload area | `<SFileInput variant="dropzone">` |
| `@change="upload($event.target.files[0])"` | `@change="(files) => upload(files?.[0])"` or `v-model="files"` |
| `const file = ref<File \| null>(null)` + `v-model="file"` | `const files = ref<File[] \| null>(null)`, then `files.value?.[0]` |
| Vuetify `chips` / `counter` / `prepend-icon` / `show-size` | `display="chips"` / `display="count"` / `icon` / `show-size` |
| `:rules="[(f) => f.size < max]"` (the value is an array) | `getFileInputRules({ maxSize: max })` |
| Relying on `accept` to block other types | `accept` filters the picker and drops; still add `getFileInputRules({ accept })` and check on the server |
| A preview image inside the field | Keep the preview outside (`SAvatar` / `SImage` with `URL.createObjectURL(files[0])`) |
