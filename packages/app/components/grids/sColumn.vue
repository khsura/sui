<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { type PropsColumn } from '@/app/definitions'
import { useColumnService } from '@/app/services'

const props = defineProps<PropsColumn>()
const { classListColumn } = useColumnService(props)

const classList = computed(() => {
  return {
    s_column: true,
    ...classListColumn.value,
  }
})
</script>
