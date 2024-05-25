<template>
  <SToggleButton :index="tab" :disabled="disabled" v-bind="$props">
    <slot></slot>
  </SToggleButton>
</template>
<script setup lang="ts">
import { SToggleButton } from '@khsura/sui/components/toggleButtonGroup'
import { propsColumn } from '@khsura/sui/props'

defineProps({
  tab: {
    type: [Number, String],
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  ...propsColumn(),
})
</script>
