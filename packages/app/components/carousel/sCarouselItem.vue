<template>
  <SWindowItem class="s_carouselItem" v-bind="$props" :value="value">
    <SImage :src="src" :alt="alt" :object-fit="objectFit" :aspect-ratio="aspectRatio">
      <slot></slot>
    </SImage>
  </SWindowItem>
</template>
<script setup lang="ts">
import SImage from '@khsura/sui/components/sImage.vue'
import SWindowItem from '@khsura/sui/components/window/sWindowItem.vue'
import { propsImage, propsWindowItem } from '@khsura/sui/props'

defineProps({
  ...propsImage(),
  ...propsWindowItem(),
})
</script>
