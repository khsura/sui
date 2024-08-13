<template>
  <div class="s_app" :style="styles">
    <slot></slot>
    <PortalTarget :name="defaultOverlayClass" multiple></PortalTarget>
    <div id="sAppOverlayContainer"></div>
  </div>
</template>
<script setup lang="ts">
import { defaultOverlayClass } from '@khsura/sui/constants'
import { propsApp } from '@khsura/sui/props'
import { useAppService } from '@khsura/sui/services'
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

    .s_backgroundColor__#{$colorName} {
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
