<template>
  <div class="s_expansionPanelHeader" @click="toggle?.()">
    <div v-if="$slots.top" class="s_expansionPanelHeader__top"><slot name="top"></slot></div>
    <div class="s_expansionPanelHeader__main">
      <SListItemContent>
        <slot :open="isExpanded"></slot>
      </SListItemContent>
      <SListItemAction align-center dense>
        <slot name="actions" :is-expanded="isExpanded">
          <SIcon
            :icon="panelsProps.expandIcon ?? 'mdi-chevron-down'"
            :rotated="isExpanded ?? false"
            :size="panelsProps.expandIconSize"
          ></SIcon>
        </slot>
      </SListItemAction>
    </div>
  </div>
</template>
<script setup lang="ts">
import { SListItemContent, SListItemAction } from '~/components/list'
import SIcon from '~/components/sIcon.vue'
import { ProviderPropsName } from '~/constants'
import { useExpandableItemService, useProviderService } from '~/services'

const { injectParentProps } = useProviderService()
const panelsProps = injectParentProps(ProviderPropsName.expansionPanelsProps)
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
