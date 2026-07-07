<template>
  <SToggleButton class="s_tab" :index="tab" v-bind="props">
    <slot></slot>
  </SToggleButton>
</template>
<script setup lang="ts">
import { SToggleButton } from '@/app/components/toggleButtonGroup'
import type { PropsTab } from '@/app/definitions'
import { useComponentDefaultsService } from '@/app/services'

const rawProps = defineProps<PropsTab>()
const props = useComponentDefaultsService('STab', rawProps)
</script>
