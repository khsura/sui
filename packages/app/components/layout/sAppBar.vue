<template>
  <SToolbar v-bind="toolbarProps" :extension-height="computedExtensionHeight" :class="classes" :style="styles">
    <slot></slot>
    <template v-if="isExtended" #extension>
      <slot name="extension"></slot>
    </template>
  </SToolbar>
</template>

<script setup lang="ts">
import { SToolbar } from '@khsura/sui/components/toolbar'
import { propsAppBar } from '@khsura/sui/props'
import { useAppBarService } from '@khsura/sui/services'
import { computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps(propsAppBar())

const toolbarProps = computed(() => {
  const { position: _p, ...remainingProps } = props

  return remainingProps
})

const {
  computedExtensionHeight,
  isExtended,
  toolbarHeight,
  app,
  classes,
  styles,
  isActive,
  updateIsAppBarDisplayStatus,
} = useAppBarService(props)

watch(
  () => props.hideOnScroll,
  () => {
    updateIsAppBarDisplayStatus()
  },
)

watch(
  () => props.position,
  (value) => {
    app.value.appBarPosition = value
  },
  { immediate: true },
)

watch(
  [toolbarHeight, isActive],
  ([height, isActive]) => {
    app.value.appBarHeight = isActive ? height : 0
  },
  {
    immediate: true,
  },
)

onBeforeUnmount(() => {
  app.value.appBarHeight = 0
  app.value.appBarPosition = null
})
</script>
<style lang="scss">
@import '@khsura/sui/styles/components/appBar';
@import '@khsura/sui/styles/components/layout';

.s_appBar {
  @include s_borderRadius($s_appBar__borderRadius);
  @include s_layoutTransition();
  position: relative;
  justify-content: center;
  min-height: $s_appBar__minHeight;
  background-color: s_getAppColor('card');
  box-shadow:
    0 0.5rem 1rem rgb(0 0 0 / 5%),
    inset 0 -1px 0 rgb(0 0 0 / 10%);

  &--elevateOnScroll {
    @include s_elevation(3);
  }

  &--hideShadow {
    @include s_elevation(0, true);
  }

  &--fixed {
    // overrides s_toolbar
    position: fixed;
    top: 0;
    z-index: 5;
  }

  &--bottom {
    top: unset;
    bottom: 0;
  }
}
</style>
