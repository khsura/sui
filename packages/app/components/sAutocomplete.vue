<template>
  <div class="s_autocomplete">
    {{ items }}
  </div>
</template>
<script lang="ts" setup>
import { type GroupItemValue } from '~/types'

defineProps<{
  items: GroupItemValue[]
}>()
</script>
