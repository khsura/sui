<template>
  <div class="s_app" :style="styles">
    <slot></slot>
    <PortalTarget :name="defaultOverlayClass" multiple></PortalTarget>
  </div>
</template>
<script setup lang="ts">
import { defaultOverlayClass } from '@sui/app/constants'
import { propsApp } from '@sui/app/props'
import { useAppService } from '@sui/app/services'
import { PortalTarget } from 'portal-vue'

const props = defineProps(propsApp())
const { styles } = useAppService(props)
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

  a {
    color: s_getAppColor('text');

    &:hover {
      text-decoration: none;
    }
  }

  .s_textColor__error {
    a {
      color: s_getPresetColor('error');

      &:hover {
        color: s_getAppColor('textErrorHover');
      }
    }
  }

  ::-ms-clear,
  ::-ms-reveal {
    display: none;
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
}
</style>
