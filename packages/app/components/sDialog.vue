<template>
  <section class="s_dialog">
    <div ref="activatorElement">
      <slot name="activator" :on="activatorOn" :attrs="activatorAttrs"></slot>
    </div>
    <SOverlay v-slot="{ attrs }" scrim :value="model" :transition="transitionName">
      <div
        v-bind="attrs"
        ref="contentElement"
        :class="{ ...contentClasses, ...classListElevation }"
        :style="contentStyles"
      >
        <slot></slot>
      </div>
    </SOverlay>
  </section>
</template>
<script setup lang="ts">
import SOverlay from '@sui/app/components/sOverlay.vue'
import { propsDialog, propsElevation } from '@sui/app/props'
import { useDialogService, useElevationService } from '@sui/app/services'

const props = defineProps({ ...propsDialog(), ...propsElevation() })
const emit = defineEmits<(event: 'update:modelValue', value: boolean | null | undefined) => void>()

const {
  activatorOn,
  activatorAttrs,
  activatorElement,
  contentClasses,
  contentStyles,
  contentElement,
  model,
  transitionName,
} = useDialogService(props, emit)

const { classListElevation } = useElevationService(props)
</script>

<style lang="scss">
$kDialogMargin: $s_spacer * 6;

@keyframes s-animation-dialog-bottom {
  0% {
    transform: translate(-50%, 120%);
  }

  100% {
    transform: translate(-50%, 0%);
  }
}

.s_transition__dialog--bottom {
  &-enter-active {
    animation: s-animation-dialog-bottom 0.1s;
  }

  &-leave-active {
    animation: s-animation-dialog-bottom 0.1s reverse;
  }
}

.s_dialog {
  &__content {
    @include s_borderRadius();
    @include s_elevation(1);
    position: fixed;
    top: calc(50% - $kDialogMargin);
    left: calc(50% - $kDialogMargin);
    width: 100%;
    max-width: calc(100% - $kDialogMargin);
    margin: $kDialogMargin;
    overflow-y: auto;
    pointer-events: auto;
    transform: translate(-50%, -50%);

    &--bottom {
      top: unset;
      bottom: 0;
      width: 100%;
      transform: translate(-50%, 0%);

      @include s_breakpointUp('sm') {
        width: max-content;
        min-width: 600px;
      }

      &.s_dialog__content--fullscreen {
        top: unset;
        bottom: 0;
        left: 50%;
        max-height: 90%;
        transform: translate(-50%, 0%);
      }
    }

    &--fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      max-width: unset;
      height: 100%;
      margin: 0;
      overflow-y: auto;
      border-radius: 0;
      transform: translate(0, 0);

      > .s_card,
      > .s_list {
        height: 100%;
        border-radius: 0;
      }
    }

    &--scrollable,
    &--scrollable > form {
      display: flex;

      > .s_card {
        display: flex;
        flex: 1 1 100%;
        flex-direction: column;
        max-width: 100%;
        max-height: 100%;

        /* stylelint-disable-next-line selector-max-compound-selectors */
        > .s_card__title,
        > .s_card__actions {
          flex: 0 0 auto;
        }

        /* stylelint-disable-next-line selector-max-compound-selectors */
        > .s_card__text {
          flex: 1 1 auto;
          overflow-y: auto;
          backface-visibility: hidden;
        }
      }
    }

    &:not(.s_dialog__content--fullscreen) {
      max-height: 90%;
    }

    > * {
      width: 100%;
    }
  }
}
</style>
