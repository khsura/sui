<template>
  <Component :is="tagName" ref="textElement" class="s_card__text" :tabindex="scrollableTabindex">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { type PropsTag } from '@/app/definitions'
import { useComponentDefaultsService, useScrollableFocusService, useTagService } from '@/app/services'

const rawProps = defineProps<PropsTag>()
const props = useComponentDefaultsService('SCardText', rawProps)
const { tagName } = useTagService(props)
const textElement = useTemplateRef<HTMLElement>('textElement')
// A scrolling card body (an SDialog's tall content) becomes a Tab stop, so the keyboard can scroll it.
const { scrollableTabindex } = useScrollableFocusService(textElement)
</script>

<style lang="scss">
.s_card__text {
  @include s_typography('subtitle__2');
  width: 100%;
  padding: $s_cardItemPadding;
  font-weight: 400;

  &:focus-visible {
    @include s_focusRing(-2px);
  }
}
</style>
