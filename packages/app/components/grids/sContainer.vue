<template>
  <div :class="classListContainer" :style="styleListContainer">
    <Component :is="tagName" :class="classListContainerContent" :style="styleListContainerContent">
      <slot></slot>
    </Component>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { type PropsContainer } from '@khsura/sui/definitions'
import { useColorService, useTagService } from '@khsura/sui/services'

const props = defineProps<PropsContainer>()
const { classListColor, styleListColor } = useColorService(props)
const { tagName } = useTagService(props)

const classListContainer = computed(() => {
  return {
    s_container: true,
    's_container--fill': props.fill,
    ...(props.fill ? classListColor.value : {}),
  }
})

const styleListContainer = computed(() => {
  return {
    ...(props.fill ? styleListColor.value : {}),
  }
})

const classListContainerContent = computed(() => {
  return {
    s_container__content: true,
    's_container__content--narrow': !props.wide && props.narrow,
    's_container__content--wide': props.wide,
    's_container__content--fluid': props.fluid,
    's_container__content--padless': props.padless,
    ...(!props.fill ? classListColor.value : {}),
  }
})

const styleListContainerContent = computed(() => {
  return {
    ...(!props.fill ? styleListColor.value : {}),
  }
})
</script>

<style lang="scss">
.s_container {
  flex: 1 0;
  width: 100%;

  &--fill {
    background-color: s_getAppColor('card');
  }

  &__content {
    width: 100%;
    max-width: 1100px;
    padding: 0 calc($s_gridGutter / 2);
    margin-right: auto;
    margin-left: auto;

    &--padless {
      padding: 0;
    }

    &--narrow {
      max-width: 800px;
    }

    &--wide {
      max-width: 1280px;
    }

    &--fluid {
      max-width: 100%;
    }
  }
}
</style>
