<template>
  <Component :is="tagName" class="s_card__title">
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

.s_card__title {
  @include s_typography('h6');
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: $s_cardItemPadding;
  word-break: break-all;
}
</style>
