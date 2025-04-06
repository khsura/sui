<template>
  <Component :is="tagName" class="s_toolbarItem"></Component>
</template>
<script setup lang="ts">
import type { PropsTag } from '@khsura/sui/definitions'
import { useTagService } from '@khsura/sui/services'

const props = defineProps<PropsTag>()
const { tagName } = useTagService(props)
</script>
