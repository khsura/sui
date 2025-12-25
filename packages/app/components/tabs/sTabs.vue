<template>
  <SToggleButtonGroup
    v-model="model"
    v-bind="{ outlined, underlined, borderRadius }"
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
import { computed } from 'vue'
import { SToggleButtonGroup } from '@/app/components/toggleButtonGroup'
import type { PropsTabs } from '@/app/definitions'

const props = withDefaults(defineProps<PropsTabs>(), {
  selectedTabColor: 'primary',
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
