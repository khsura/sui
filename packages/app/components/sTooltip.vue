<template>
  <div class="s_tooltip">
    <div
      v-if="$slots.activator"
      ref="activatorElement"
      class="s_tooltip__activator"
      :class="classListActivator"
      v-bind="activatorAttrs"
      @mouseenter="mouseEnter"
      @mouseleave="mouseLeave"
      v-on="activatorOn"
    >
      <slot name="activator"></slot>
    </div>
    <SOverlay v-slot="{ attrs }" :value="model">
      <OnClickOutside :options="{ ignore: ['.s_overlay__content'] }" @trigger="onClickOutside">
        <div
          ref="contentElement"
          class="s_tooltip__content"
          :class="classListContent"
          :style="styleListContent"
          v-bind="attrs"
          @mouseleave="mouseLeave"
        >
          <slot></slot>
        </div>
      </OnClickOutside>
    </SOverlay>
  </div>
</template>
<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components'
import { watch, nextTick, computed, useTemplateRef } from 'vue'
import SOverlay from '@khsura/sui/components/sOverlay.vue'
import type { PropsTooltip } from '@khsura/sui/definitions'
import { useColorService, useMeasurableStylesService, useMenuService } from '@khsura/sui/services'

const props = defineProps<PropsTooltip>()
const { measurableStyles } = useMeasurableStylesService(props)
const model = defineModel<boolean>()
const activatorElement = useTemplateRef('activatorElement')
const contentElement = useTemplateRef('contentElement')

const { activatorAttrs, activatorOn, updateLocation, computedActivatorElement, contentClasses, contentStyles } =
  useMenuService(
    props,
    model,
    {
      activatorElement,
      contentElement,
    },
    { noContentMinWidth: true, offset: 8, alignMiddle: true },
  )

const { classListColor, styleListColor } = useColorService(props)

const classListActivator = computed(() => {
  return {
    s_tooltip__activator: true,
  }
})

const classListContent = computed(() => {
  return {
    's_tooltip__content-hidden': !model.value,
    ...classListColor.value,
    ...contentClasses.value,
  }
})

const styleListContent = computed(() => {
  return {
    ...contentStyles.value,
    ...styleListColor.value,
    ...measurableStyles.value,
  }
})

const onClickOutside = () => {
  model.value = false
}

const mouseEnter = (_: MouseEvent) => {
  model.value = true
}

const mouseLeave = (event: MouseEvent) => {
  const target = event.relatedTarget as HTMLElement

  if (!contentElement.value?.contains(target) && !computedActivatorElement.value?.contains(target)) {
    model.value = false
  }
}

watch(model, async (value) => {
  if (value) {
    await nextTick()

    updateLocation()
  }
})
</script>

<style lang="scss" scoped>
.s_tooltip {
  &__content {
    @include s_menuContent();
    @include s_typography('caption');
    @include s_borderRadius();
    width: max-content;
    height: max-content;
    padding: 4px;
    contain: content;
    color: $s_color__light;
    text-align: center;
    background-color: rgba($s_color__black, 0.5);
    backdrop-filter: blur(10px);
    animation: enlarge 200ms normal forwards running ease-in-out;

    @keyframes enlarge {
      0% {
        transform: scale(0);
      }

      100% {
        transform: scale(1);
      }
    }

    &-hidden {
      visibility: hidden;
      transform: scale(0);
      animation: shrink 100ms normal 100 ease-in-out;

      @keyframes shrink {
        0% {
          transform: scale(1);
        }

        100% {
          transform: scale(0);
        }
      }
    }
  }
}
</style>
