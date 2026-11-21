<template>
  <SToggleButtonGroup
    ref="tabsElement"
    v-model="model"
    class="s_tabs"
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
  >
    <slot></slot>
  </SToggleButtonGroup>
</template>
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { SToggleButtonGroup } from '@/app/components/toggleButtonGroup'
import type { PropsTabs } from '@/app/definitions'
import { useComponentDefaultsService, useTabsService } from '@/app/services'

const rawProps = withDefaults(defineProps<PropsTabs>(), {
  selectedTabColor: 'primary',
})

const props = useComponentDefaultsService('STabs', rawProps)
const emit = defineEmits<(event: 'update:modelValue', value: number | string) => void>()
const tabsElement = useTemplateRef<{ $el: HTMLElement }>('tabsElement')
const tabsRootElement = computed(() => tabsElement.value?.$el)

const model = computed({
  get(): Array<number | string> {
    return [props.modelValue]
  },
  set(value: Array<number | string>) {
    emit('update:modelValue', value?.[0])
  },
})

useTabsService(
  computed(() => props.modelValue),
  tabsRootElement,
)
</script>

<style lang="scss">
// Tabs stay on one row. When they do not fit, the row scrolls sideways (touch, trackpad or shift+wheel)
// instead of wrapping, and each tab keeps the width of its label.
.s_tabs {
  .s_toggleButtonGroup__content {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
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
}
</style>
