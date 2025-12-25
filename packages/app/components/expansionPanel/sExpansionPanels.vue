<template>
  <section class="s_expansionPanels">
    <slot></slot>
  </section>
</template>
<script setup lang="ts">
import { ProviderPropsName } from '@/app/constants'
import { type PropsExpansionPanels } from '@/app/definitions'
import { useGroupService, useProviderService } from '@/app/services'
import type { GroupItemValue } from '@/app/types/core'

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
