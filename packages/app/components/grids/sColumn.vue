<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { type PropsColumn } from '@/app/definitions'
import { useColumnService, useComponentDefaultsService } from '@/app/services'

const rawProps = defineProps<PropsColumn>()
const props = useComponentDefaultsService('SColumn', rawProps)
const { classListColumn } = useColumnService(props)

const classList = computed(() => {
  return {
    s_column: true,
    ...classListColumn.value,
  }
})
</script>
