<template>
  <div ref="datePickerYear" class="s_datePickerYear">
    <SButton
      v-for="year in years"
      :key="year.value"
      v-bind="getItemButtonProps(year.isSelected)"
      block
      tile
      size="large"
      :disabled="year.isDisabled"
      :class="{
        's_datePickerYear__year--current': year.isCurrent,
        's_datePickerYear__year--selected': year.isSelected,
      }"
      @click="year.select()"
    >
      {{ year.title }}
    </SButton>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import SButton from '@/app/components/sButton.vue'
import type { PropsDatePickerItem } from '@/app/definitions'
import { useComponentDefaultsService, useDatePickerItemYearService, useScrollService } from '@/app/services'

const datePickerYear = ref<HTMLElement | null>(null)
const rawProps = defineProps<PropsDatePickerItem>()
const props = useComponentDefaultsService('SDatePickerYear', rawProps)

const emit = defineEmits<{
  (event: 'update:date', value: string): void
  (event: 'update:selected-type', value: string): void
  (event: 'update:selected', value: string): void
}>()

const { years, getItemButtonProps } = useDatePickerItemYearService(props, emit)
const { smoothElementScroll } = useScrollService()

onMounted(async () => {
  await nextTick()
  smoothElementScroll(datePickerYear.value, {
    top: (datePickerYear.value?.querySelector<HTMLElement>('.s_datePickerYear__year--selected')?.offsetTop ?? 0) - 24,
  })
})
</script>
<style lang="scss">
.s_datePickerYear {
  &__year {
    &--current {
      font-weight: 700;
    }

    &--selected {
      font-size: 1.1rem;
      font-weight: 700;
    }
  }
}
</style>
