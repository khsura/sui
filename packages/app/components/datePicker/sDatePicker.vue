<template>
  <SCard class="s_datePicker" :style="measurableStyles">
    <SDatePickerTitle
      v-if="!hideTitle"
      v-model:selected-type="selectedType"
      v-model:date="selectedDateTemporary"
      v-model:selected="selectedDateFormatted"
      :type="type"
      :color="color"
      :date-format="dateFormat"
      :today="today"
      :disabled="disabled"
      :readonly="readonly"
      :max="max"
      :min="min"
      :dense="dense"
    ></SDatePickerTitle>

    <SDatePickerSwitch
      v-model:date="selectedDateTemporary"
      v-model:selected-type="selectedType"
      v-model:selected="selectedDateFormatted"
      :type="type"
      :today="today"
      :month-format="monthFormat"
      :year-format="yearFormat"
      :max="max"
      :min="min"
      :dense="dense"
    ></SDatePickerSwitch>

    <Component
      :is="datePickerComponent"
      v-model:selected-type="selectedType"
      v-model:date="selectedDateTemporary"
      v-model:selected="selectedDateFormatted"
      class="s_datePicker__item"
      :today="today"
      :color="color"
      :type="type"
      :height="datePickerItemHeight"
      :max="max"
      :min="min"
      :dense="dense"
    ></Component>
  </SCard>
</template>
<script setup lang="ts">
import { SCard } from '@sui/app/components/cards'
import { propsDatePicker } from '@sui/app/props'
import { useDatePickerService, useMeasurableStylesService } from '@sui/app/services'
import { computed } from 'vue'
import SDatePickerDate from './sDatePickerDate.vue'
import SDatePickerMonth from './sDatePickerMonth.vue'
import SDatePickerSwitch from './sDatePickerSwitch.vue'
import SDatePickerTitle from './sDatePickerTitle.vue'
import SDatePickerYear from './sDatePickerYear.vue'

const props = defineProps(propsDatePicker())

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change'): void
}>()

const { measurableStyles } = useMeasurableStylesService(props)

const {
  selectedType,
  selectedDateFormatted,
  selectedDateTemporary,
  datePickerItemHeight,
  datePickerItemHeightCssAttribute,
} = useDatePickerService(props, emit)

const datePickerComponent = computed(() => {
  if (selectedType.value === 'year') {
    return SDatePickerYear
  }

  if (selectedType.value === 'month') {
    return SDatePickerMonth
  }

  return SDatePickerDate
})
</script>
<style lang="scss">
.s_datePicker {
  &__item {
    position: relative;
    height: v-bind(datePickerItemHeightCssAttribute);
    overflow-y: auto;
  }
}
</style>
