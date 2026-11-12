# SDroppable

**Import:** `import { SDroppable } from '@khsura/sui'`

Drag-and-drop file/content drop zone. Renders a plain `<div>` with no built-in look — style it yourself.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean \| null` | `undefined` | Stop emitting `drop` and keep `isDraggingOver` false |
| `readonly` | `boolean \| null` | `undefined` | Accepted (shared prop) but has no effect |
| `width` | `string \| number \| null` | `undefined` | Drop zone width (number = px) |
| `height` | `string \| number \| null` | `undefined` | Drop zone height (number = px) |
| `maxWidth` | `string \| number \| null` | `undefined` | Max width |
| `maxHeight` | `string \| number \| null` | `undefined` | Max height |
| `minWidth` | `string \| number \| null` | `undefined` | Min width |
| `minHeight` | `string \| number \| null` | `undefined` | Min height |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `drop` | `DragEvent` | Fired when files/content are dropped (not when `disabled` or the browser lacks DnD support) |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ isDraggingOver, disabled, supportsDragAndDrop, attrs }` | Drop zone content (`attrs` bundles the other three) |

### Scoped slot data

| Property | Type | Description |
|----------|------|-------------|
| `isDraggingOver` | `boolean` | `true` when a drag is hovering over the zone (always `false` when disabled) |
| `disabled` | `boolean` | Whether the drop zone is disabled |
| `supportsDragAndDrop` | `boolean` | Whether the browser supports DnD API |

## Usage

```vue
<script setup lang="ts">
import { SDroppable, SIcon } from '@khsura/sui'

const handleDrop = (event: DragEvent) => {
  const files = Array.from(event.dataTransfer?.files ?? [])
  uploadFiles(files)
}
</script>

<template>
  <!-- File upload drop zone -->
  <SDroppable @drop="handleDrop" :height="200">
    <template #default="{ isDraggingOver }">
      <div
        class="drop-zone s_pa__8 s_text--center"
        :class="{ 'drop-zone--active': isDraggingOver }"
        style="border: 2px dashed; border-radius: 8px; height: 100%;"
      >
        <SIcon
          icon="mdi-cloud-upload"
          :color="isDraggingOver ? 'primary' : 'grey'"
          size="extra"
        />
        <p>{{ isDraggingOver ? 'Drop files here' : 'Drag & drop files here' }}</p>
      </div>
    </template>
  </SDroppable>

  <!-- Disabled drop zone -->
  <SDroppable disabled>
    <template #default="{ disabled }">
      <div :class="{ 'opacity-50': disabled }">
        Drop zone (disabled)
      </div>
    </template>
  </SDroppable>

  <!-- With browser support check -->
  <SDroppable @drop="handleDrop">
    <template #default="{ isDraggingOver, supportsDragAndDrop }">
      <div v-if="supportsDragAndDrop">
        Drop files here
      </div>
      <div v-else>
        <!-- Fallback for unsupported browsers -->
        <input type="file" multiple @change="handleFileInput" />
      </div>
    </template>
  </SDroppable>
</template>
```

## Notes

- The `drop` event provides the raw `DragEvent` — use `event.dataTransfer?.files` to access dropped files. The browser's default handling (opening the file) is already prevented.
- Always provide visual feedback using `isDraggingOver`. While dragging over, the root also gets class `s_droppable--drag` (opacity 0.6).
- There is no click-to-upload — combine with `SButton` or `<input type="file">` yourself.
- There is no `accept` / file-type filtering — validate files in your `drop` handler.
