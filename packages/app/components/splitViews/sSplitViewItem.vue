<template>
  <div class="s_splitViewItem s_splitViewItem__content">
    <slot></slot>
  </div>
  <div ref="resizer" :class="resizerClasses" @mousedown="mouseDownHandler"></div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { ProviderPropsName } from '~/constants'
import { useProviderService } from '~/services'

const resizer = ref<HTMLElement | null>(null)
const { injectParentProps } = useProviderService()
const splitViewProps = injectParentProps(ProviderPropsName.splitViewProps, { vertical: false })
const x = ref(0)
const y = ref(0)

const previousELementAttributes = ref({
  width: 0,
  height: 0,
})

const previousElement = computed(() => {
  return resizer.value?.previousElementSibling as HTMLElement | null | undefined
})

const nextElement = computed(() => {
  return resizer.value?.previousElementSibling as HTMLElement | null | undefined
})

const mouseMoveHandler = (e: MouseEvent) => {
  // How far the mouse has been moved
  const dx = e.clientX - x.value
  const dy = e.clientY - y.value

  if (!resizer.value) {
    return
  }

  if (splitViewProps.value.vertical) {
    resizer.value.style.cursor = 'row-resize'
    document.body.style.cursor = 'row-resize'
    const height = (resizer.value.parentNode as HTMLElement).getBoundingClientRect().height
    const heightPercentage = ((previousELementAttributes.value.height + dy) * 100) / height

    if (previousElement.value) {
      previousElement.value.style.height = `${heightPercentage}%`
      previousElement.value.style.flex = '0 0 auto'
    }
  } else {
    resizer.value.style.cursor = 'col-resize'
    document.body.style.cursor = 'col-resize'
    const width = (resizer.value.parentNode as HTMLElement).getBoundingClientRect().width
    const widthPercentage = ((previousELementAttributes.value.width + dx) * 100) / width

    if (previousElement.value) {
      previousElement.value.style.width = `${widthPercentage}%`
      previousElement.value.style.flex = '0 0 auto'
    }
  }
}

const mouseUpHandler = function () {
  resizer.value?.style.removeProperty('cursor')
  document.body.style.removeProperty('cursor')

  previousElement.value?.style.removeProperty('user-select')
  previousElement.value?.style.removeProperty('pointer-events')

  nextElement.value?.style.removeProperty('user-select')
  nextElement.value?.style.removeProperty('pointer-events')

  document.removeEventListener('mousemove', mouseMoveHandler)
  document.removeEventListener('mouseup', mouseUpHandler)
}

const mouseDownHandler = (e: MouseEvent) => {
  // Get the current mouse position
  x.value = e.clientX
  y.value = e.clientY
  previousELementAttributes.value.width = previousElement.value?.getBoundingClientRect().width ?? 0
  previousELementAttributes.value.height = previousElement.value?.getBoundingClientRect().height ?? 0

  // Attach the listeners to `document`
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseup', mouseUpHandler)
}

const resizerClasses = computed(() => {
  return {
    s_splitViewItem: true,
    s_splitViewItem__resizer: true,
    's_splitViewItem__resizer--vertical': splitViewProps.value.vertical,
  }
})
</script>
<style lang="scss">
.s_splitViewItem {
  &:last-of-type {
    display: none;
  }

  &__content {
    position: relative;
    flex: 1;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  &__resizer {
    width: 3px;
    height: 100%;
    cursor: col-resize;
    background-color: s_getAppColor('border');

    &--vertical {
      width: 100%;
      height: 3px;
      cursor: row-resize;
    }
  }
}
</style>
