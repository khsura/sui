<template>
  <div class="s_menu">
    <div ref="activatorElement" class="s_menu__activator">
      <slot name="activator" :on="activatorOn" :attrs="activatorAttrs"></slot>
    </div>
    <SOverlay v-slot="{ attrs }" :value="model">
      <div
        v-bind="attrs"
        ref="contentElement"
        class="s_menu__content"
        :class="contentClasses"
        :style="computedContentStyles"
      >
        <slot></slot>
      </div>
    </SOverlay>
  </div>
</template>
<script setup lang="ts">
import SOverlay from '@sui/app/components/sOverlay.vue'
import { getWindow } from '@sui/app/lib/browser'
import { propsMeasurableStyles, propsMenu } from '@sui/app/props'
import { useMeasurableStylesService, useMenuService } from '@sui/app/services'
import { computed, watch } from 'vue'

const props = defineProps({
  ...propsMeasurableStyles(),
  ...propsMenu(),
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean | null | undefined): void
  (event: 'close'): void
}>()

const { measurableStyles } = useMeasurableStylesService(props)

const {
  activatorElement,
  activatorOn,
  activatorAttrs,
  contentElement,
  onClickOutside,
  onClickContent,
  model,
  contentClasses,
  contentStyles,
} = useMenuService(props, emit)

const computedContentStyles = computed(() => {
  return {
    ...contentStyles.value,
    ...measurableStyles.value,
  }
})

onClickContent(() => {
  model.value = props.closeOnContentClick ? false : model.value
})

onClickOutside(() => {
  model.value = false
})

const onScroll = () => {
  model.value = false
  getWindow()?.removeEventListener('scroll', onScroll)
}

watch(
  () => model.value,
  () => {
    if (model.value === true && props.closeOnScroll) {
      getWindow()?.addEventListener('scroll', onScroll)
    }
  },
)
</script>

<style lang="scss">
@import '@sui/app/styles/components/menu';

.s_menu {
  position: relative;

  &__content {
    @include s_menuContent();
    @include s_elevation(2);
    @include s_borderRadius();

    > .s_list {
      padding: 0;
    }
  }
}
</style>
