<template>
  <section class="s_slideGroup">
    <SButton
      v-if="!canScroll && shouldDisplayButton"
      icon
      class="s_slideGroup__button s_slideGroup__button--prev"
      :disabled="!canGoPrevious"
      @click="prev()"
      >&#x276E;</SButton
    >

    <div
      ref="viewElement"
      class="s_slideGroup__wrapper"
      :class="{
        's_slideGroup__wrapper--scrollable': canScroll,
        's_slideGroup__wrapper--noArrow': canScroll || !shouldDisplayButton,
      }"
      @scroll="updateScrollLeft"
    >
      <div ref="contentElement" class="s_slideGroup__content">
        <slot></slot>
      </div>
    </div>

    <SButton
      v-if="!canScroll && shouldDisplayButton"
      icon
      class="s_slideGroup__button s_slideGroup__button--next"
      :disabled="!canGoNext"
      @click="next()"
      >&#x276F;</SButton
    >
  </section>
</template>
<script setup lang="ts">
import SButton from '@sui/app/components/sButton.vue'
import { ProviderPropsName } from '@sui/app/constants'
import { propsSlideGroup } from '@sui/app/props'
import { useDisplayService, useGroupService, useProviderService, useScrollService } from '@sui/app/services'
import { type GroupItemValue } from '@sui/app/types'
import { ref, computed, watch } from 'vue'

const props = defineProps({
  ...propsSlideGroup(),
})

const emit = defineEmits<(event: 'update:modelValue', value: GroupItemValue[] | null) => void>()

const errorFixer = 20
const { smAndUp, width } = useDisplayService()
const { smoothElementScroll } = useScrollService()
const { items, clickValue, getItemIndex } = useGroupService(props, emit)
const { provideProps } = useProviderService()

provideProps(ProviderPropsName.slideGroupProps, props)

const scrollLeft = ref<number>(0)
const isScrolling = ref<boolean>(false)
const viewElement = ref<HTMLElement | null>(null)
const contentElement = ref<HTMLElement | null>(null)

const getIndexFromScroll = (addWidth = 0) => {
  const nextScrollLeft = scrollLeft.value + addWidth
  const defaultValue = addWidth > 0 ? items.value.length - 1 : 0

  const output = items.value.findIndex((item, id) => {
    return (
      nextScrollLeft >= (item.element?.offsetLeft ?? defaultValue) &&
      nextScrollLeft < (items.value[id + 1]?.element?.offsetLeft ?? defaultValue)
    )
  })

  return output === -1 ? defaultValue : output
}

const index = computed(() => {
  return getIndexFromScroll()
})

const item = computed<(typeof items.value)[0] | undefined>(() => {
  const id = getItemIndex(index.value)

  return items.value[id]
})

const itemWidth = computed(() => {
  return item.value?.element?.offsetWidth ?? 0
})

const viewWidth = computed(() => {
  // for reactivity
  return width.value !== null && width.value > 0 ? viewElement.value?.clientWidth ?? 0 : 0
})

const itemsWidth = computed(() => {
  // for reactivity
  if (width.value) {
    return items.value.reduce((sum, item) => {
      return sum + (item.element?.offsetWidth ?? 0)
    }, 0)
  }

  return 0
})

const getScrollLeftFromIndex = (index: number | undefined = undefined, offset = 0) => {
  const normalizedIndex = Math.max(
    Math.min(index === undefined ? items.value.length - 1 : index, items.value.length - 1),
    0,
  )

  const left = items.value[normalizedIndex]?.element?.offsetLeft ?? 0

  return Math.max(Math.min(left + offset, maxScrollLeft.value), 0)
}

const maxScrollLeft = computed(() => {
  return itemsWidth.value - viewWidth.value + errorFixer
})

const updateSlideIndex = (index: number, centered = false) => {
  isScrolling.value = true
  const offset = centered ? viewWidth.value / 2 - itemWidth.value / 2 : 0

  scrollLeft.value = getScrollLeftFromIndex(index, -offset)
  smoothElementScroll(viewElement.value, { left: scrollLeft.value, behavior: 'smooth' })
  setTimeout(() => (isScrolling.value = false), 300)
}

const next = () => {
  const newId = props.slideStep ? index.value + props.slideStep : getIndexFromScroll(viewWidth.value)

  updateSlideIndex(newId)
}

const prev = () => {
  const newId = props.slideStep ? index.value - props.slideStep : getIndexFromScroll(-1 * viewWidth.value)

  updateSlideIndex(newId)
}

const canGoPrevious = computed<boolean>(() => {
  return !(isScrolling.value || scrollLeft.value === 0)
})

const canGoNext = computed<boolean>(() => {
  return !(isScrolling.value || scrollLeft.value >= maxScrollLeft.value - errorFixer)
})

const canScroll = computed(() => {
  return props.scrollable === null ? !smAndUp.value : props.scrollable
})

watch(clickValue, (value) => {
  if (props.centerActive && value) {
    const newId = items.value.findIndex((item) => item.value === value)

    updateSlideIndex(newId, true)
  }
})

const updateScrollLeft = () => {
  if (!isScrolling.value && !shouldDisplayButton.value) {
    scrollLeft.value = viewElement.value?.scrollLeft ?? 0
  }
}

const shouldDisplayButton = computed(() => {
  return width.value !== null && width.value > 0 && (itemsWidth.value >= viewWidth.value || isScrolling.value)
})
</script>

<style lang="scss">
@import '@sui/app/styles/components/button';

.s_slideGroup {
  position: relative;
  width: 100%;

  &__button {
    position: absolute;
    top: 50%;
    width: #{map-deep-get($s_button--sizes, 'default')}px;
    height: #{map-deep-get($s_button--sizes, 'default')}px;
    transform: translateY(-50%);

    &--prev {
      left: 0;
    }

    &--next {
      right: 0;
    }
  }

  &__content {
    position: relative;
    display: flex;
    align-items: center;
    list-style: none;
    transition: 0.3s $s_primaryTransition;
  }

  &__wrapper {
    position: relative;
    width: calc(100% - (2 * #{map-deep-get($s_button--sizes, 'default')}px) - $s_spacer);
    margin: 0 auto;
    overflow-x: hidden;
    scrollbar-width: none; // hide scrollbar for firefox
    -ms-overflow-style: none; // hide scrollbar for IE and Edge

    &::-webkit-scrollbar {
      display: none; // hide scrollbar for Chrome, Safari and Opera
    }

    &--noArrow {
      width: 100%;
    }

    &--scrollable {
      overflow-x: scroll;
      // Property is nonstandard. Avoid using it.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-overflow-scrolling
      -webkit-overflow-scrolling: touch;
    }

    .s_sliderItem + .s_sliderItem {
      padding-left: calc($s_spacer / 2);
    }
  }
}
</style>
