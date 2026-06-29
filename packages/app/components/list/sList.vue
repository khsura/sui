<template>
  <Component :is="tagName" :class="classes" :style="styles">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { ProviderPropsName } from '@/app/configs'
import { type PropsList } from '@/app/definitions'
import { useComponentDefaultsService, useColorService, useTagService, useTextColorService } from '@/app/services'

const rawProps = defineProps<PropsList>()
const props = useComponentDefaultsService('SList', rawProps)
const { tagName } = useTagService(props)

provide(ProviderPropsName.listProps, props)
const navigationDrawerProps = inject(ProviderPropsName.navigationDrawerProps, null)

const { classListColor, styleListColor } = useColorService(props, {
  isText: computed(() => {
    return props.outlined
  }),
})

const { classListTextColor, styleListTextColor } = useTextColorService(props)

const styles = computed(() => {
  return {
    ...(props.text ? styleListTextColor.value : styleListColor.value),
  }
})

const classes = computed(() => {
  return {
    s_list: true,
    ...(props.text ? classListTextColor.value : classListColor.value),
    's_list--divided': props.divided,
    's_list--outlined': props.outlined,
    's_list--dense': props.dense,
    's_list--link': props.link,
    's_list--inset': props.inset,
    's_list--appMiniVariant': !!navigationDrawerProps?.miniVariant,
  }
})
</script>

<style lang="scss">
$s_listPadding: calc($s_spacer * 2) !default;

ul.s_list,
ol.s_list,
.s_list {
  padding: $s_listPadding;
  margin: 0;

  &--appMiniVariant {
    padding: $s_listPadding 0;
  }

  &--dense {
    padding: 0;
  }
}

.s_list {
  position: static;
  display: block;
  width: 100%;
  background-color: s_getAppColor('card');
  border-radius: $s_spacer;

  &--outlined {
    @include s_outlined();
  }

  &--divided {
    .s_listItem:not(:last-child) {
      border-bottom: thin solid s_getAppColor('border');
    }

    .s_listItemGroup--expanded + .s_listItem {
      border-top: thin solid s_getAppColor('border');
    }
  }
}
</style>
