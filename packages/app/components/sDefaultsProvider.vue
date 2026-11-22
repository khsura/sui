<template>
  <slot />
</template>
<script setup lang="ts">
import { computed, provide } from 'vue'
import { ProviderName } from '@/app/configs'
import { mergeComponentDefaults } from '@/app/lib'
import type { PropsDefaultsProvider } from '@/app/definitions'
import { useComponentDefaultsRepository } from '@/app/repositories'

// Renderless: renders only its slot and scopes component defaults to that subtree.
const props = defineProps<PropsDefaultsProvider>()
const { getDefaults } = useComponentDefaultsRepository()

provide(
  ProviderName.componentDefaults,
  computed(() => mergeComponentDefaults(getDefaults(), props.defaults)),
)

defineSlots<{
  default: () => void
}>()
</script>
