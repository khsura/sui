<template>
  <div class="s_snackbar">
    <div ref="activatorElement">
      <slot name="activator" :on="activatorOn" :attrs="activatorAttrs"></slot>
    </div>
    <SOverlay v-slot="{ attrs }" :value="model" :transition="STransition.fade">
      <div
        v-bind="attrs"
        ref="contentElement"
        class="s_snackbar__wrapper"
        :class="wrapperClasses"
        :style="wrapperStyles"
      >
        <div class="s_snackbar__content" :class="contentClasses"><slot></slot></div>
        <div class="s_snackbar__action">
          <slot name="action"></slot>
        </div>
      </div>
    </SOverlay>
  </div>
</template>
<script setup lang="ts">
import SOverlay from '@sui/app/components/sOverlay.vue'
import { STransition } from '@sui/app/constants'
import { getWindow } from '@sui/app/lib/browser'
import { getNumericCssAttribute } from '@sui/app/lib'
import { propsActivator, propsBorder } from '@sui/app/props'
import { useActivatorService, useLayoutService } from '@sui/app/services'
import { computed } from 'vue'
import { type PropType } from 'vue'

const props = defineProps({
  multiLine: {
    type: Boolean as PropType<boolean | undefined | null>,
    default: false,
  },
  timeout: {
    type: Number as PropType<number | undefined | null>,
    default: 6000,
  },
  location: {
    type: String as PropType<'bottom' | 'top' | null | undefined>,
    default: undefined,
  },
  ...propsActivator(),
  ...propsBorder(),
})

const emit = defineEmits<(event: 'update:modelValue', value: boolean | undefined | null) => void>()
let timer: number | undefined

const { model, activatorAttrs, activatorElement, activatorOn, contentElement } = useActivatorService(
  props,
  emit,
  'modelValue',
  (v) => {
    if (v) {
      const window = getWindow()

      if (props.timeout && window) {
        window.clearTimeout(timer)
        timer =
          window.setTimeout(() => {
            model.value = false
          }, props.timeout) ?? null
      }
    }
  },
)

const { app } = useLayoutService({ app: true })

const wrapperClasses = computed(() => {
  return {
    's_snackbar__wrapper--top': props.location === 'top',
  }
})

const wrapperStyles = computed(() => {
  return {
    top: props.location === 'top' ? getNumericCssAttribute(app.value.top) : undefined,
    bottom: props.location !== 'top' ? getNumericCssAttribute(app.value.bottom) : undefined,
  }
})

const contentClasses = computed(() => {
  return {
    's_snackbar__content--multiLine': props.multiLine,
  }
})
</script>

<style lang="scss">
.s_snackbar {
  &__wrapper {
    @include s_elevation(6);
    @include s_borderRadius();
    position: fixed;
    bottom: 0;
    left: 50%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    min-width: 344px;
    max-width: 672px;
    min-height: 48px;
    margin: calc($s_spacer * 2) auto;
    color: s_getAppColor('snackbar', true);
    background-color: s_getAppColor('snackbar');
    transform: translateX(-50%);

    &--top {
      top: 0;
      bottom: unset;
    }
  }

  &__content {
    @include s_typography('body__2');
    flex-grow: 1;
    padding: 14px 16px;
    margin-right: auto;
    overflow: hidden;
    text-align: initial;
    text-overflow: ellipsis;
    white-space: nowrap;

    &--multiLine {
      overflow: auto;
      text-overflow: unset;
      white-space: normal;
    }
  }

  &__action {
    padding-right: 8px;
  }
}
</style>
