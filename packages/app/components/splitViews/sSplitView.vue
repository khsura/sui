<template>
  <div :class="classes" :style="styles">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { ProviderPropsName } from '~/constants'
import { getNumericCssAttribute } from '~/lib'
import { propsSplitView } from '~/props'
import { useProviderService } from '~/services'

const { provideProps } = useProviderService()
const props = defineProps(propsSplitView())

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
