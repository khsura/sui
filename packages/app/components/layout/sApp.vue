<template>
  <div class="s_app" :style="styles">
    <slot></slot>
    <PortalTarget :name="defaultOverlayClass" multiple></PortalTarget>
  </div>
</template>
<script setup lang="ts">
import { defaultOverlayClass } from '@khsura/sui/constants'
import { propsApp } from '@khsura/sui/props'
import { useAppService, useThemeService } from '@khsura/sui/services'
import { type AppThemeType } from '@khsura/sui/types'
import { PortalTarget } from 'portal-vue'
import { watch } from 'vue'

const props = defineProps(propsApp())
const { styles } = useAppService(props)
const { setTheme, theme } = useThemeService()

const themeModel = defineModel<AppThemeType>('theme', {
  set: (value) => {
    if (value !== theme.value) {
      setTheme(value)
    }

    return theme.value
  },
})

watch(theme, () => {
  if (theme.value !== themeModel.value) {
    themeModel.value = theme.value
  }
})
</script>

<style lang="scss">
.s_app {
  display: flex;
  flex-flow: column;
  flex-wrap: 1 1 auto;
  font-family: $s_fontFamily;
  line-height: $s_lineHeight;
  color: s_getAppColor('text');
  background-color: s_getAppColor('background');
  fill: s_getAppColor('text');

  ::-ms-clear,
  ::-ms-reveal {
    display: none;
  }

  a {
    color: s_getAppColor('text');

    &:hover {
      text-decoration: none;
    }
  }

  @each $colorName in $s_presetColorNames {
    $colorValue: s_getPresetColor($colorName);
    $textColorValue: s_getPresetColor($colorName, true);

    .s_backgroundColor__#{$colorName}:not(.s_disabled) {
      color: $textColorValue;
      background-color: $colorValue;
      fill: $textColorValue;
    }

    .s_textColor__#{$colorName}:not(.s_disabled) {
      color: $colorValue;
      fill: $colorValue;
    }
  }

  @each $colorName in $s_appExposedColorNames {
    $colorValue: s_getAppColor($colorName);
    $textColorValue: s_getAppColor($colorName, true);

    .s_backgroundColor__#{$colorName}:not(.s_disabled) {
      color: $textColorValue;
      background-color: $colorValue;
      fill: $textColorValue;
    }

    .s_textColor__#{$colorName}:not(.s_disabled) {
      color: $colorValue;
      fill: $colorValue;
    }
  }

  .s_textColor__error:not(.s_disabled) {
    a {
      color: s_getPresetColor('error');

      &:hover {
        color: s_getAppColor('textErrorHover');
      }
    }
  }
}
</style>
