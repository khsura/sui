<template>
  <SWindowItem class="s_carouselItem" v-bind="$props" :value="value">
    <SImage :src="src" :alt="alt" :object-fit="objectFit" :aspect-ratio="aspectRatio">
      <slot></slot>
    </SImage>
  </SWindowItem>
</template>
<script setup lang="ts">
import SImage from '~/components/sImage.vue'
import SWindowItem from '~/components/window/sWindowItem.vue'
import { propsImage, propsWindowItem } from '~/props'

defineProps({
  ...propsImage(),
  ...propsWindowItem(),
})
</script>
