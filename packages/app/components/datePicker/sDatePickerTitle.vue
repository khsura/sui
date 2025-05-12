<template>
  <div class="s_datePickerTitle" :class="classes" :style="styles">
    <div>
      <SButton
        block
        class="s_datePickerTitle__year"
        :disabled="disabled"
        :readonly="readonly || selectedType === DatePickerSelectType.year"
        variant="text"
        tile
        size="mini"
        @click="updateSelectedType(DatePickerSelectType.year)"
      >
        {{ subtitle }}
      </SButton>
    </div>
    <div>
      <SButton
        block
        class="s_datePickerTitle__text"
        :disabled="disabled"
        :readonly="readonly || isLastSelectType"
        variant="text"
        tile
        size="extra"
        @click="updateSelectedType(DatePickerSelectType.date)"
      >
        {{ title }}
      </SButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import SButton from '@khsura/sui/components/sButton.vue'
import { DatePickerSelectType } from '@khsura/sui/constants'
import type { PropsDatePickerItemTitle } from '@khsura/sui/definitions'
import { useColorService, useDatePickerItemTitleService } from '@khsura/sui/services'
import { datePickerDisplayFormat } from '@khsura/sui/configs'

const props = withDefaults(defineProps<PropsDatePickerItemTitle>(), {
  dateFormat: datePickerDisplayFormat.date,
  monthFormat: datePickerDisplayFormat.month,
  yearFormat: datePickerDisplayFormat.year,
})

const emit = defineEmits<{
  (event: 'update:date', value: string): void
  (event: 'update:selected-type', value: string): void
  (event: 'update:selected', value: string): void
}>()

const { subtitle, title, updateSelectedType, isLastSelectType } = useDatePickerItemTitleService(props, emit)
const { classListColor, styleListColor } = useColorService(props)

const classes = computed(() => {
  return {
    ...classListColor.value,
  }
})

const styles = computed(() => {
  return {
    ...styleListColor.value,
  }
})
</script>

<style lang="scss">
.s_datePickerTitle {
  padding-top: 8px;

  &__year,
  &__text {
    justify-content: start;
    padding-right: 16px !important;
    padding-left: 16px !important;
    color: unset;
  }

  &__text {
    font-size: 1.2rem;
    font-weight: 700;
  }
}
</style>
