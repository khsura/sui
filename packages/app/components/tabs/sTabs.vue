<template>
  <SToggleButtonGroup
    ref="tabsElement"
    v-model="model"
    :class="classList"
    v-bind="{
      outlined: props.outlined,
      underlined: props.underlined,
      borderRadius: props.borderRadius,
      dense: props.dense,
      shrink: props.shrink,
      bordered: props.bordered,
      selectedColor: props.selectedTabColor,
    }"
    :multiple="false"
    mandatory
    role="tablist"
    @keydown="onTablistKeydown"
  >
    <slot></slot>
  </SToggleButtonGroup>
</template>
<script setup lang="ts">
import { computed, provide, useTemplateRef } from 'vue'
import { SToggleButtonGroup } from '@/app/components/toggleButtonGroup'
import { ProviderPropsName } from '@/app/configs'
import { keyboardKey } from '@/app/constants'
import type { PropsTabs } from '@/app/definitions'
import { useComponentDefaultsService, useTabsService } from '@/app/services'

const rawProps = withDefaults(defineProps<PropsTabs>(), {
  selectedTabColor: 'primary',
})

const props = useComponentDefaultsService('STabs', rawProps)
const emit = defineEmits<(event: 'update:modelValue', value: number | string) => void>()
const tabsElement = useTemplateRef<{ $el: HTMLElement }>('tabsElement')
const tabsRootElement = computed(() => tabsElement.value?.$el)

// Tells each STab (an SToggleButton) to render as role="tab" with a roving tabindex.
provide(ProviderPropsName.tabsProps, props)

// The ARIA tabs pattern: one Tab stop (the selected tab); arrow keys, Home and End move and select.
const getTargetTabIndex = (key: string, currentIndex: number, tabCount: number) => {
  switch (key) {
    case keyboardKey.arrowRight:
      return (currentIndex + 1) % tabCount
    case keyboardKey.arrowLeft:
      return (currentIndex - 1 + tabCount) % tabCount
    case keyboardKey.home:
      return 0
    case keyboardKey.end:
      return tabCount - 1
    default:
      return null
  }
}

const onTablistKeydown = (event: KeyboardEvent) => {
  const tablist = event.currentTarget

  if (!(tablist instanceof HTMLElement) || !(event.target instanceof HTMLElement)) {
    return
  }

  const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'))
  const currentIndex = tabs.indexOf(event.target)
  const targetIndex = currentIndex < 0 ? null : getTargetTabIndex(event.key, currentIndex, tabs.length)
  const targetTab = targetIndex === null ? undefined : tabs[targetIndex]

  if (targetTab) {
    event.preventDefault()
    targetTab.focus()
    targetTab.click()
  }
}

const model = computed({
  get(): Array<number | string> {
    return [props.modelValue]
  },
  set(value: Array<number | string>) {
    emit('update:modelValue', value?.[0])
  },
})

const { isStartHidden, isEndHidden } = useTabsService(
  computed(() => props.modelValue),
  tabsRootElement,
)

const classList = computed(() => ({
  s_tabs: true,
  's_tabs--wrap': props.wrap,
  's_tabs--startHidden': !props.wrap && isStartHidden.value,
  's_tabs--endHidden': !props.wrap && isEndHidden.value,
}))
</script>

<style lang="scss">
// The faded strip at an end that hides tabs, so a row that scrolls doesn't look clipped.
$s_tabs__fadeWidth: 32px;

// Fades the row of tabs out at the ends that hide tabs. Each end gets a ($clear, $solid) pair: fully
// transparent up to $clear, fully visible from $solid. A pair of 0% leaves that end unfaded.
@mixin s_tabs__fadeMask($startClear, $startSolid, $endClear, $endSolid) {
  mask-image: linear-gradient(
    to right,
    transparent $startClear,
    #000000 $startSolid,
    #000000 calc(100% - #{$endSolid}),
    transparent calc(100% - #{$endClear})
  );
}

// Tabs stay on one row. When they do not fit, the row scrolls sideways (swipe, trackpad or shift+wheel)
// and each tab keeps the width of its label. An end that hides tabs fades out, so the row visibly scrolls;
// when every tab fits there is no fade. `wrap` lays the tabs out on several rows instead.
.s_tabs {
  .s_toggleButtonGroup__content {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &--startHidden .s_toggleButtonGroup__content {
    @include s_tabs__fadeMask(0%, $s_tabs__fadeWidth, 0%, 0%);
  }

  &--endHidden .s_toggleButtonGroup__content {
    @include s_tabs__fadeMask(0%, 0%, 0%, $s_tabs__fadeWidth);
  }

  &--startHidden.s_tabs--endHidden .s_toggleButtonGroup__content {
    @include s_tabs__fadeMask(0%, $s_tabs__fadeWidth, 0%, $s_tabs__fadeWidth);
  }

  .s_toggleButton {
    width: auto;

    &:not(.s_toggleButton--shrink) {
      flex: 1 0 auto;
    }
  }

  .s_toggleButton__button {
    white-space: nowrap;
  }

  &--wrap .s_toggleButtonGroup__content {
    flex-wrap: wrap;
    overflow-x: visible;
  }
}
</style>
