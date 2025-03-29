<template>
  <Component :is="tagName" v-if="hasText" class="s_toolbarTitle" :class="classListColor" :style="styleListColor">
    <slot v-if="$slots.default"></slot>
    <slot v-else-if="$slots.text" name="text"></slot>
    <div v-else-if="text">{{ text }}</div>
  </Component>
</template>
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { ProviderPropsName } from '~/constants'
import { propsToolbarTitle } from '~/props'
import { useColorService, useProviderService, useTagService } from '~/services'

const props = defineProps({
  ...propsToolbarTitle(),
})

const slots = useSlots()
const { tagName } = useTagService(props)
const { injectParentProps } = useProviderService()
const toolbarProps = injectParentProps(ProviderPropsName.toolbar)
const { classListColor, styleListColor } = useColorService(toolbarProps)

const hasText = computed(() => {
  return !!(slots.default ?? slots.text ?? props.text)
})
</script>
<style lang="scss">
.s_toolbarTitle {
  @include s_typography('h6');
  flex: 1 1;
  min-width: 0;
  margin-inline-start: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
