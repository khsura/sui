<template>
  <SToggleButtonGroup
    v-model="model"
    v-bind="{ outlined, underlined, rounded, tile }"
    :multiple="false"
    :dense="dense"
    :bordered="bordered"
    :shrink="shrink"
    :selected-button-color="selectedTabColor"
    mandatory
    selected-button-underlined
  >
    <slot></slot>
  </SToggleButtonGroup>
</template>
<script setup lang="ts">
import { SToggleButtonGroup } from '@khsura/sui/components/toggleButtonGroup'
import { propsTabs } from '@khsura/sui/props'
import { computed } from 'vue'

const props = defineProps({
  ...propsTabs(),
})

const emit = defineEmits<(event: 'update:modelValue', value: number | string) => void>()

const model = computed({
  get(): Array<number | string> {
    return [props.modelValue]
  },
  set(value: Array<number | string>) {
    emit('update:modelValue', value?.[0])
  },
})
</script>
