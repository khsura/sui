<template>
  <SToolbar
    ref="toolbarRef"
    v-bind="toolbarProps"
    :extension-height="computedExtensionHeight"
    :class="{ ...classes, s_appBar__extensionFixed: isFixedExtension }"
    :style="styles"
    :extension-class="{ [`s_appBar__extension${isFixedExtension ? '--fixed' : ''}`]: isFixedExtension }"
    :color="color ?? 'appBar'"
  >
    <slot></slot>
    <template v-if="isExtended" #extension>
      <slot name="extension"></slot>
    </template>
  </SToolbar>
  <div v-if="isFixedExtension" class="s_appBar__fixedExtensionPlaceholder"></div>
</template>

<script setup lang="ts">
import { SToolbar } from '@khsura/sui/components/toolbar'
import { getNumericCssAttribute, getWindow } from '@khsura/sui/lib'
import { propsAppBar } from '@khsura/sui/props'
import { useAppBarService } from '@khsura/sui/services'
import { useScroll } from '@vueuse/core'
import { type ComponentPublicInstance, computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps(propsAppBar())
const toolbarRef = ref<ComponentPublicInstance<typeof SToolbar> | null>(null)

const toolbarProps = computed(() => {
  const { position: _p, ...remainingProps } = props

  return remainingProps
})

const {
  computedExtensionHeight,
  contentHeight,
  isExtended,
  toolbarHeight,
  app,
  classes,
  styles,
  isActive,
  updateIsAppBarDisplayStatus,
} = useAppBarService(props)

const { y } = useScroll(getWindow())
const isReady = ref(false)

const fixedExtensionThresholdY = computed(() => {
  if (!isReady.value) {
    return 0
  }

  return Math.max(toolbarRef.value?.$el?.getBoundingClientRect().y ?? 0, 0) + contentHeight.value
})

const isFixedExtension = computed(() => {
  return (
    props.position !== 'fixed' &&
    props.position !== 'absolute' &&
    props.fixedExtension &&
    y.value > fixedExtensionThresholdY.value
  )
})

const contentHeightPx = computed(() => {
  return getNumericCssAttribute(contentHeight.value)
})

const toolbarHeightPx = computed(() => {
  return getNumericCssAttribute(toolbarHeight.value)
})

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
  [toolbarHeight, computedExtensionHeight, isActive, () => toolbarRef.value?.isFixedExtension],
  ([toolbarHeight, extensionHeight, isActive, isFixedExtension]) => {
    const height = isFixedExtension ? extensionHeight : toolbarHeight

    app.value.appBarHeight = isActive ? height : 0

    console.log(app.value.appBarHeight, height, toolbarHeight, extensionHeight)
    if (isFixedExtension) {
      app.value.appBarPosition = 'fixed'
    } else {
      app.value.appBarPosition = props.position
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  isReady.value = true
})

onBeforeUnmount(() => {
  app.value.appBarHeight = 0
  app.value.appBarPosition = null
})
</script>
<style lang="scss" scoped>
@import '@khsura/sui/styles/components/appBar';
@import '@khsura/sui/styles/components/layout';

.s_appBar {
  @include s_borderRadius($s_appBar__borderRadius);
  @include s_layoutTransition();
  justify-content: center;
  min-height: $s_appBar__minHeight;
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

  &__extensionFixed {
    position: fixed;
    top: calc(-1 * v-bind(contentHeightPx));
    width: 100%;
  }

  &__fixedExtensionPlaceholder {
    width: 100vw;
    height: v-bind(toolbarHeightPx);
  }
}
</style>
