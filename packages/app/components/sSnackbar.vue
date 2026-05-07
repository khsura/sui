<template>
  <div class="s_snackbar">
    <div v-if="$slots.activator" ref="activatorElement">
      <slot name="activator" :on="activatorOn" :attrs="activatorAttrs"></slot>
    </div>
    <SOverlay v-slot="{ attrs }" :value="model" :transition="STransition.fade">
      <div v-bind="attrs" class="s_snackbar__wrapper" :class="wrapperClasses" :style="wrapperStyles">
        <div class="s_snackbar__content" :class="contentClasses"><slot></slot></div>
        <div class="s_snackbar__action">
          <slot name="action"></slot>
        </div>
      </div>
    </SOverlay>
  </div>
</template>
<script setup lang="ts">
import { watch, computed, useTemplateRef } from 'vue'
import SOverlay from '@/app/components/sOverlay.vue'
import { STransition } from '@/app/constants'
import { getCleanSetObject, getNumericCssAttribute } from '@/app/lib'
import { getWindow } from '@/app/lib/browser'
import type { PropsSnackbar } from '@/app/definitions'
import { getIsAbsolutePosition, getIsFixedPosition } from '@/app/repositories/positionRepository'
import {
  useActivatorService,
  useComponentDefaultsService,
  useLayoutService,
  useScrollableService,
} from '@/app/services'

const rawProps = defineProps<PropsSnackbar>()
const props = useComponentDefaultsService('SSnackbar', rawProps)
const model = defineModel<boolean>()
let timer: NodeJS.Timeout | number | undefined
const activatorElement = useTemplateRef('activatorElement')
const { activatorAttrs, activatorOn } = useActivatorService(props, model, activatorElement)
const { currentScroll } = useScrollableService()
const { app } = useLayoutService({ app: true })

const wrapperClasses = computed(() => {
  return {
    's_snackbar__wrapper--top': props.location === 'top',
  }
})

const offsetTop = computed(() => {
  const isFixedAppBar = getIsFixedPosition({ position: app.value.appBarPosition })
  const isAbsoluteAppBar = getIsAbsolutePosition({ position: app.value.appBarPosition })

  if (isFixedAppBar) {
    return app.value.appBarHeight + Math.max(app.value.offsetTop - currentScroll.value, 0)
  }

  if (isAbsoluteAppBar) {
    return Math.max(app.value.appBarHeight + app.value.offsetTop - currentScroll.value, 0)
  }

  return Math.max(app.value.appBarHeight - currentScroll.value, 0)
})

const wrapperStyles = computed(() => {
  return getCleanSetObject({
    top: props.location === 'top' ? getNumericCssAttribute(offsetTop.value) : undefined,
    bottom: props.location !== 'top' ? getNumericCssAttribute(app.value.bottomNavigationHeight) : undefined,
  })
})

const contentClasses = computed(() => {
  return {
    's_snackbar__content--multiLine': props.multiLine,
  }
})

watch(model, () => {
  if (model.value) {
    const window = getWindow()

    if (props.timeout && window) {
      clearTimeout(timer)
      timer =
        setTimeout(() => {
          model.value = false
        }, props.timeout) ?? null
    }
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
    text-overflow: ellipsis;
    text-align: initial;
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
