<template>
  <SToggleButton :index="tab" :disabled="disabled" v-bind="$props">
    <slot></slot>
  </SToggleButton>
</template>
<script setup lang="ts">
import { SToggleButton } from '@sui/app/components/toggleButtonGroup'
import { propsColumn } from '@sui/app/props'

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
