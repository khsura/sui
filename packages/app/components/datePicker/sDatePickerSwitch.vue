<template>
  <div class="s_datePickerSwitch">
    <!-- Previous button -->
    <SButton
      v-if="switchType"
      tile
      variant="icon"
      :aria-label="prevAriaLabel"
      :size="dense ? 'default' : 'extra'"
      :disabled="canGoPrev"
      @click="prev(switchType)"
    >
      <SIcon :icon="prevIcon"></SIcon>
    </SButton>

    <!-- Middle button -->
    <SButton
      v-if="switchType"
      class="s_datePickerSwitch__middleButton"
      tile
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
      :aria-label="nextAriaLabel"
      :size="dense ? 'default' : 'extra'"
      :disabled="canGoNext"
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

const { updateSelectedType, next, prev, switchTitle, switchType, canGoNext, canGoPrev } =
  useDatePickerItemSwitchService(props, emit)
</script>
<style lang="scss" scoped>
.s_datePickerSwitch {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__middleButton {
    flex: 1 0 auto;
    font-weight: 700;
  }
}
</style>
