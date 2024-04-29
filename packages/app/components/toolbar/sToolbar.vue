<template>
  <Component :is="tagName" :class="classes" :style="styles">
    <div v-if="$slots.prepend" class="s_toolbar__prepend">
      <slot name="prepend"></slot>
    </div>
    <div class="s_toolbar__content" :class="contentClasses" :style="contentStyles">
      <slot></slot>
    </div>
    <div v-if="isExtended" :style="extensionStyles" class="s_toolbar__extension">
      <slot name="extension"></slot>
    </div>
    <div v-if="$slots.append" class="s_toolbar__append">
      <slot name="append"></slot>
    </div>
  </Component>
</template>
<script setup lang="ts">
import { ProviderPropsName } from '@sui/app/constants'
import { getNumericCssAttribute } from '@sui/app/lib'
import { propsToolbar } from '@sui/app/props'
import {
  useBorderService,
  useColorService,
  useContentService,
  useElevationService,
  usePositionService,
  useProviderService,
  useTagService,
  useToolbarService,
} from '@sui/app/services'
import { computed } from 'vue'

const props = defineProps({
  ...propsToolbar(),
})

const { classListColor, styleListColor } = useColorService(props)
const { classListBorder } = useBorderService(props)
const { classListElevation } = useElevationService(props)
const { classListPosition } = usePositionService(props)
const { provideProps } = useProviderService()

provideProps(ProviderPropsName.toolbar, props)

const { contentHeight, extensionHeight, isExtended } = useToolbarService(props)
const { styles: contentServiceStyles, classes: contentClasses } = useContentService(props)
const { tagName } = useTagService(props)

const classes = computed(() => {
  return {
    ...classListBorder.value,
    ...classListColor.value,
    ...classListElevation.value,
    ...classListPosition.value,
    s_toolbar: true,
    's_toolbar--floating': props.floating,
    [`s_toolbar--density-${props.density}`]: props.density,
  }
})

const styles = computed(() => {
  return {
    ...styleListColor.value,
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
    height: getNumericCssAttribute(extensionHeight.value),
  }
})
</script>

<style lang="scss">
@import '@sui/app/styles/components/layout';

.s_toolbar {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 100%;

  @include s_layoutTransition();

  &--floating {
    display: inline-flex;
  }

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
    margin-inline-start: 10px;
    margin-inline-end: auto;
  }

  &__append {
    margin-inline-start: auto;
    margin-inline-end: 10px;
  }
}
</style>
