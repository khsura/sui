<template>
  <ul :class="{ s_list__item: true, s_listItemGroup: true, 's_listItemGroup--expanded': isExpanded }">
    <slot name="activator">
      <SListItem link @click="isExpanded = !isExpanded">
        <SListItemContent>
          <SListItemTitle v-if="title">{{ title }}</SListItemTitle>
          <SListItemSubtitle v-if="subtitle">{{ subtitle }}</SListItemSubtitle>
        </SListItemContent>
        <SListItemAction align-center>
          <SIcon icon="mdi-chevron-down" :rotated="isExpanded"></SIcon>
        </SListItemAction>
      </SListItem>
    </slot>
    <SList v-bind="listProps" :style="contentStyles" :outlined="false">
      <slot></slot>
    </SList>
  </ul>
</template>
<script setup lang="ts">
import SIcon from '@khsura/sui/components/sIcon.vue'
import { ProviderPropsName } from '@khsura/sui/constants'
import { getNumericCssAttribute } from '@khsura/sui/lib'
import { useExpandableItemCoreService, useProviderService } from '@khsura/sui/services'
import { ref, computed } from 'vue'
import { type PropType } from 'vue'
import SList from './sList.vue'
import SListItem from './sListItem.vue'
import SListItemAction from './sListItemAction.vue'
import SListItemContent from './sListItemContent.vue'
import SListItemSubtitle from './sListItemSubtitle.vue'
import SListItemTitle from './sListItemTitle.vue'

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

const isExpanded = ref(false)
const { injectParentProps } = useProviderService()
const listProps = injectParentProps(ProviderPropsName.listProps)
const { maxHeight } = useExpandableItemCoreService(isExpanded)

const contentStyles = computed(() => {
  return {
    maxHeight: getNumericCssAttribute(maxHeight.value),
    overflow: 'hidden',
  }
})
</script>
<style lang="scss">
.s_listItemGroup,
ul.s_listItemGroup,
ol.s_listItemGroup {
  padding-inline-start: 0;

  > .s_list {
    padding: 8px 0 8px 8px;
    transition: all $s_primaryTransition;

    &--dense {
      padding: 0 0 0 8px;
    }
  }
}
</style>
