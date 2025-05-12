<template>
  <section class="s_dialog">
    <div ref="activatorElement">
      <slot name="activator" :on="activatorOn" :attrs="activatorAttrs"></slot>
    </div>
    <SOverlay v-slot="{ attrs }" scrim :value="model" :transition="transitionName">
      <div v-bind="attrs" :class="contentClasses" :style="contentStyles" ref="dialogRef">
        <slot></slot>
      </div>
    </SOverlay>
  </section>
</template>
<script setup lang="ts">
import { watch, ref } from 'vue'
import SOverlay from '@khsura/sui/components/sOverlay.vue'
import { ProviderPropsName } from '@khsura/sui/constants'
import type { PropsDialog } from '@khsura/sui/definitions'
import { useDialogService, useProviderService, useBackgroundScrollService } from '@khsura/sui/services'
import { onClickOutside } from '@vueuse/core'

const props = defineProps<PropsDialog>()
const model = defineModel<boolean>()
const { provideProps } = useProviderService()

provideProps(ProviderPropsName.dialog, props)

const {
  activatorOn,
  activatorAttrs,
  activatorElement,
  contentClasses,
  contentStyles,
  transitionName,
  onClickOutside: localOnClickOutside,
} = useDialogService(props, model)

const { enableBackgroundScroll, disableBackgroundScroll } = useBackgroundScrollService()
const dialogRef = ref<HTMLElement | null>(null)

onClickOutside(dialogRef, localOnClickOutside, {
  ignore: ['.s_menu__content', '.s_tooltip__content', '.s_select__list', '.s_snackbar__wrapper'],
})

watch(model, async (value) => {
  if (value) {
    await disableBackgroundScroll()
  } else {
    await enableBackgroundScroll()
  }
})
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
        overflow: auto;
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

        /* stylelint-disable selector-max-compound-selectors */
        > .s_card__title,
        > .s_card__actions {
          flex: 0 0 auto;
        }

        > .s_card__text {
          flex: 1 1 auto;
          overflow-y: auto;
          backface-visibility: hidden;
        }
        /* stylelint-enable selector-max-compound-selectors */
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
