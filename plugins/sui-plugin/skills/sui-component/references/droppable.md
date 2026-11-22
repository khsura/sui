# SDroppable

**Import:** `import { SDroppable } from '@khsura/sui'`

Drag-and-drop drop zone (files or any dragged content). Renders a plain `<div>` you style yourself.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsDroppable.d.ts`

<!-- generated:api:start SDroppable -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SDroppable props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean \| null` | — | no | — |
| `height` | `number \| string \| null` | — | no | — |
| `maxHeight` | `number \| string \| null` | — | no | — |
| `maxWidth` | `number \| string \| null` | — | no | — |
| `minHeight` | `number \| string \| null` | — | no | — |
| `minWidth` | `number \| string \| null` | — | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `width` | `number \| string \| null` | — | no | — |

**SDroppable slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{ class: string; attrs: { isDraggingOver: boolean; disabled: boolean \| null \| undefined; supportsDragAndDrop: boolean; }; isDraggingOver: boolean; disabled: boolean \| null \| undefined; supportsDragAndDrop: boolean; }` |

**SDroppable events**

| Event | Payload |
| --- | --- |
| `drop` | `[value: DragEvent]` |

<!-- generated:api:end SDroppable -->

**SDroppable notes**

- `disabled`: Stop emitting `drop` and keep `isDraggingOver` false
- `readonly`: Typed (shared prop) but has no effect
- `width` / `height`: Size (numbers → px)
- `minWidth` / `maxWidth`: Width limits
- `minHeight` / `maxHeight`: Height limits
- `drop` (event): Content dropped (not emitted when `disabled` or the browser lacks DnD support)
- `default` (slot): Drop-zone content. `attrs` bundles the other three

## Default slot scope

| Property | Type | Description |
|----------|------|-------------|
| `isDraggingOver` | `boolean` | A drag is over the zone (always `false` when disabled) |
| `disabled` | `boolean` | Current `disabled` prop |
| `supportsDragAndDrop` | `boolean` | Browser supports the DnD API |

## Usage

```vue
<script setup lang="ts">
const handleDrop = (event: DragEvent) => {
  const files = Array.from(event.dataTransfer?.files ?? [])
  uploadFiles(files)
}
</script>

<template>
  <SDroppable :height="200" @drop="handleDrop">
    <template #default="{ isDraggingOver, supportsDragAndDrop }">
      <div
        v-if="supportsDragAndDrop"
        style="border: 2px dashed; border-radius: 8px; height: 100%;"
      >
        <SIcon icon="mdi-cloud-upload" :color="isDraggingOver ? 'primary' : undefined" />
        <p>{{ isDraggingOver ? 'Release to upload' : 'Drag & drop files here' }}</p>
      </div>
      <input v-else type="file" multiple @change="handleFileInput" />
    </template>
  </SDroppable>
</template>
```

## Gotchas

- The drop zone has no built-in look: draw the border/background yourself. While dragging over it, the root gets class `s_droppable--drag` (opacity 0.6).
- `drop` gives the raw `DragEvent`; read `event.dataTransfer?.files`. Default browser handling (opening the file) is already prevented.
- There is no click-to-upload — add your own `<input type="file">` or button.
- No `accept`/file-type filtering: validate files in your `drop` handler.
