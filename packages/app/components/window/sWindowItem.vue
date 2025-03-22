<template>
  <div v-show="canDisplay" :class="classes" :style="styles">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { ProviderPropsName } from '@khsura/sui/constants'
import { propsWindowItem } from '@khsura/sui/props'
import { useProviderService, useSingleGroupItemService } from '@khsura/sui/services'

const translateXMapper: Record<string, string | undefined> = {
  '1': '100%',
  '0': '0%',
  '-1': '-100%',
}

const props = defineProps({
  ...propsWindowItem(),
})

const { injectParentProps } = useProviderService()
const windowProps = injectParentProps(ProviderPropsName.window)
const { isSelected, group, item } = useSingleGroupItemService(props)

const selectedItemId = computed(() => {
  return group?.selectedItem.value.id ?? -1
})

const diff = computed(() => {
  const selectedIndex = selectedItemId.value

  if (selectedIndex === -1) {
    return null
  }

  return (item.value.id ?? 0) - selectedIndex
})

const canDisplayLastItem = computed(() => {
  return selectedItemId.value === 0 && item.value.id === (group?.items.value.length ?? 0) - 1
})

const canDisplay = computed(() => {
  if (canDisplayLastItem.value) {
    return true
  }

  return diff.value !== null && Math.abs(diff.value) <= 1
})

const classes = computed(() => {
  return {
    s_windowItem: true,
    [windowProps.value.selectedClass ?? '']: isSelected.value && !!windowProps.value.selectedClass,
    's_windowItem--noTransition': windowProps.value.noAnimation,
  }
})

const translateX = computed(() => {
  if (canDisplayLastItem.value && (group?.items.value.length ?? 0) > 1) {
    return '100%'
  }

  if (diff.value === null) {
    return null
  }

  return translateXMapper[diff.value?.toString()] ?? null
})

const styles = computed(() => {
  return translateX.value
    ? {
        transform: `translateX(${translateX.value})`,
      }
    : {}
})
</script>
<style lang="scss">
.s_windowItem {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: $s_windowItemTransition;

  &--noTransition {
    transition: none;
  }
}
</style>
