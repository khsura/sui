<template>
  <div class="s_datePickerSwitch">
    <!-- Previous button -->
    <SButton
      v-if="switchType"
      tile
      variant="icon"
      :aria-label="prevAriaLabel"
      class="s_datePickerSwitch__navButton"
      :disabled="isPrevDisabled"
      color="none"
      :color-threshold="colorThreshold"
      @click="prev(switchType)"
    >
      <SIcon :icon="prevIcon"></SIcon>
    </SButton>

    <!-- Middle button -->
    <SButton
      v-if="switchType"
      class="s_datePickerSwitch__middleButton"
      tile
      color="none"
      variant="text"
      :size="dense ? 'default' : 'extra'"
      @click="() => updateSelectedType(switchType)"
    >
      {{ switchTitle }}
    </SButton>

    <!-- Next button -->
    <SButton
      v-if="switchType"
      tile
      variant="icon"
      color="none"
      class="s_datePickerSwitch__navButton"
      :color-threshold="colorThreshold"
      :aria-label="nextAriaLabel"
      :disabled="isNextDisabled"
      @click="next(switchType)"
    >
      <SIcon :icon="nextIcon"></SIcon>
    </SButton>
  </div>
</template>
<script setup lang="ts">
import SButton from '@/app/components/sButton.vue'
import SIcon from '@/app/components/sIcon.vue'
import type { PropsDatePickerItemSwitch } from '@/app/definitions'
import { useDatePickerItemSwitchService } from '@/app/services'

const props = withDefaults(defineProps<PropsDatePickerItemSwitch>(), {
  prevIcon: 'mdi-chevron-left',
  nextIcon: 'mdi-chevron-right',
})

const emit = defineEmits<{
  (event: 'update:date', value: string): void
  (event: 'update:selected-type', value: string): void
  (event: 'update:selected', value: string): void
}>()

const { updateSelectedType, next, prev, switchTitle, switchType, isNextDisabled, isPrevDisabled } =
  useDatePickerItemSwitchService(props, emit)
</script>
<style lang="scss" scoped>
.s_datePickerSwitch {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__navButton {
    margin: 0 4px;
  }

  &__middleButton {
    flex: 1 0 auto;
    font-weight: 700;
  }
}
</style>
