<template>
  <div class="s_datePickerDate">
    <div class="s_datePickerDate__days">
      <div
        v-for="weekdayName in dayjs.weekdaysShort()"
        :key="weekdayName"
        class="s_datePickerDate__day s_datePickerDate__day--head"
      >
        {{ weekdayName }}
      </div>
      <div v-for="(date, i) in dates" :key="i" class="s_datePickerDate__day">
        <SButton
          variant="text"
          rounded
          :outlined="date.isCurrent && !date.isSelected"
          :class="{
            s_datePickerDate__button: true,
            's_datePickerDate__button--disabled': !date.isCurrentMonth || date.isDisabled,
            's_datePickerDate__button--selected': date.isSelected,
            's_datePickerDate__button--today': date.isCurrent,
            ...(date?.isSelected ? classListColor : {}),
          }"
          :style="{
            ...(date?.isSelected ? styleListColor : {}),
          }"
          @click="date.select()"
        >
          {{ date.title }}
        </SButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SButton from '@khsura/sui/components/sButton.vue'
import type { PropsDatePickerItem } from '@khsura/sui/definitions'
import { useColorService, useDatePickerItemDateService } from '@khsura/sui/services'
import dayjs from '@khsura/sui/vendors/dayjs'

const props = defineProps<PropsDatePickerItem>()

const emit = defineEmits<{
  (event: 'update:date', value: string): void
  (event: 'update:selected-type', value: string): void
  (event: 'update:selected', value: string): void
}>()

const { dates } = useDatePickerItemDateService(props, emit)
const { classListColor, styleListColor } = useColorService(props, { isText: true })
</script>
<style lang="scss">
.s_datePickerDate {
  &__days {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
  }

  &__day {
    display: flex;
    flex: 0 0 calc(100% / 7);
    align-items: center;
    justify-content: center;

    &--head {
      @include s_typography('caption');
    }
  }

  &__button {
    width: 36px;
    min-width: auto;
    height: 36px;
    cursor: pointer;

    &--disabled {
      @include s_typography('caption');
      @include s_disabled(true);
    }

    &--today {
      font-weight: 700;
    }
  }
}
</style>
