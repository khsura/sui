<template>
  <Teleport v-if="isReady" :to="teleportTo" :disabled="disabled">
    <div v-if="scrim" class="s_overlay" :style="{ zIndex }">
      <Transition name="s_transition--appear">
        <div v-if="value" class="s_overlay__scrim"></div>
      </Transition>
      <Transition :name="transition">
        <slot v-if="value" :attrs="{ class: 's_overlay__content' }" :value="value"></slot>
      </Transition>
    </div>
    <Transition v-else :name="transition">
      <slot v-if="value" :attrs="{ class: 's_overlay__content' }" :value="value"></slot>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { propsOverlay } from '@sui/app/props'
import { useOverlayService } from '@sui/app/services'

const props = defineProps(propsOverlay())
const { isReady } = useOverlayService(props)
</script>

<style lang="scss">
.s_overlayContainer {
  position: absolute;
  top: 0;
  left: 0;
  display: contents;
  pointer-events: none;
  contain: layout;
}

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
    z-index: 5;
    pointer-events: auto;
    outline: none;
    contain: layout;
  }
}
</style>
