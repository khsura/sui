<template>
  <component
    :is="tagName"
    :disabled="disabled || loading"
    :class="classList"
    :type="type"
    :style="styleList"
    :href="href"
    :to="to"
    @click="click"
  >
    <SProgressCircular v-if="loading" indeterminate :size="progressSize"></SProgressCircular>
    <slot v-else></slot>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { ProviderPropsName, SizeProperty } from '~/constants'
import { getCleanSetObject, isDarkColor } from '~/lib'
import { propsButton } from '~/props'
import { useColorRepository, useProviderRepository } from '~/repositories'
import {
  useBorderService,
  useColorService,
  useDisabledService,
  useElevationService,
  useLinkService,
  useMeasurableStylesService,
  useSingleGroupItemService,
  useSizeService,
  useTextColorService,
} from '~/services'
import { SProgressCircular } from './progress'

const props = defineProps(propsButton())
const emit = defineEmits<(event: 'click', value: Event) => void>()
const { measurableStyles } = useMeasurableStylesService(props)
const { classListElevation } = useElevationService(props)
const { classListDisabled } = useDisabledService(props)
const { getPresetColorValue } = useColorRepository()
const isIcon = computed(() => props.variant === 'icon')
const isFab = computed(() => props.variant === 'fab')
const isText = computed(() => props.variant === 'text')
const isReady = ref(false)

const { classListColor, styleListColor } = useColorService(props, {
  isText: computed(() => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return props.outlined || props.underlined || isIcon.value
  }),
})

const { classListTextColor, styleListTextColor } = useTextColorService(props)
const { classListSize, styleListSize, isPresetSize } = useSizeService(props, { block: 'button' })
const { classListBorder } = useBorderService(props, { block: 'button' })
const { tag: tagName, isLink } = useLinkService(props)
const { injectParentProps } = useProviderRepository()
const bottomNavigationProps = injectParentProps(ProviderPropsName.bottomNavigation, null)

const { toggleGroupItem, isSelected } =
  bottomNavigationProps.value !== null
    ? useSingleGroupItemService(props)
    : {
        toggleGroupItem: () => undefined,
        isSelected: computed(() => false),
      }

const toolbarProps = injectParentProps(ProviderPropsName.toolbar, null)

// TODO: Sura - use more common approach
const isDarkToolbar = computed(() => {
  return isDarkColor(getPresetColorValue(toolbarProps.value?.color), toolbarProps.value?.colorThreshold)
})

const classList = computed((): Record<string, boolean | null | undefined> => {
  return getCleanSetObject({
    s_button: true,
    ...classListElevation.value,
    ...classListSize.value,
    ...classListBorder.value,
    ...classListDisabled.value,
    ...(props.variant === 'text' ? classListTextColor.value : classListColor.value),
    s_linkElement: isLink.value,
    's_button--block': props.block,
    's_button--icon': isIcon.value,
    's_button--fab': isFab.value,
    's_button--text': isText.value,
    's_button--rounded': !!props.rounded && !isIcon.value,
    s_bottomNavigationButton: bottomNavigationProps.value !== null,
    's_bottomNavigationButton--grow': !!bottomNavigationProps.value?.grow,
    's_bottomNavigationButton--shift': !!bottomNavigationProps.value?.shift,
    s_toolbarButton: toolbarProps.value !== null,
    [bottomNavigationProps.value?.activeClass ?? '']: isSelected.value && bottomNavigationProps.value?.activeClass,
    ...(isDarkToolbar.value && isReady.value ? { s_dark: true } : {}),
  })
})

const styleList = computed(() => {
  return {
    ...measurableStyles.value,
    ...styleListSize.value,
    ...(props.variant === 'text' ? styleListTextColor.value : styleListColor.value),
  }
})

/**
 * @see src/styles/components/button/_variables.scss
 */
const progressSize = computed(() => {
  return isPresetSize.value
    ? {
        [SizeProperty.mini]: 20 * 0.6,
        [SizeProperty.small]: 28 * 0.6,
        [SizeProperty.default]: 36 * 0.6,
        [SizeProperty.large]: 44 * 0.6,
        [SizeProperty.extra]: 52 * 0.6,
      }[props.size as SizeProperty]
    : 36 * 0.6
})

const click = (event: Event) => {
  if (bottomNavigationProps.value !== null) {
    toggleGroupItem(props.value ?? undefined)
  }

  emit('click', event)
}

onMounted(() => {
  isReady.value = true
})
</script>

<style lang="scss">
.s_button {
  background-color: s_getAppColor('background');

  @include s_typography('button');
  @include s_button();
  @include s_dark(false);

  &--block {
    display: flex;
    flex: 1 0 auto;
    width: 100%;
  }

  &--rounded {
    border-radius: $s_button--rounded__borderRadius;
  }

  &--icon {
    font-size: #{map.get($s_button__icon--fontSizes, 'default')}px;
  }

  &--text,
  &--icon {
    background-color: transparent;
  }

  &--text.s_disabled,
  &--icon.s_disabled {
    @include s_disabled(true);
  }

  $s_button--size: map.get($s_button--sizes, 'default');

  @each $name, $size in $s_button--fontSizes {
    &--size__#{$name} {
      font-size: $size;
    }
  }

  &--fab {
    @include s_elevation(2);
  }

  &--icon,
  &--fab,
  &--text {
    min-width: 0;
    height: #{$s_button--size}px;
    min-height: 0;
  }

  &--icon,
  &--fab {
    width: #{$s_button--size}px;
    padding: 0;

    &:not(.s_button--tile) {
      border-radius: $s_button--round__borderRadius;
    }
  }

  @each $key, $size in $s_button--sizes {
    &--size__#{$key}:not(.s_button--icon):not(.s_button--fab):not(.s_button--text) {
      min-width: #{round($size * 1.7778)}px;
      height: #{$size}px;
      padding: 0 #{calc($size / 2.25)}px;
    }

    &--size__#{$key}.s_button--icon,
    &--size__#{$key}.s_button--fab {
      width: #{$size}px;
      height: #{$size}px;
    }

    &--size__#{$key}.s_button--text {
      height: #{$size}px;
    }
  }

  @each $key, $size in $s_button__icon--fontSizes {
    &--size__#{$key}.s_button--icon {
      font-size: #{$size}px;
    }
  }

  &--outlined {
    @include s_buttonOutlined();
  }

  &--underlined {
    @include s_buttonUnderlined();
  }

  &--tile {
    @include s_tile();
  }

  &--readonly {
    user-select: none;

    // except for touch devices
    @media (hover: hover) {
      &:hover::before {
        opacity: 1;
      }

      &:focus:hover::before {
        opacity: 1;
      }
    }
  }
}

$s_bottomNavigationButtonFontSize: map-deep-get($s_headings, 'caption', 'size') !default;
$s_bottomNavigationButtonMinWidth: 80px !default;
$s_bottomNavigationButtonMaxWidth: 168px !default;
$s_bottomNavigationShiftButtonTop: calc(100% - 12px) !default;
$s_bottomNavigationShiftButtonActiveTop: calc(100% - 22px) !default;

.s_button.s_bottomNavigationButton {
  position: relative;
  flex: 0 1 auto;
  flex-direction: column;
  min-width: $s_bottomNavigationButtonMinWidth;
  max-width: $s_bottomNavigationButtonMaxWidth;
  height: inherit;
  font-size: $s_bottomNavigationButtonFontSize;
  text-transform: none;
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;

  &--grow {
    flex: 1 0;
    width: 100%;
    max-width: unset;
  }

  &--shift {
    > *:not(.s_icon) {
      display: none;
    }
  }

  &::after {
    content: none;
  }

  > *:not(.s_icon) {
    line-height: 1.2;
  }
}
</style>
