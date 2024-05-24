<template>
  <Component :is="tagName" class="s_card__actions">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { propsTag } from '@sui/app/props'
import { useTagService } from '@sui/app/services'

const props = defineProps({
  ...propsTag(),
})

const { tagName } = useTagService(props)
</script>
<style lang="scss">
.s_card__actions {
  display: flex;
  align-items: center;
  padding: calc($s_spacer * 2) calc($s_spacer * 2) calc($s_spacer * 4);
}
</style>
