<template>
  <SToggleButtonGroup
    v-model="model"
    class="s_tabs"
    v-bind="{
      outlined: props.outlined,
      underlined: props.underlined,
      borderRadius: props.borderRadius,
      dense: props.dense,
      shrink: props.shrink,
      bordered: props.bordered,
      selectedColor: props.selectedTabColor,
    }"
    :multiple="false"
    mandatory
  >
    <slot></slot>
  </SToggleButtonGroup>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { SToggleButtonGroup } from '@/app/components/toggleButtonGroup'
import type { PropsTabs } from '@/app/definitions'
import { useComponentDefaultsService } from '@/app/services'

const rawProps = withDefaults(defineProps<PropsTabs>(), {
  selectedTabColor: 'primary',
})

const props = useComponentDefaultsService('STabs', rawProps)
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
