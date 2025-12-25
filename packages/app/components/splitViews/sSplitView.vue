<template>
  <div :class="classes" :style="styles">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { ProviderPropsName } from '@/app/constants'
import { getNumericCssAttribute } from '@/app/lib'
import type { PropsSplitView } from '@/app/definitions'
import { useProviderService } from '@/app/services'

const { provideProps } = useProviderService()

const props = withDefaults(defineProps<PropsSplitView>(), {
  width: '100%',
  height: '100%',
})

provideProps(ProviderPropsName.splitViewProps, props)

const classes = computed(() => {
  return {
    s_splitView: true,
    's_splitView--vertical': props.vertical,
  }
})

const styles = computed(() => {
  return {
    height: getNumericCssAttribute(props.height),
    width: getNumericCssAttribute(props.width),
  }
})
</script>
<style lang="scss">
.s_splitView {
  display: flex;
  flex-flow: nowrap;
  align-items: center;
  justify-content: center;

  &--vertical {
    flex: 1 0 0;
    flex-direction: column;
  }
}
</style>
