<template>
  <Teleport v-if="isReady" :to="`#${overlaysContainerId}`" :disabled="disabled">
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
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { overlaysContainerId } from '@khsura/sui/constants'
import type { PropsOverlay } from '@khsura/sui/definitions'

defineProps<PropsOverlay>()
const isReady = ref(false)

onMounted(() => {
  isReady.value = true
})
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
    outline: none;
    background-color: $s_color__black;
    border-radius: inherit;
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
