<template>
  <Component :is="tagName" class="s_card__subtitle">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { type PropsTag } from '@/app/definitions'
import { useComponentDefaultsService, useTagService } from '@/app/services'

const rawProps = defineProps<PropsTag>()
const props = useComponentDefaultsService('SCardSubtitle', rawProps)
const { tagName } = useTagService(props)
</script>

<style lang="scss">
.s_card__subtitle {
  @include s_typography('subtitle__2');
  padding: $s_cardItemPadding;
  font-weight: 400;
}
</style>
