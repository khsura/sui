<template>
  <Component :is="tagName" class="s_toolbarItem"></Component>
</template>
<script setup lang="ts">
import { propsTag } from '@khsura/sui/props'
import { useTagService } from '@khsura/sui/services'

const props = defineProps({
  ...propsTag(),
})

const { tagName } = useTagService(props)
</script>
