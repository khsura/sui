<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { type PropsColumn } from '@khsura/sui/definitions'
import { useColumnService } from '@khsura/sui/services'

const props = defineProps<PropsColumn>()
const { classListColumn } = useColumnService(props)

const classList = computed(() => {
  return {
    s_column: true,
    ...classListColumn.value,
  }
})
</script>
