<template>
  <Component :is="tagName" class="s_card__title">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { type PropsTag } from '@/app/definitions'
import { useComponentDefaultsService, useTagService } from '@/app/services'

const rawProps = defineProps<PropsTag>()
const props = useComponentDefaultsService('SCardTitle', rawProps)
const { tagName } = useTagService(props)
</script>

<style lang="scss">
.s_card__title {
  @include s_typography('h6');
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: $s_cardItemPadding;
  word-break: break-all;
}
</style>
