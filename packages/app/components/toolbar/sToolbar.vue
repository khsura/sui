<template>
  <component :is="tagName" :class="classes" :style="styles">
    <div v-if="$slots.prepend" class="s_toolbar__prepend">
      <slot name="prepend"></slot>
    </div>
    <div class="s_toolbar__content" :class="contentClasses" :style="contentStyles">
      <slot></slot>
    </div>
    <div
      v-if="isExtended"
      :style="{ ...extensionStyles, ...extensionStyle }"
      :class="extensionClass"
      class="s_toolbar__extension"
    >
      <slot name="extension"></slot>
    </div>
    <div v-if="$slots.append" class="s_toolbar__append">
      <slot name="append"></slot>
    </div>
  </component>
</template>
<script setup lang="ts">
import { computed, provide } from 'vue'
import { defaultToolbarExtensionHeight, defaultToolbarContentHeight } from '@/app/constants'
import { getNumericCssAttribute } from '@/app/lib'
import type { PropsToolbar } from '@/app/definitions'
import {
  useComponentDefaultsService,
  useBorderService,
  useColorService,
  useContentService,
  useElevationService,
  usePositionService,
  useTagService,
  useToolbarService,
} from '@/app/services'
import { ProviderPropsName } from '@/app/configs'

const rawProps = withDefaults(defineProps<PropsToolbar>(), {
  extensionHeight: defaultToolbarExtensionHeight,
  height: defaultToolbarContentHeight,
})

const props = useComponentDefaultsService('SToolbar', rawProps)
const { classListColor, styleListColor } = useColorService(props)
const { classListBorder, styleListBorder } = useBorderService(props)
const { classListElevation } = useElevationService(props)
const { classListPosition } = usePositionService(props)

provide(ProviderPropsName.toolbar, props)

const { contentHeight, computedExtensionHeight, isExtended } = useToolbarService(props)
const { styles: contentServiceStyles, classes: contentClasses } = useContentService(props)
const { tagName } = useTagService(props)

const classes = computed(() => {
  return {
    ...classListBorder.value,
    ...classListColor.value,
    ...classListElevation.value,
    ...classListPosition.value,
    s_toolbar: true,
    [`s_toolbar--density-${props.density}`]: props.density,
  }
})

const styles = computed(() => {
  return {
    ...styleListColor.value,
    ...styleListBorder.value,
    // top: isFixedExtension.value ? getNumericCssAttribute(-1 * contentHeight.value) : undefined,
  }
})

const contentStyles = computed(() => {
  return {
    height: getNumericCssAttribute(contentHeight.value),
    ...contentServiceStyles.value,
  }
})

const extensionStyles = computed(() => {
  return {
    height: getNumericCssAttribute(computedExtensionHeight.value),
  }
})
</script>

<style lang="scss">
.s_toolbar {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 100%;

  @include s_layoutTransition();

  &__content {
    > .s_toolbarButton:first-of-type {
      margin-inline-start: 10px;
    }

    > .s_toolbarButton:last-of-type {
      margin-inline-end: 10px;
    }
  }

  &__content,
  &__extension {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    width: 100%;
    transition: inherit;
  }

  &__append,
  &__prepend {
    display: flex;
    align-items: center;
  }

  &__prepend {
    margin-inline: 10px auto;
  }

  &__append {
    margin-inline: auto 10px;
  }
}
</style>
