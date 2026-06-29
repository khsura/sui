<template>
  <SWindowItem class="s_carouselItem" v-bind="props" :value="value">
    <SImage :src="src" :alt="alt" :object-fit="objectFit" :aspect-ratio="aspectRatio">
      <slot></slot>
    </SImage>
  </SWindowItem>
</template>
<script setup lang="ts">
import SImage from '@/app/components/sImage.vue'
import SWindowItem from '@/app/components/window/sWindowItem.vue'
import type { PropsCarouselItem } from '@/app/definitions'
import { useComponentDefaultsService } from '@/app/services'

const rawProps = defineProps<PropsCarouselItem>()
const props = useComponentDefaultsService('SCarouselItem', rawProps)
</script>
