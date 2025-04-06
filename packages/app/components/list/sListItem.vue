<template>
  <Component :is="tagName" :class="classList" :href="href" :to="to" @click="$emit('click', $event)">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { ProviderPropsName } from '@khsura/sui/constants'
import { type PropsListItem } from '@khsura/sui/definitions'
import { useLinkService, useDisabledService, useProviderService } from '@khsura/sui/services'

const props = defineProps<PropsListItem>()

defineEmits<(event: 'click', value: Event) => void>()

const { injectParentProps, provideProps } = useProviderService()
const listProps = injectParentProps(ProviderPropsName.listProps)

provideProps(ProviderPropsName.listItemProps, props)

const { classListDisabled } = useDisabledService(props)
const { isLink, tag: tagName } = useLinkService(props)

const classList = computed(() => {
  return {
    s_listItem: true,
    ...classListDisabled.value,
    s_list__item: true,
    's_listItem--selectable': props.selectable,
    's_listItem--dense': listProps.value.dense === true,
    's_listItem--link': isLink.value ?? props.link ?? listProps.value.link === true,
  }
})
</script>

<style lang="scss">
.s_listItem {
  position: relative;
  display: flex;
  flex: 1 0 100%;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  min-height: 48px;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;

  &--selectable {
    cursor: pointer;
  }

  &--dense {
    min-height: 40px;
  }

  &--link {
    cursor: pointer;

    &:hover {
      background-color: s_getAppColor('hover');
    }
  }

  &--noUnderline {
    border-bottom: none !important;
  }
}
</style>
