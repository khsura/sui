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
import { OnClickOutside } from '@vueuse/components'
import { computed, watch, nextTick, useTemplateRef } from 'vue'
import SOverlay from '@/app/components/sOverlay.vue'
import { getWindow } from '@/app/lib/browser'
import type { PropsMenu } from '@/app/definitions'
import { useComponentDefaultsService, useMeasurableStylesService, useMenuService } from '@/app/services'
import { type EmitMenu } from '@/app/types'

const rawProps = defineProps<PropsMenu>()
const props = useComponentDefaultsService('SMenu', rawProps)
const emit = defineEmits<EmitMenu>()
const model = defineModel<boolean>()
const { measurableStyles } = useMeasurableStylesService(props)
const activatorElement = useTemplateRef('activatorElement')
const contentElement = useTemplateRef('contentElement')

const { activatorOn, activatorAttrs, contentClasses, contentStyles, updateLocation } = useMenuService(props, model, {
  activatorElement,
  contentElement,
})

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
