<template>
  <div ref="datePickerYear" class="s_datePickerYear">
    <SButton
      v-for="year in years"
      :key="year.value"
      block
      variant="text"
      tile
      size="large"
      :disabled="year.isDisabled"
      :class="{
        's_datePickerYear__year--current': year.isCurrent,
        's_datePickerYear__year--selected': year.isSelected,
        ...(year.isSelected ? classListColor : {}),
      }"
      :style="{
        ...(year.isSelected ? styleListColor : {}),
      }"
      @click="year.select()"
    >
      {{ year.title }}
    </SButton>
  </div>
</template>
<script setup lang="ts">
import SButton from '@sui/app/components/sButton.vue'
import { propsColor, propsDatePickerItem } from '@sui/app/props'
import { useColorService, useDatePickerItemYearService, useScrollService } from '@sui/app/services'
import { nextTick, onMounted, ref } from 'vue'

const datePickerYear = ref<HTMLElement | null>(null)

const props = defineProps({
  ...propsDatePickerItem(),
  ...propsColor(),
})

const emit = defineEmits<{
  (event: 'update:date', value: string): void
  (event: 'update:selected-type', value: string): void
  (event: 'update:selected', value: string): void
}>()

const { years } = useDatePickerItemYearService(props, emit)
const { smoothElementScroll } = useScrollService()

const { classListColor, styleListColor } = useColorService(props, {
  isText: true,
})

onMounted(async () => {
  await nextTick()
  smoothElementScroll(datePickerYear.value, {
    top:
      (datePickerYear.value?.querySelector<HTMLElement>('.s_datePickerYear__year--selected')?.offsetTop ?? 0) -
      (props.height ?? 0) / 2 +
      24,
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
      color: s_getPresetColor('info');
    }
  }
}
</style>
