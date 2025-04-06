<template>
  <hr class="s_divider" :class="classes" role="separator" :aria-orientation="vertical ? 'vertical' : 'horizontal'" />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { PropsDivider } from '@khsura/sui/definitions'

const props = defineProps<PropsDivider>()

const classes = computed(() => {
  return {
    's_divider--vertical': props.vertical,
  }
})
</script>
<style lang="scss">
.s_divider {
  display: block;
  flex: 1 1 0px;
  max-width: 100%;
  height: 0;
  max-height: 0;
  border: solid;
  border-color: s_getAppColor('border');
  border-width: thin 0 0;
  transition: inherit;

  &--vertical {
    display: inline-flex;
    align-self: stretch;
    width: 0;
    max-width: 0;
    height: inherit;
    min-height: 100%;
    max-height: 100%;
    vertical-align: text-bottom;
    border: solid;
    border-width: 0 thin 0 0;
  }
}
</style>
