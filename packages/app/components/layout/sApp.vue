<template>
  <div class="s_app" :style="styles">
    <slot></slot>
    <div :id="overlaysContainerId"></div>
  </div>
</template>
<script setup lang="ts">
import { overlaysContainerId } from '@/app/constants'
import { useAppService } from '@/app/services'
import type { PropsApp } from '@/app/definitions'

const props = withDefaults(defineProps<PropsApp>(), {
  app: true,
})

const { styles } = useAppService(props)
</script>

<style lang="scss">
.s_app {
  // The iPhone notch / home-indicator insets (0px without `viewport-fit=cover` or a safe area). The fixed app
  // bar, bottom navigation, mobile drawer, fullscreen dialog and snackbar pad by these; override them on a
  // element to simulate a device in a story or test. The fallback keeps its unit: a unitless 0 is invalid in calc().
  /* stylelint-disable length-zero-no-unit */
  --s-safe-area-top: env(safe-area-inset-top, 0px);
  --s-safe-area-right: env(safe-area-inset-right, 0px);
  --s-safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --s-safe-area-left: env(safe-area-inset-left, 0px);
  /* stylelint-enable length-zero-no-unit */
  display: flex;
  flex: 1 1 auto;
  flex-flow: column;

  // fill the viewport, so a short page keeps the app background (and a layout's drawer) down to the bottom
  min-height: 100vh;
  font-family: $s_fontFamily;
  line-height: $s_lineHeight;
  color: s_getAppColor('text');
  background-color: s_getAppColor('background');
  fill: s_getAppColor('text');

  // the dynamic viewport height leaves out the mobile browser bars that 100vh counts
  @supports (min-height: 100dvh) {
    min-height: 100dvh;
  }

  ::-ms-clear,
  ::-ms-reveal {
    display: none;
  }

  a {
    color: s_getAppColor('anchor');

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

    // the preset's readable variant: 4.5:1 on the app background and cards in either theme
    .s_textColor__#{$colorName}:not(.s_disabled) {
      color: var(--s-color-#{$colorName}--readable, #{$colorValue});
      fill: var(--s-color-#{$colorName}--readable, #{$colorValue});
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
