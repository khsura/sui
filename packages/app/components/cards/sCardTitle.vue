<template>
  <Component :is="tagName" class="s_card__title">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { type PropsTag } from '@khsura/sui/definitions'
import { useTagService } from '@khsura/sui/services'

const props = defineProps<PropsTag>()
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
