<template>
  <section class="s_dialog">
    <div ref="activatorElement">
      <slot name="activator" :on="activatorOn" :attrs="activatorAttrs"></slot>
    </div>
    <SOverlay
      v-slot="{ attrs }"
      scrim
      :value="model"
      :z-index="zIndex"
      :transition="transitionName"
      @click:scrim="localOnClickOutside"
    >
      <div
        v-bind="attrs"
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        :class="contentClasses"
        :style="contentStyles"
      >
        <slot></slot>
      </div>
    </SOverlay>
  </section>
</template>
<script setup lang="ts">
import { watch, useTemplateRef, provide } from 'vue'
import { onClickOutside } from '@vueuse/core'
import SOverlay from '@/app/components/sOverlay.vue'
import type { PropsDialog } from '@/app/definitions'
import {
  useActivatorElementService,
  useBackgroundScrollService,
  useComponentDefaultsService,
  useDialogService,
  useOverlayFocusService,
} from '@/app/services'
import { ProviderPropsName } from '@/app/configs'

const rawProps = defineProps<PropsDialog>()
const props = useComponentDefaultsService('SDialog', rawProps)
const model = defineModel<boolean>()

provide(ProviderPropsName.dialog, props)
const activatorElement = useTemplateRef('activatorElement')

const {
  activatorOn,
  activatorAttrs,
  contentClasses,
  contentStyles,
  transitionName,
  onClickOutside: localOnClickOutside,
} = useDialogService(props, model, activatorElement)

const { enableBackgroundScroll, disableBackgroundScroll } = useBackgroundScrollService()
const dialogRef = useTemplateRef('dialogRef')
const { computedActivatorElement } = useActivatorElementService(props, activatorElement)

// Modal: focus moves into the dialog and Tab stays inside; Esc closes it unless persistent; focus returns.
useOverlayFocusService(
  model,
  { activator: computedActivatorElement, content: dialogRef },
  { canCloseOnEscape: () => !props.persistent, trapFocus: true },
)

// The scrim also closes the dialog through its own click listener (@click:scrim): on iOS Safari a tap on it
// never reaches this window-level handler.
onClickOutside(dialogRef, localOnClickOutside, {
  ignore: ['.s_menu__content', '.s_tooltip__content', '.s_select__list', '.s_snackbar__wrapper'],
})

watch(model, (value) => {
  if (value) {
    disableBackgroundScroll()
  } else {
    enableBackgroundScroll()
  }
})
</script>

<style lang="scss">
$kDialogMargin: $s_spacer * 6;
$kDialogViewportWidth: calc(100% - $kDialogMargin);
$kDialogViewportHeight: 90%;

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

    // The size props arrive as CSS variables and are capped here, so a `max-width` wider than the screen
    // still leaves a gutter on a phone.
    width: min(var(--s-dialog-width, 100%), $kDialogViewportWidth);
    max-width: min(var(--s-dialog-max-width, 100%), $kDialogViewportWidth);
    height: var(--s-dialog-height, auto);
    margin: $kDialogMargin;
    overflow-y: auto;
    pointer-events: auto;
    transform: translate(-50%, -50%);

    &--bottom {
      top: unset;
      bottom: 0;
      width: var(--s-dialog-width, 100%);
      max-width: var(--s-dialog-max-width, $kDialogViewportWidth);
      transform: translate(-50%, 0%);

      @include s_breakpointUp('sm') {
        width: var(--s-dialog-width, max-content);
        min-width: 600px;
      }

      &.s_dialog__content--fullscreen {
        top: unset;
        bottom: 0;
        left: 50%;
        max-height: 90%;

        // a bottom sheet never reaches the notch, only the home indicator
        padding-top: 0;
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

      // keep the content clear of the notch, home indicator and landscape side insets (0px without a safe
      // area); the card colour fills the inset strips so they read as part of the dialog
      padding: s_safeAreaInset('top') s_safeAreaInset('right') s_safeAreaInset('bottom') s_safeAreaInset('left');
      margin: 0;
      overflow-y: auto;
      background-color: s_getAppColor('card');
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
      max-height: min(var(--s-dialog-max-height, 100%), $kDialogViewportHeight);
    }

    > * {
      width: 100%;
    }
  }
}
</style>
