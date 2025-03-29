<template>
  <section :class="classes" :style="styles">
    <div class="s_expansionPanelContent__content">
      <slot :is-expanded="isExpanded"></slot>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { getNumericCssAttribute } from '~/lib'
import { useExpandableItemService } from '~/services'

const { isExpanded, maxHeight } = useExpandableItemService()

const classes = computed(() => {
  return {
    s_expansionPanelContent: true,
    's_expansionPanelContent--expanded': isExpanded.value,
  }
})

const styles = computed(() => {
  return {
    maxHeight: getNumericCssAttribute(maxHeight.value),
  }
})
</script>

<style lang="scss">
.s_expansionPanelContent {
  overflow: hidden;
  border-bottom: thin solid s_getAppColor('border');
  transition: all $s_primaryTransition;

  &__content {
    padding: calc($s_spacer * 4);
  }
}
</style>
