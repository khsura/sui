<template>
  <div class="s_badge" :class="classes">
    <SBadgeContent v-if="displayBeforeContent" v-bind="props">
      <template v-if="$slots.badge" #badge><slot name="badge"></slot></template>
    </SBadgeContent>
    <slot></slot>
    <SBadgeContent v-if="!displayBeforeContent" v-bind="props">
      <template v-if="$slots.badge" #badge><slot name="badge"></slot></template>
    </SBadgeContent>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { PropsBadge } from '@khsura/sui/definitions'
import SBadgeContent from './sBadgeContent.vue'

const props = defineProps<PropsBadge>()

const classes = computed(() => ({
  's_badge--inline': props.inline,
}))

const displayBeforeContent = computed(() => {
  return props.inline && props.left
})
</script>

<style lang="scss">
.s_badge {
  position: relative;
  display: inline-block;

  &--inline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
