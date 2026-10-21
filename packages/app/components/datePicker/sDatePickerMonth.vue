<template>
  <SRow class="s_datePickerMonth" no-gutters>
    <SColumn
      v-for="month in months"
      :key="month.value"
      cols="4"
      class="s_datePickerMonth__item"
      :class="{
        's_datePickerMonth__item--selected': month.isSelected,
      }"
    >
      <SButton
        v-bind="getItemButtonProps(month.isSelected)"
        class="s_datePickerMonth__button"
        block
        :disabled="month.isDisabled"
        :class="{
          's_datePickerMonth__button--current': month.isCurrent,
        }"
        @click="month.select()"
      >
        {{ month.title }}
      </SButton>
    </SColumn>
  </SRow>
</template>
<script setup lang="ts">
import { SColumn, SRow } from '@/app/components/grids'
import SButton from '@/app/components/sButton.vue'
import type { PropsDatePickerItem } from '@/app/definitions'
import { useDatePickerItemMonthService } from '@/app/services'

const props = defineProps<PropsDatePickerItem>()

const emit = defineEmits<{
  (event: 'update:date', value: string): void
  (event: 'update:selected-type', value: string): void
  (event: 'update:selected', value: string): void
}>()

const { months, getItemButtonProps } = useDatePickerItemMonthService(props, emit)
</script>
<style lang="scss">
.s_datePickerMonth {
  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__button {
    &--current {
      font-weight: 700;
    }
  }
}
</style>
