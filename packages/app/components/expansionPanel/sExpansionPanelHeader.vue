<template>
  <div class="s_expansionPanelHeader" @click="toggle?.()">
    <div v-if="$slots.top" class="s_expansionPanelHeader__top"><slot name="top"></slot></div>
    <SListItem class="s_expansionPanelHeader__main">
      <SListItemContent>
        <slot :open="isExpanded"></slot>
      </SListItemContent>
      <SListItemAction align-center dense>
        <slot name="actions" :is-expanded="isExpanded">
          <SIcon
            :icon="panelsProps?.expandIcon ?? 'mdi-chevron-down'"
            :rotated="isExpanded ?? false"
            :size="panelsProps?.expandIconSize"
          ></SIcon>
        </slot>
      </SListItemAction>
    </SListItem>
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue'
import { SListItemContent, SListItemAction } from '@/app/components/list'
import SIcon from '@/app/components/sIcon.vue'
import { ProviderPropsName } from '@/app/configs'
import { useExpandableItemService } from '@/app/services'
import SListItem from '@/app/components/list/sListItem.vue'

const panelsProps = inject(ProviderPropsName.expansionPanelsProps)
const { isExpanded, toggle } = useExpandableItemService()
</script>

<style lang="scss">
.s_expansionPanelHeader {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: calc(12 * $s_spacer);
  padding: 0 calc($s_spacer * 4);
  letter-spacing: normal;
  text-decoration: none;
  outline: none;

  @include s_createListItemLink();

  // The header already has the panel's 16px inline padding: drop the list item's own left padding and the
  // action's right margin, so the header text and chevron line up with the content edges.
  &__main {
    display: flex;
    align-items: center;

    &.s_listItem {
      padding-left: 0;
    }

    > .s_listItemAction {
      margin-right: 0;
    }
  }

  &__top,
  &__main {
    flex: 1 0 100%;
  }
}
</style>
