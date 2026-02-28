# SDroppable

**Import:** `import { SDroppable } from '@khsura/sui'`

Drag-and-drop file/content drop zone.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disable drop functionality |
| `width` | `string \| number` | `undefined` | Drop zone width |
| `height` | `string \| number` | `undefined` | Drop zone height |
| `maxWidth` | `string \| number` | `undefined` | Max width |
| `maxHeight` | `string \| number` | `undefined` | Max height |
| `minWidth` | `string \| number` | `undefined` | Min width |
| `minHeight` | `string \| number` | `undefined` | Min height |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `drop` | `DragEvent` | Fired when files/content are dropped |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ isDraggingOver, disabled, supportsDragAndDrop }` | Drop zone content |

### Scoped slot data

| Property | Type | Description |
|----------|------|-------------|
| `isDraggingOver` | `boolean` | `true` when a drag is hovering over the zone |
| `disabled` | `boolean` | Whether the drop zone is disabled |
| `supportsDragAndDrop` | `boolean` | Whether the browser supports DnD API |

## Usage

```vue
<script setup lang="ts">
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
        <p>{{ isDraggingOver ? 'Drop files here' : 'Drag & drop files or click to upload' }}</p>
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

- The `drop` event provides the raw `DragEvent` — use `event.dataTransfer.files` to access dropped files.
- Always provide visual feedback using `isDraggingOver` so users know when they're hovering over the zone.
- Combine with `SButton` or `<input type="file">` for click-to-upload fallback.
