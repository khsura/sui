<template>
  <section class="s_expansionPanels">
    <slot></slot>
  </section>
</template>
<script setup lang="ts">
import { ProviderPropsName } from '@sui/app/constants'
import { propsGroup } from '@sui/app/props'
import { useGroupService, useProviderService } from '@sui/app/services'
import { type GroupItemValue, type SizePropertyType, type MaterialDesignIcon } from '@sui/app/types'
import { type PropType } from 'vue'

const props = defineProps({
  ...propsGroup<number>(),
  // eslint-disable-next-line vue/no-unused-properties
  expandIcon: {
    type: String as PropType<MaterialDesignIcon>,
    default: 'mdi-chevron-down',
  },
  // eslint-disable-next-line vue/no-unused-properties
  expandIconSize: {
    type: String as PropType<SizePropertyType>,
    default: null,
  },
})

const { provideProps } = useProviderService()
const emit = defineEmits<(event: 'update:modelValue', value: GroupItemValue[] | null) => void>()

provideProps(ProviderPropsName.expansionPanelsProps, props)
useGroupService(props, emit)
</script>

<style lang="scss">
.s_expansionPanels {
  @include s_borderRadius();
  overflow: hidden;
  background-color: s_getAppColor('card');
}
</style>
