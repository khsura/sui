<template>
  <Component :is="tagName" :class="classes" :style="styles">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { ProviderPropsName } from '~/constants'
import { propsList } from '~/props'
import {
  useColorService,
  useMeasurableStylesService,
  useProviderService,
  useTagService,
  useTextColorService,
} from '~/services'

const props = defineProps({
  ...propsList(),
})

const { measurableStyles } = useMeasurableStylesService(props)
const { provideProps, injectParentProps } = useProviderService()
const { tagName } = useTagService(props)

provideProps(ProviderPropsName.listProps, props)
const navigationDrawerProps = injectParentProps(ProviderPropsName.navigationDrawerProps, null)

const { classListColor, styleListColor } = useColorService(props, {
  isText: computed(() => {
    return props.outlined
  }),
})

const { classListTextColor, styleListTextColor } = useTextColorService(props)

const styles = computed(() => {
  return {
    ...measurableStyles.value,
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
    's_list--appMiniVariant': !!navigationDrawerProps.value?.miniVariant,
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
  background-color: s_getAppColor('card');
  border-radius: $s_spacer;

  &--outlined {
    @include s_outlined();
  }

  &--divided {
    .s_list__item:not(:last-child) {
      border-bottom: thin solid s_getAppColor('border');
    }

    .s_listItemGroup--expanded + .s_listItem {
      border-top: thin solid s_getAppColor('border');
    }
  }
}
</style>
