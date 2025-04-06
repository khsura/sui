<template>
  <section class="s_expansionPanels">
    <slot></slot>
  </section>
</template>
<script setup lang="ts">
import { ProviderPropsName } from '@khsura/sui/constants'
import { type PropsExpansionPanels } from '@khsura/sui/definitions'
import { useGroupService, useProviderService } from '@khsura/sui/services'
import type { GroupItemValue } from '@khsura/sui/types/core'

const props = defineProps<PropsExpansionPanels>()
const model = defineModel<GroupItemValue[]>({ default: [], required: false })
const { provideProps } = useProviderService()

provideProps(ProviderPropsName.expansionPanelsProps, props)
useGroupService(props, model)
</script>

<style lang="scss">
.s_expansionPanels {
  @include s_borderRadius();
  overflow: hidden;
  background-color: s_getAppColor('card');
}
</style>
