<template>
  <SToolbarTitle class="s_appBarTitle" v-bind="$props">
    <slot v-if="$slots.default"></slot>
    <slot v-else-if="$slots.text" name="text"></slot>
    <div v-else-if="text">{{ text }}</div>
  </SToolbarTitle>
</template>
<script setup lang="ts">
import { SToolbarTitle } from '@/app/components/toolbar'
import type { PropsToolbarTitle } from '@/app/definitions'

defineProps<PropsToolbarTitle>()
</script>
