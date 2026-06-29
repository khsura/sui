<template>
  <Component :is="tagName" :class="classList" :href="href" :to="to" @click="$emit('click', $event)">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { ProviderPropsName } from '@/app/configs'
import { type PropsListItem } from '@/app/definitions'
import { useComponentDefaultsService, useLinkService, useDisabledService } from '@/app/services'

const rawProps = defineProps<PropsListItem>()
const props = useComponentDefaultsService('SListItem', rawProps)

defineEmits<(event: 'click', value: Event) => void>()

const listProps = inject(ProviderPropsName.listProps, null)

provide(ProviderPropsName.listItemProps, props)

const { classListDisabled } = useDisabledService(props)
const { isLink, tag: tagName } = useLinkService(props)

const classList = computed(() => {
  return {
    s_listItem: true,
    ...classListDisabled.value,
    's_listItem--selectable': props.selectable,
    's_listItem--dense': listProps?.dense === true,
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    's_listItem--link': isLink.value || props.link || listProps?.link === true,
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
  padding: 0 0 0 calc($s_spacer * 2);
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
