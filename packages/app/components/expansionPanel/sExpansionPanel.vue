<template>
  <div class="s_expansionPanel">
    <slot :is-expanded="isExpanded"></slot>
  </div>
</template>
<script setup lang="ts">
import { propsGroupItem } from '~/props'
import { useExpandableService } from '~/services'

const props = defineProps({
  ...propsGroupItem<number>(),
})

const { isExpanded } = useExpandableService(props)
</script>
