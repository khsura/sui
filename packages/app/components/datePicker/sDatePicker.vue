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
      :month-format="monthFormat"
      :year-format="yearFormat"
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
      :color="color"
      :color-threshold="colorThreshold"
    ></SDatePickerSwitch>

    <Component
      :is="datePickerComponent"
      v-model:selected-type="selectedType"
      v-model:date="selectedDateTemporary"
      v-model:selected="selectedDateFormatted"
      class="s_datePicker__item"
      :today="today"
      :color="color"
      :color-threshold="colorThreshold"
      :type="type"
      :max="max"
      :min="min"
      :dense="dense"
    ></Component>
  </SCard>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue'
import SDatePickerDate from './sDatePickerDate.vue'
import SDatePickerMonth from './sDatePickerMonth.vue'
import SDatePickerSwitch from './sDatePickerSwitch.vue'
import SDatePickerTitle from './sDatePickerTitle.vue'
import SDatePickerYear from './sDatePickerYear.vue'
import { SCard } from '@/app/components/cards'
import type { PropsDatePicker } from '@/app/definitions'
import { convertDatePickerValue, getDatePickerFormat } from '@/app/repositories'
import { useComponentDefaultsService, useDatePickerService, useMeasurableStylesService } from '@/app/services'
import dayjs from '@/app/vendors/dayjs'
import { datePickerDisplayFormat } from '@/app/configs'

const rawProps = withDefaults(defineProps<PropsDatePicker>(), {
  type: 'date',
  today: () => dayjs().format('YYYY-MM-DD'),
  dateFormat: datePickerDisplayFormat.date,
  monthFormat: datePickerDisplayFormat.month,
  yearFormat: datePickerDisplayFormat.year,
})

const props = useComponentDefaultsService('SDatePicker', rawProps)

const emit = defineEmits<{
  (event: 'change'): void
}>()

const { measurableStyles } = useMeasurableStylesService(props)
const model = defineModel<string | null>()

const getFormattedValue = (value?: string | null) => {
  return dayjs(value ?? undefined).format(getDatePickerFormat(props.type))
}

const selectedDateFormatted = computed({
  get: () => {
    return getFormattedValue(model.value)
  },
  set: (value: string) => {
    emit('change')
    model.value = value
  },
})

const { selectedType, selectedDateTemporary } = useDatePickerService(props, model)

const datePickerComponent = computed(() => {
  if (selectedType.value === 'year') {
    return SDatePickerYear
  }

  if (selectedType.value === 'month') {
    return SDatePickerMonth
  }

  return SDatePickerDate
})

watch(
  () => props.type,
  () => {
    if (model.value) {
      model.value = convertDatePickerValue(model.value, props.type)
    }
  },
)
</script>

<style lang="scss">
.s_datePicker__item {
  position: relative;
  max-height: 280px;
  overflow-y: auto;
}
</style>
