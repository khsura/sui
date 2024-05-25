<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { propsColumn } from '@khsura/sui/props'
import { useColumnService } from '@khsura/sui/services'
import { computed } from 'vue'

const props = defineProps(propsColumn())
const { classListColumn } = useColumnService(props)

const classList = computed(() => {
  return {
    s_column: true,
    ...classListColumn.value,
  }
})
</script>
