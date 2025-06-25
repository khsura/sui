<template>
  <div class="s_table__container">
    <div
      ref="tableWrapperElement"
      class="s_table__wrapper"
      :class="{ 's_table__wrapper--outlined': outlined, 's_table__wrapper--noTopBottomBorders': hideTopBottomBorders }"
      :style="styleListBorder"
      @scroll="onHorizontalScroll()"
    >
      <!-- Table -->
      <table class="s_table" :class="tableClasses">
        <!-- Table Head -->
        <thead v-if="!hideHeader" class="s_table__head">
          <tr
            v-for="(headersListItem, headersListItemId) in headersList"
            :key="`headersGroup-${headersListItemId}`"
            class="s_table__row"
            :class="{ 's_table__row--sticky': stickyHeader }"
          >
            <STableHeadCell
              v-for="header in headersListItem"
              ref="headerElements"
              :key="`headCell-${header.value.toString()}`"
              v-model:sort-orders="sortOrders"
              :header="header"
              :multi-sort="multiSort"
              :sticky="header.isSticked"
              :style="getTableCellStyle(header)"
              :dense="dense"
            >
              <slot
                :name="`header.${header.value.toString()}`"
                :header="header"
                :is-sticked="isStickActive && header.isSticky"
                >{{ header.text }}</slot
              >
            </STableHeadCell>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="s_table__body">
          <template v-for="{ name: group, items: groupItems } in groupedItems">
            <!-- Table Item - Rows Group -->
            <tr v-if="groupBy" :key="`row-group-${group}`">
              <td :colspan="totalItemColumns" class="s_table__group">
                <slot name="group" :items="groupItems" :group="group">{{ group }}</slot>
              </td>
            </tr>

            <!-- Table Item - Row Header -->
            <template v-for="(rowItems, row) in groupItems" :key="`row-${group}-${row}`">
              <tr
                v-if="itemHeader && rowItems[itemHeader]"
                class="s_table__row"
                :class="getItemRowClass({ item: rowItems, cellType: 'header' })"
              >
                <STableBodyCell
                  :colspan="totalItemColumns"
                  :item="rowItems"
                  :cell-class="props.itemHeaderClass"
                  :cell-style="props.itemHeaderStyle"
                  :cell-key="itemHeader"
                  cell-type="header"
                  :dense="dense"
                >
                  <slot
                    name="itemHeader"
                    :item="rowItems"
                    :value="rowItems[itemHeader]"
                    :row="row"
                    :group="group"
                    :expand="() => toggleExpanded(rowItems)"
                    :select="() => toggleSelected(rowItems)"
                    :is-selected="getIsSelected(rowItems)"
                    :is-expanded="getIsExpanded(rowItems)"
                    :is-stick-active="isStickActive"
                  >
                    {{ rowItems[itemHeader] }}
                  </slot>
                </STableBodyCell>
              </tr>

              <!-- Table Item - Row -->
              <tr
                class="s_table__row"
                :class="getItemRowClass({ item: rowItems, cellType: 'cell' })"
                @click="() => onClickRow(rowItems)"
              >
                <STableBodyCell
                  v-for="(header, col) in computedColumnHeaders"
                  :key="`row-${group}-${row}-${col}BodyCell`"
                  :header="header"
                  :item="rowItems"
                  :cell-key="header.value"
                  cell-type="cell"
                  :cell-class="props.itemClass"
                  :cell-style="props.itemStyle"
                  :sticky="header.isSticked"
                  :dense="dense"
                  :style="getTableCellStyle(header)"
                >
                  <slot
                    :name="`item.${header.value}`"
                    :group="group"
                    :header="header"
                    :item="rowItems"
                    :value="rowItems[header.value]"
                    :row="row"
                    :col="col"
                    :expand="() => toggleExpanded(rowItems)"
                    :select="() => toggleSelected(rowItems)"
                    :is-selected="getIsSelected(rowItems)"
                    :is-expanded="getIsExpanded(rowItems)"
                    :is-sticked="getIsStickyCell(col) && isStickActive"
                  >
                    {{ rowItems[header.value] }}
                  </slot>
                </STableBodyCell>
              </tr>

              <!-- Table Item - Row Expansion -->
              <tr
                v-if="getIsExpanded(rowItems)"
                :key="`row-${group}-${row}__expanded`"
                :class="getItemRowClass({ item: rowItems, cellType: 'expansion' })"
              >
                <td :colspan="totalItemColumns" :class="getExpandedClass()">
                  <slot name="expanded" :item="rowItems"></slot>
                </td>
              </tr>

              <!-- Table Item - Row Footer -->
              <tr
                v-if="itemFooter && rowItems[itemFooter]"
                :key="`row-${group}-${row}__footer`"
                class="s_table__row"
                :class="getItemRowClass({ item: rowItems, cellType: 'footer' })"
              >
                <STableBodyCell
                  :colspan="totalItemColumns"
                  :item="rowItems"
                  :cell-key="itemFooter"
                  :cell-class="props.itemFooterClass"
                  :cell-style="props.itemFooterStyle"
                  cell-type="footer"
                  :dense="dense"
                >
                  <slot
                    name="itemFooter"
                    :item="rowItems"
                    :value="rowItems[itemFooter]"
                    :row="row"
                    :group="group"
                    :expand="() => toggleExpanded(rowItems)"
                    :select="() => toggleSelected(rowItems)"
                    :is-selected="getIsSelected(rowItems)"
                    :is-expanded="getIsExpanded(rowItems)"
                    :is-stick-active="isStickActive"
                  >
                    {{ rowItems[itemFooter] }}
                  </slot>
                </STableBodyCell>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
    <SProgressLinear
      class="s_table__loading"
      v-if="loading"
      position="absolute"
      indeterminate
      :size="3"
    ></SProgressLinear>
    <STablePagination
      v-if="!hidePagination"
      v-model:items-per-page="itemsPerPage"
      v-model:page-index="pageIndex"
      @update:page-index="updateOptions"
      :loading="loading"
      :items-count="totalItems ?? items.length"
    />
  </div>
</template>
<script setup lang="ts" generic="T extends TableItem">
import { useDebounceFn } from '@vueuse/core'
import { computed, watch, onMounted } from 'vue'
import { getCleanSetObject } from '@khsura/sui/lib'
import { useBorderService, useTableService } from '@khsura/sui/services'
import { type KTableSortOrder, type EmitTable, type PropsTable, type TableItem } from '@khsura/sui/types'
import SProgressLinear from '../progress/sProgressLinear.vue'
import STableHeadCell from './sTableHeadCell.vue'
import STableBodyCell from './sTableBodyCell.vue'
import STablePagination from './sTablePagination.vue'

const props = withDefaults(defineProps<PropsTable<T>>(), {
  items: () => [],
  headers: () => [],
  outlined: false,
  hideHeader: false,
  hideVerticalBorders: false,
  hideTopBottomBorders: false,
  hidePagination: false,
  dense: false,
  stickyHeader: false,
  multiSort: false,
  itemHeader: '',
  itemFooter: '',
  stickyLeftColumnsStart: 0,
  stickyLeftColumnsSize: 0,
  shadowExpandedContent: false,
})

const emit = defineEmits<EmitTable<T>>()
const itemsPerPage = defineModel<number>('itemsPerPage')
const { classListBorder, styleListBorder } = useBorderService(props, { block: 'table' })

const {
  isMounted,
  pageIndex,
  computedColumnHeaders,
  groupedItems,
  headerElements,
  headersList,
  isStickActive,
  sortOrders,
  tableWrapperElement,
  totalItemColumns,
  getIsStickyCell,
  getIsExpanded,
  getIsSelected,
  getItemRowClass,
  getTableCellStyle,
  onClickRow,
  toggleExpanded,
  toggleSelected,
  onHorizontalScroll,
  updateTable,
} = useTableService(props, emit, itemsPerPage)

const tableClasses = computed(() => ({
  's_table--verticalBorder__hidden': props.hideVerticalBorders,
  's_table--noTopBottomBorders': props.hideTopBottomBorders,
  's_table--dense': props.dense,
  ...classListBorder.value,
}))

const getExpandedClass = () => {
  return getCleanSetObject({
    s_table__expanded: true,
    's_table__expanded--shadowed': props.shadowExpandedContent,
  })
}

const updateTableDebounce = useDebounceFn(() => updateTable(), 10)

watch([() => props.dense, () => props.outlined, () => props.headers, () => props.items, isStickActive], async () => {
  await updateTableDebounce()
})

const updateOptions = (pageIndex: number) => {
  if (!itemsPerPage.value) return
  emit('update:options', {
    pageIndex,
    itemsPerPage: itemsPerPage.value ?? 10,
    sortBy: Object.entries(sortOrders.value ?? {})
      .filter(([_, order]) => order)
      .map(([key, order]) => ({ key, order: order as KTableSortOrder })),
  })
}

onMounted(() => {
  onHorizontalScroll()
  isMounted.value = true
})

defineExpose({
  updateTable,
  isStickActive,
})
</script>

<style lang="scss">
.s_table {
  $fontSize: map-deep-get($s_headings, 'body__2', 'size');
  width: 100%;
  font-size: $fontSize;
  border-spacing: 0;
  background-color: s_getAppColor('card');

  &__container {
    position: relative;
    overflow: hidden;
  }

  &__wrapper {
    display: block;
    width: 100%;
    overflow: auto;

    // Property is nonstandard. Avoid using it.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-overflow-scrolling
    -webkit-overflow-scrolling: touch;

    &--outlined {
      &.s_table__wrapper--noTopBottomBorders {
        border-right: 1px solid s_getAppColor('border');
        border-left: 1px solid s_getAppColor('border');
      }

      &:not(.s_table__wrapper--noTopBottomBorders) {
        border: 1px solid s_getAppColor('border');
      }
    }
  }

  &__row {
    background-color: s_getAppColor('card');

    &--sticky {
      position: sticky;
      top: 0;
      z-index: 3;
    }

    &:hover {
      background-color: s_getAppColor('card');
    }
  }

  &__group {
    padding: calc($s_spacer * 2);
  }

  .s_table__row {
    .s_tableBodyCell:not(:last-of-type),
    .s_tableHeadCell:not(:last-of-type) {
      border-right: 1px solid s_getAppColor('border');
    }
  }

  &--verticalBorder__hidden {
    .s_table__row {
      .s_tableBodyCell:not(:last-of-type),
      .s_tableHeadCell:not(:last-of-type) {
        border-right: 0;
      }
    }
  }

  &--underlined {
    .s_table__row:not(:last-child) {
      .s_tableBodyCell,
      .s_tableHeadCell {
        @include s_underlined(null, 1px);
      }
    }

    &:not(.s_table--outlined, .s_table--noTopBottomBorders) {
      .s_table__row:first-child {
        .s_tableBodyCell,
        .s_tableHeadCell {
          border-top: 1px solid s_getAppColor('border');
        }
      }

      .s_table__row:last-child {
        .s_tableBodyCell,
        .s_tableHeadCell {
          @include s_underlined(null, 1px);
        }
      }
    }

    .s_table__head {
      /* stylelint-disable no-descending-specificity */
      .s_tableBodyCell,
      .s_tableHeadCell {
        @include s_underlined(null, 1px);
      }
      /* stylelint-enable no-descending-specificity */
    }

    /* stylelint-disable selector-max-compound-selectors */
    .s_table__head + .s_table__body {
      .s_table__row:first-child {
        .s_tableBodyCell,
        .s_tableHeadCell {
          border-top: 0;
        }
      }
    }
    /* stylelint-enable selector-max-compound-selectors */
  }

  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
  }

  &__expanded {
    @include s_underlined(null, 1px);
    padding: calc($s_spacer * 3);

    &--shadowed {
      box-shadow:
        inset 0 4px 8px -5px #323232bf,
        inset 0 -4px 8px -5px #323232bf;
    }
  }
}
</style>
