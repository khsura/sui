<template>
  <Component :is="tagName" class="s_card__actions">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { type PropsTag } from '@/app/definitions'
import { useComponentDefaultsService, useTagService } from '@/app/services'

const rawProps = defineProps<PropsTag>()
const props = useComponentDefaultsService('SCardActions', rawProps)
const { tagName } = useTagService(props)
</script>
<style lang="scss">
.s_card__actions {
  display: flex;
  align-items: center;
  padding: calc($s_spacer * 2) calc($s_spacer * 2) calc($s_spacer * 4);
}
</style>
