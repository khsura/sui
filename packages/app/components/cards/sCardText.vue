<template>
  <Component :is="tagName" class="s_card__text">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { type PropsTag } from '@sui/app/definitions'
import { useTagService } from '@sui/app/services'

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<PropsTag>()
const { tagName } = useTagService(props)
</script>
<style lang="scss">
@import '@sui/app/styles/components/cards';

.s_card__text {
  @include s_typography('subtitle__2');
  width: 100%;
  padding: $s_cardItemPadding;
  font-weight: 400;
}
</style>
