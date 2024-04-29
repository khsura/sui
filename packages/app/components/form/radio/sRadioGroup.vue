<template>
  <div class="s_radioGroup" :class="radioGroupClasses">
    <div class="s_radioGroup__content"><slot></slot></div>
    <SFormInputError v-if="!hideDetails" :errors="errors"></SFormInputError>
  </div>
</template>
<script setup lang="ts">
import { SFormInputError } from '@sui/app/components'
import { ProviderPropsName } from '@sui/app/constants'
import { propsRadioGroup } from '@sui/app/props'
import { useFormInputService, useProviderService, useSingleGroupService } from '@sui/app/services'
import { type GroupItemValue } from '@sui/app/types'
import { computed } from 'vue'

const props = defineProps(propsRadioGroup())

const emit = defineEmits<{
  (event: 'update:modelValue', value: GroupItemValue | null): void
  (event: 'change', value: GroupItemValue | null): void
  (event: 'update:menu', value: boolean | null | undefined): void
  (event: 'update:error', value: boolean): void
  (event: 'update:errors', value: string[]): void
  (event: 'update:dirty', value: boolean): void
}>()

const { errors, updateFormInput } = useFormInputService<GroupItemValue>(props, emit)

useSingleGroupService(props, async (event, value) => {
  emit(event, value)
  await updateFormInput()
})

const { provideProps } = useProviderService()

provideProps(ProviderPropsName.radioGroupProps, props)

const radioGroupClasses = computed(() => {
  return {
    's_radioGroup--column': props.column,
  }
})
</script>
<style lang="scss">
.s_radioGroup {
  &__content {
    display: flex;
    flex-wrap: wrap;

    .s_radio {
      margin: $s_spacer;
    }
  }
}
</style>
