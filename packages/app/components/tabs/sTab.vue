<template>
  <SToggleButton :index="tab" v-bind="$props">
    <slot></slot>
  </SToggleButton>
</template>
<script setup lang="ts">
import { SToggleButton } from '@khsura/sui/components/toggleButtonGroup'
import type { PropsTab } from '@khsura/sui/definitions'

defineProps<PropsTab>()
</script>
