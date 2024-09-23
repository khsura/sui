<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Default } from './layouts'

const route = useRoute()

const layouts = {
  default: Default,
}

const layout = computed(() => {
  return layouts[route.meta.layout ?? 'default']
})
</script>
