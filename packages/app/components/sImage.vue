<template>
  <div :class="classes" :style="styles">
    <img v-if="src" :loading="LazyLoad.lazy" :src="src" :alt="alt ?? ''" :style="{ objectFit }" :class="classesImage" />
    <div class="s_image__content"><slot></slot></div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { LazyLoad } from '@/app/constants'
import { useComponentDefaultsService, useMeasurableStylesService } from '@/app/services'
import type { PropsImage } from '@/app/definitions'

const rawProps = defineProps<PropsImage>()
const props = useComponentDefaultsService('SImage', rawProps)
const { measurableStyles } = useMeasurableStylesService(props)

const styles = computed(() => {
  return {
    ...measurableStyles.value,
    ...(props.aspectRatio ? { aspectRatio: props.aspectRatio.toString() } : {}),
  }
})

const classes = computed(() => {
  return {
    s_image: true,
    // An aspect ratio sizes the image from its width, unless a height is given too.
    's_image--aspectRatio': !!props.aspectRatio && props.height == null,
    // No src: show a neutral placeholder instead of a blank gap.
    's_image--empty': !props.src,
  }
})

const classesImage = computed(() => {
  return {
    s_image__image: true,
  }
})
</script>

<style lang="scss">
.s_image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;

  // height: 100% would resolve against a flex card's height and squash the image; let aspect-ratio set it.
  &--aspectRatio {
    height: auto;
  }

  &--empty {
    background-color: s_getAppColor('background');
  }

  &__image {
    width: 100%;
    height: 100%;
  }

  &__content {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
