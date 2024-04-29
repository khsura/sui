<template>
  <Component :is="tagName" v-if="hasText" class="s_toolbarTitle">
    <slot v-if="$slots.default"></slot>
    <slot v-else-if="$slots.text" name="text"></slot>
    <div v-else-if="text">{{ text }}</div>
  </Component>
</template>
<script setup lang="ts">
import { propsToolbarTitle } from '@sui/app/props'
import { useTagService } from '@sui/app/services'
import { computed, useSlots } from 'vue'

const props = defineProps({
  ...propsToolbarTitle(),
})

const slots = useSlots()
const { tagName } = useTagService(props)

const hasText = computed(() => {
  return !!(slots.default || slots.text || props.text)
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
