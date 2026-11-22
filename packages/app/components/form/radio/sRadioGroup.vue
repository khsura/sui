<template>
  <div class="s_radioGroup" :class="radioGroupClasses" role="radiogroup" v-bind="ariaAttributesFormInput">
    <div class="s_radioGroup__content"><slot></slot></div>
    <SFormInputError v-if="!hideDetails && !hideError" :id="errorId" :errors="errors"></SFormInputError>
  </div>
</template>
<script setup lang="ts">
import { computed, provide, useId } from 'vue'
import { SFormInputError } from '@/app/components/form/common'
import { ProviderName, ProviderPropsName } from '@/app/configs'
import { type PropsRadioGroup } from '@/app/definitions'
import { useComponentDefaultsService, useFormInputService, useSingleGroupService } from '@/app/services'
import { type GroupItemValue } from '@/app/types'

const rawProps = defineProps<PropsRadioGroup>()
const props = useComponentDefaultsService('SRadioGroup', rawProps)

const emit = defineEmits<{
  (event: 'change', value: GroupItemValue | null): void
  (event: 'update:menu', value: boolean | null | undefined): void
  (event: 'update:error', value: boolean): void
  (event: 'update:errors', value: string[]): void
  (event: 'update:dirty', value: boolean): void
}>()

const model = defineModel<GroupItemValue>({
  set: (v) => {
    void updateFormInput(v)

    return v
  },
})

const { errors, hasError, updateFormInput, errorId, ariaAttributesFormInput } = useFormInputService<GroupItemValue>(
  props,
  emit,
  model,
)

const generatedName = useId()

useSingleGroupService(props, model)

provide(ProviderPropsName.radioGroupProps, props)
provide(
  ProviderName.radioGroupName,
  computed(() => props.name ?? generatedName),
)

const radioGroupClasses = computed(() => {
  return {
    's_radioGroup--column': props.column,
    's_radioGroup--error': hasError.value,
  }
})
</script>
<style lang="scss">
.s_radioGroup {
  &__content {
    display: flex;
    flex-wrap: wrap;

    .s_radio {
      // No wider than the group, so a long label wraps.
      min-width: 0;
      max-width: calc(100% - #{$s_spacer * 2});
      margin: $s_spacer;
    }
  }

  // Kept visible even when `hideError` / `hideDetails` hides the message text
  &--error .s_radio__radio::before {
    border-color: s_getPresetColor('error');
  }
}
</style>
