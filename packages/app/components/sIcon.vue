<template>
  <span aria-hidden="true" :class="classList" :style="styleList"></span>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { propsIcon } from '@khsura/sui/props'
import { useComponentThemeService, useSizeService, useTextColorService } from '@khsura/sui/services'

const props = defineProps(propsIcon())
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
