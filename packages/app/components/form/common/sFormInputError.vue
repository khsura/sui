<template>
  <!-- eslint-disable vue/no-v-html -->
  <div :class="classList" v-html="errors[0]"></div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { type PropType } from 'vue'
import { useComponentDefaultsService } from '@/app/services'

const rawProps = defineProps({
  errors: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  simple: {
    type: Boolean as PropType<boolean | null | undefined>,
    default: false,
  },
})

const props = useComponentDefaultsService('SFormInputError', rawProps)

const classList = computed(() => {
  return {
    s_formInputError: true,
    s_visible: props.errors.length > 0,
    's_formInputError--simple': !!props.simple,
  }
})
</script>
<style lang="scss">
.s_formInputError {
  @include s_typography('caption');
  visibility: hidden;
  min-height: calc($s_spacer * 7);
  padding: $s_spacer calc($s_spacer * 4);
  color: s_getPresetColor('error');
  opacity: 0;
  transition:
    visibility 1s,
    opacity 0.15s map.get($s_transitions, 'swing');

  &--simple {
    padding-right: 0;
    padding-left: 0;
  }

  &.s_visible {
    visibility: visible;
    opacity: 1;
  }
}
</style>
