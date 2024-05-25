<template>
  <Component :is="tagName" :class="classList" :href="href" :to="to" @click="$emit('click', $event)">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { ProviderPropsName } from '@khsura/sui/constants'
import { propsDisabled, propsLink, propsTag } from '@khsura/sui/props'
import { useLinkService, useDisabledService, useProviderService } from '@khsura/sui/services'
import { computed } from 'vue'
import { type PropType } from 'vue'

const props = defineProps({
  // TODO (Sura) Check if it's being used
  // eslint-disable-next-line vue/no-unused-properties
  lines: {
    type: Number as PropType<number | null>,
    default: null,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  link: {
    type: Boolean,
    default: false,
  },
  ...propsTag<'li' | 'div'>({ tag: 'li' }),
  ...propsLink(),
  ...propsDisabled(),
})

defineEmits<(event: 'click', value: Event) => void>()

const { injectParentProps, provideProps } = useProviderService()
const listProps = injectParentProps(ProviderPropsName.listProps)

provideProps(ProviderPropsName.listItemProps, props)

const { classListDisabled } = useDisabledService(props)
const { isLink, tag: tagName } = useLinkService(props)

const classList = computed(() => {
  return {
    s_listItem: true,
    s_list__item: true,
    ...classListDisabled.value,
    's_listItem--selectable': props.selectable,
    's_listItem--dense': listProps.value.dense === true,
    's_listItem--link': isLink.value || props.link || listProps.value.link === true,
    's_listItem--inset': listProps.value.inset === true,
  }
})
</script>
<style lang="scss">
@import './helper';

.s_listItem {
  position: relative;
  display: flex;
  flex: 1 1 100%;
  align-items: center;
  min-height: $s_listItem__minHeight;
  padding: 0 calc($s_spacer * 4);
  text-decoration: none;
  letter-spacing: normal;
  outline: none;

  &--selectable {
    user-select: auto;
  }

  &--link {
    @include s_createListItemLink();
  }

  &--dense {
    min-height: $s_listItem__minHeight--dense;
  }

  &--inset {
    padding-right: calc($s_spacer * 6);
    padding-left: calc($s_spacer * 8);
  }
}
</style>
