<template>
  <Component :is="tagName" class="s_toolbarItem"></Component>
</template>
<script setup lang="ts">
import { propsTag } from '@sui/app/props'
import { useTagService } from '@sui/app/services'

const props = defineProps({
  ...propsTag(),
})

const { tagName } = useTagService(props)
</script>
