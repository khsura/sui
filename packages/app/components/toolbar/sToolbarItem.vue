<template>
  <Component :is="tagName" class="s_toolbarItem"></Component>
</template>
<script setup lang="ts">
import type { PropsTag } from '@/app/definitions'
import { useTagService } from '@/app/services'

const props = defineProps<PropsTag>()
const { tagName } = useTagService(props)
</script>
