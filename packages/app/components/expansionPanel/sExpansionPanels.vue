<template>
  <section class="s_expansionPanels">
    <slot></slot>
  </section>
</template>
<script setup lang="ts">
import { ProviderPropsName } from '~/constants'
import { propsExpansionPanels } from '~/props'
import { useGroupService, useProviderService } from '~/services'

const props = defineProps(propsExpansionPanels())
const model = defineModel<number[]>({ default: [], required: false })
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
