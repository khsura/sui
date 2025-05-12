<template>
  <div class="s_autocomplete">
    {{ items }}
  </div>
</template>
<script lang="ts" setup>
import type { PropsAutocomplete } from '@khsura/sui/definitions'

defineProps<PropsAutocomplete>()
</script>
