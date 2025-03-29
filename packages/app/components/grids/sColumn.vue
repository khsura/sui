<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { propsColumn } from '~/props'
import { useColumnService } from '~/services'

const props = defineProps(propsColumn())
const { classListColumn } = useColumnService(props)

const classList = computed(() => {
  return {
    s_column: true,
    ...classListColumn.value,
  }
})
</script>
