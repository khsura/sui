<template>
  <Component :is="tagName" class="s_card__text">
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
.s_card__text {
  @include s_typography('subtitle__2');
  width: 100%;
  padding: $s_cardItemPadding;
  font-weight: 400;
}
</style>
