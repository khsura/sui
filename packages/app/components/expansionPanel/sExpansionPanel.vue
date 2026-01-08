<template>
  <div class="s_expansionPanel">
    <slot :is-expanded="isExpanded"></slot>
  </div>
</template>
<script setup lang="ts">
import type { PropsGroupItem } from '@/app/definitions'
import { useExpandableService } from '@/app/services'

const props = defineProps<PropsGroupItem<number>>()
const { isExpanded } = useExpandableService(props)
</script>
