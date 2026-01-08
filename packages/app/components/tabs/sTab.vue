<template>
  <SToggleButton :index="tab" v-bind="$props">
    <slot></slot>
  </SToggleButton>
</template>
<script setup lang="ts">
import { SToggleButton } from '@/app/components/toggleButtonGroup'
import type { PropsTab } from '@/app/definitions'

defineProps<PropsTab>()
</script>
