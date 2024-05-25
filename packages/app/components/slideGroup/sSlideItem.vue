<template>
  <div ref="slideItem" :disabled="disabled" :class="classList" @click="() => toggleGroupItem()">
    <slot :is-selected="isSelected"></slot>
  </div>
</template>
<script setup lang="ts">
import { ProviderPropsName } from '@khsura/sui/constants'
import { propsGroupItem } from '@khsura/sui/props'
import { useGroupItemService, useProviderService } from '@khsura/sui/services'
import { ref, computed } from 'vue'

const props = defineProps(propsGroupItem())
const slideItem = ref<HTMLElement | null>(null)
const { toggleGroupItem, isSelected } = useGroupItemService(props, { element: slideItem })
const { injectParentProps } = useProviderService()
const groupProps = injectParentProps(ProviderPropsName.slideGroupProps, { activeClass: null, itemWidth: null })

const classList = computed(() => {
  return {
    s_sliderItem: true,
    s_disabled: props.disabled,
    [props.activeClass ?? '']: !!props.activeClass && isSelected.value,
    [groupProps.value.activeClass ?? '']: !!groupProps.value.activeClass && isSelected.value,
  }
})
</script>
<style lang="scss" scoped>
.s_sliderItem {
  height: 100%;
  cursor: pointer;
}
</style>
