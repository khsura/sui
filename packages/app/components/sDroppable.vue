<template>
  <div
    class="s_droppable"
    :class="{
      's_droppable--drag': isDraggingOver,
    }"
    :style="styleList"
    :draggable="!disabled"
    @dragover.prevent
    @drop.prevent="drop"
    @dragenter.prevent="dragEnter"
    @dragleave.prevent="dragLeave"
  >
    <slot
      :attrs="{ isDraggingOver, disabled, supportsDragAndDrop }"
      :is-dragging-over="isDraggingOver"
      :disabled="disabled"
      :supports-drag-and-drop="supportsDragAndDrop"
      class="s_droppable__content"
    ></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { hasDragDropFeature } from '@/app/lib/browser'
import type { PropsDroppable } from '@/app/definitions'
import { useComponentDefaultsService, useMeasurableStylesService } from '@/app/services'

const rawProps = defineProps<PropsDroppable>()
const props = useComponentDefaultsService('SDroppable', rawProps)
const emit = defineEmits<(event: 'drop', value: DragEvent) => void>()
const supportsDragAndDrop = hasDragDropFeature()
const counter = ref(0)
const { measurableStyles } = useMeasurableStylesService(props)

const drop = (event: DragEvent) => {
  counter.value = 0

  if (!props.disabled && supportsDragAndDrop) {
    emit('drop', event)
  }
}

const styleList = computed(() => {
  return {
    ...measurableStyles.value,
  }
})

const dragEnter = (_event: DragEvent) => {
  if (supportsDragAndDrop) {
    counter.value = Math.max(0, counter.value + 1)
  }
}

const dragLeave = (_event: DragEvent) => {
  if (supportsDragAndDrop) {
    counter.value = Math.max(0, counter.value - 1)
  }
}

const isDraggingOver = computed(() => !props.disabled && counter.value > 0)
</script>
<style lang="scss">
.s_droppable {
  &--drag {
    opacity: 0.6;
  }

  &__content {
    pointer-events: none;
    user-select: none;
  }
}
</style>
