<template>
  <div class="s_radioGroup" :class="radioGroupClasses">
    <div class="s_radioGroup__content"><slot></slot></div>
    <SFormInputError v-if="!hideDetails" :errors="errors"></SFormInputError>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { SFormInputError } from '@khsura/sui/components'
import { ProviderPropsName } from '@khsura/sui/constants'
import { propsRadioGroup } from '@khsura/sui/props'
import { useFormInputService, useProviderService, useSingleGroupService } from '@khsura/sui/services'
import { type GroupItemValue } from '@khsura/sui/types'

const props = defineProps(propsRadioGroup())

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

const { errors, updateFormInput } = useFormInputService<GroupItemValue>(props, emit)

useSingleGroupService(props, model)

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
