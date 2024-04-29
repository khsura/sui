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
        text
        class="s_datePickerMonth__button"
        block
        :disabled="month.isDisabled"
        :class="{
          's_datePickerMonth__button--current': month.isCurrent,
          ...(month.isSelected ? classListColor : {}),
        }"
        :style="{
          ...(month.isSelected ? styleListColor : {}),
        }"
        @click="month.select()"
      >
        {{ month.title }}
      </SButton>
    </SColumn>
  </SRow>
</template>
<script setup lang="ts">
import { SColumn, SRow } from '@sui/app/components/grids'
import SButton from '@sui/app/components/sButton.vue'
import { propsColor, propsDatePickerItem } from '@sui/app/props'
import { useColorService, useDatePickerItemMonthService } from '@sui/app/services'

const props = defineProps({
  ...propsDatePickerItem(),
  ...propsColor(),
})

const emit = defineEmits<{
  (event: 'update:date', value: string): void
  (event: 'update:selected-type', value: string): void
  (event: 'update:selected', value: string): void
}>()

const { months } = useDatePickerItemMonthService(props, emit)
const { classListColor, styleListColor } = useColorService(props, { isText: true })
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
