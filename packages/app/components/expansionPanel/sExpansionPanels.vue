<template>
  <section class="s_expansionPanels">
    <slot></slot>
  </section>
</template>
<script setup lang="ts">
import { provide } from 'vue'
import { ProviderPropsName } from '@/app/configs'
import { type PropsExpansionPanels } from '@/app/definitions'
import { useGroupService } from '@/app/services'
import type { GroupItemValue } from '@/app/types/core'

const props = defineProps<PropsExpansionPanels>()
const model = defineModel<GroupItemValue[]>({ default: [], required: false })

provide(ProviderPropsName.expansionPanelsProps, props)
useGroupService(props, model)
</script>

<style lang="scss">
.s_expansionPanels {
  @include s_borderRadius();
  overflow: hidden;
  background-color: s_getAppColor('card');
}
</style>
