<template>
  <span aria-hidden="true" :class="classList" :style="styleList"></span>
</template>
<script setup lang="ts">
import { propsSizeUnion, propsTextColor, propsComponentTheme } from '@sui/app/props'
import { useSizeService, useTextColorService, useComponentThemeService } from '@sui/app/services'
import { type MaterialDesignIcon, type MaterialDesignIconExtra } from '@sui/app/types'
import { computed } from 'vue'
import { type PropType } from 'vue'

const props = defineProps({
  icon: {
    type: String as PropType<MaterialDesignIcon>,
    required: true,
  },
  extra: {
    type: Array as PropType<Array<MaterialDesignIconExtra | string> | null>,
    default: () => [],
  },
  rotated: {
    type: Boolean as PropType<boolean | null | undefined>,
    default: false,
  },
  spin: {
    type: Boolean,
    default: false,
  },
  ...propsSizeUnion(),
  ...propsTextColor(),
  ...propsComponentTheme(),
})

const { classListTextColor, styleListTextColor, isPresetColor } = useTextColorService(props)
const { themeClasses } = useComponentThemeService(props)
const { classListSize, styleListSize } = useSizeService(props, { block: 'icon' })

const classList = computed((): Record<string, boolean | string> => {
  const extras = props.extra?.join?.(' ').trim() ?? ''

  return {
    s_icon: true,
    mdi: true,
    [props.icon]: !!props.icon,
    [extras]: !!extras,
    ...classListTextColor.value,
    ...classListSize.value,
    ...(isPresetColor.value ? {} : themeClasses.value),
    's_icon--rotated': props.rotated ?? false,
    's_icon--spin': props.spin,
  }
})

const styleList = computed(() => {
  return {
    ...styleListSize.value,
    ...styleListTextColor.value,
  }
})
</script>

<style lang="scss">
@import '@sui/app/styles/components/icon';
$defaultSize: map.get($s_icon--fontSizes, 'default');

.s_icon {
  display: inline-flex;
  align-self: center;
  font-size: $defaultSize;
  transition: transform $s_primaryTransition;

  &--rotated {
    transform: rotate(180deg);
  }

  &--spin {
    animation: s-spin-animation 2s infinite linear;
  }

  @each $name, $size in $s_icon--fontSizes {
    &--size__#{$name} {
      font-size: $size;
    }
  }
}
</style>
