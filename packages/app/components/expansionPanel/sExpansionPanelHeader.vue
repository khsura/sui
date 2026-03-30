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

  &__main {
    display: flex;
    align-items: center;
  }

  &__top,
  &__main {
    flex: 1 0 100%;
  }
}
</style>
