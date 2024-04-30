<template>
  <Portal :to="defaultOverlayClass" :disabled="disabled">
    <div v-if="position === 'fixed' || scrim" class="s_overlay" :style="{ zIndex }">
      <Transition name="s_transition--appear">
        <div v-if="scrim && value" class="s_overlay__scrim"></div>
      </Transition>
      <Transition :name="transition">
        <slot v-if="value" :attrs="{ class: 's_overlay__content' }" :value="value"></slot>
      </Transition>
    </div>
    <Transition v-else :name="transition">
      <slot v-if="value" :attrs="{ class: 's_overlay__content' }" :value="value"></slot>
    </Transition>
  </Portal>
</template>

<script setup lang="ts">
import { propsOverlay } from '@sui/app/props'
import { Portal } from 'portal-vue'
import { defaultOverlayClass } from '@sui/app/constants'

defineProps(propsOverlay())
</script>

<style lang="scss">
.s_overlay {
  position: fixed;
  inset: 0;
  display: flex;
  pointer-events: none;
  border-radius: inherit;

  &__scrim {
    position: fixed;
    inset: 0;
    pointer-events: auto;
    background-color: $s_color__black;
    border-radius: inherit;
    outline: none;
    opacity: 0.5;
  }

  &__content {
    position: absolute;
    z-index: 1000;
    pointer-events: auto;
    outline: none;
    contain: layout;
  }
}
</style>
