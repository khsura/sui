<template>
  <ul :class="{ s_list__item: true, s_listItemGroup: true, 's_listItemGroup--expanded': isExpanded }">
    <slot name="activator">
      <SListItem link @click="isExpanded = !isExpanded" :class="{ 's_listItem--noUnderline': !isExpanded }">
        <SListItemContent>
          <SListItemTitle v-if="title">{{ title }}</SListItemTitle>
          <SListItemSubtitle v-if="subtitle">{{ subtitle }}</SListItemSubtitle>
        </SListItemContent>
        <SListItemAction align-center>
          <SIcon icon="mdi-chevron-down" :rotated="isExpanded"></SIcon>
        </SListItemAction>
      </SListItem>
    </slot>
    <SList v-bind="listProps" :class="{ 's_list--hidden': !isExpanded }" :style="contentStyles" :outlined="false">
      <slot></slot>
    </SList>
  </ul>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { type PropType } from 'vue'
import SList from './sList.vue'
import SListItem from './sListItem.vue'
import SListItemAction from './sListItemAction.vue'
import SListItemContent from './sListItemContent.vue'
import SListItemSubtitle from './sListItemSubtitle.vue'
import SListItemTitle from './sListItemTitle.vue'
import SIcon from '@/app/components/sIcon.vue'
import { ProviderPropsName } from '@/app/configs'

defineProps({
  title: {
    type: String as PropType<string | null>,
    default: null,
  },
  subtitle: {
    type: String as PropType<string | null>,
    default: null,
  },
})

const isExpanded = defineModel<boolean>({ default: false })
const listProps = inject(ProviderPropsName.listProps, null)

if (!listProps) {
  throw new Error('List props not found')
}

const contentStyles = computed(() => {
  return {
    maxHeight: isExpanded.value ? null : '0px',
    overflow: 'hidden',
    display: isExpanded.value ? 'block' : 'none',
  }
})
</script>
<style lang="scss">
.s_listItemGroup,
ul.s_listItemGroup,
ol.s_listItemGroup {
  padding-inline-start: 0;
  margin: 0;

  > .s_list {
    padding: 8px 0 8px 8px;
    transition: all $s_primaryTransition;

    &--dense {
      padding: 0 0 0 8px;
    }
  }
}
</style>
