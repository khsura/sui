<template>
  <div class="s_menu">
    <div ref="activatorElement" class="s_menu__activator">
      <slot name="activator" :on="activatorOn" :attrs="activatorAttrs"></slot>
    </div>
    <SOverlay v-slot="{ attrs }" :value="model">
      <OnClickOutside @trigger="onClickOutside">
        <div
          v-bind="attrs"
          ref="contentElement"
          class="s_menu__content"
          :class="contentClasses"
          :style="computedContentStyles"
          @click="onClickContent"
        >
          <slot></slot>
        </div>
      </OnClickOutside>
    </SOverlay>
  </div>
</template>
<script setup lang="ts">
import SOverlay from '@sui/app/components/sOverlay.vue'
import { getWindow } from '@sui/app/lib/browser'
import { propsMeasurableStyles, propsMenu } from '@sui/app/props'
import { useMeasurableStylesService, useMenuService } from '@sui/app/services'
import { computed, watch } from 'vue'
import { OnClickOutside } from '@vueuse/components'
import { type EmitMenu } from '@sui/app/types'
import { nextTick } from 'vue'

const props = defineProps({
  ...propsMeasurableStyles(),
  ...propsMenu(),
})

const emit = defineEmits<EmitMenu>()
const model = defineModel<boolean>()
const { measurableStyles } = useMeasurableStylesService(props)

const { activatorElement, activatorOn, activatorAttrs, contentElement, contentClasses, contentStyles, updateLocation } =
  useMenuService(props, model)

const computedContentStyles = computed(() => {
  return {
    ...contentStyles.value,
    ...measurableStyles.value,
  }
})

const onClickContent = () => {
  model.value = props.closeOnContentClick ? false : model.value
}

const onClickOutside = () => {
  model.value = false
}

const onScroll = () => {
  model.value = false
  getWindow()?.removeEventListener('scroll', onScroll)
}

watch(
  () => model.value,
  async () => {
    if (model.value === true) {
      if (props.closeOnScroll) {
        getWindow()?.addEventListener('scroll', onScroll)
      }

      await nextTick()
      updateLocation()
    }

    if (model.value === false) {
      emit('close')
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
