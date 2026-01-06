<template>
  <div ref="slideItem" :disabled="disabled" :class="classList" @click="() => toggleGroupItem()">
    <slot :is-selected="isSelected"></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { ProviderPropsName } from '@/app/configs'
import { useGroupItemService } from '@/app/services'
import type { PropsGroupItem } from '@/app/definitions'

const props = defineProps<PropsGroupItem>()
const slideItem = ref<HTMLElement | null>(null)
const { toggleGroupItem, isSelected } = useGroupItemService(props, { element: slideItem })
const groupProps = inject(ProviderPropsName.slideGroupProps, null)

if (!groupProps) {
  throw new Error('SlideGroup props not found')
}

const classList = computed(() => {
  return {
    s_sliderItem: true,
    s_disabled: props.disabled,
    [props.activeClass ?? '']: !!props.activeClass && isSelected.value,
    [groupProps.activeClass ?? '']: !!groupProps.activeClass && isSelected.value,
  }
})
</script>
<style lang="scss" scoped>
.s_sliderItem {
  height: 100%;
  cursor: pointer;
}
</style>
