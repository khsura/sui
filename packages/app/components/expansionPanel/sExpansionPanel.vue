<template>
  <div class="s_expansionPanel">
    <slot :is-expanded="isExpanded"></slot>
  </div>
</template>
<script setup lang="ts">
import type { PropsGroupItem } from '@khsura/sui/definitions'
import { useExpandableService } from '@khsura/sui/services'

const props = defineProps<PropsGroupItem<number>>()
const { isExpanded } = useExpandableService(props)
</script>
