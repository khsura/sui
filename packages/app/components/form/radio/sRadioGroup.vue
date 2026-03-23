<template>
  <div class="s_radioGroup" :class="radioGroupClasses">
    <div class="s_radioGroup__content"><slot></slot></div>
    <SFormInputError v-if="!hideDetails && !hideError" :errors="errors"></SFormInputError>
  </div>
</template>
<script setup lang="ts">
import { computed, provide } from 'vue'
import { SFormInputError } from '@/app/components/form/common'
import { ProviderPropsName } from '@/app/configs'
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

const { errors, updateFormInput } = useFormInputService<GroupItemValue>(props, emit, model)

useSingleGroupService(props, model)

provide(ProviderPropsName.radioGroupProps, props)

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
