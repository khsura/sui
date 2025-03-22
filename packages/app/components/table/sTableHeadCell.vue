<template>
  <th
    class="s_tableHeadCell"
    v-bind="getCleanSetObject({ scope: header.scope, colspan: header.colspan, rowspan: header.rowspan })"
    :style="cellStyle"
    :class="cellClass"
  >
    <div class="s_tableHeadCell__inner">
      <div :class="contentClasses">
        <slot></slot>
      </div>

      <kButton
        v-if="header.sortable && isScopeColType"
        class="s_tableHeadCell__sorter"
        :icon="!multiSort"
        size="mini"
        :class="sortIconClasses"
        @click="sortBy()"
      >
        {{ sortIcon }}
      </kButton>
    </div>
  </th>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import kButton from '@khsura/sui/components/sButton.vue'
import { getCleanSetObject, getHtmlClassAttributeObject } from '@khsura/sui/lib'
import { getNextSortOrder } from '@khsura/sui/repositories/tableRepository'
import { useTableHeadCellService } from '@khsura/sui/services'
import { KTableSortOrder, type PropsTableHeadCell } from '@khsura/sui/types'

const props = defineProps<PropsTableHeadCell>()
const sortOrders = defineModel<Record<string, KTableSortOrder | undefined>>('sortOrders', { default: {} })
const { cellStyle, isScopeColType } = useTableHeadCellService(props)

const cellClass = computed(() => {
  return getCleanSetObject({
    's_tableHeadCell--sticky': props.sticky,
    's_tableHeadCell--dense': props.dense && !props.header.noGutters,
    's_tableHeadCell--noGutters': !!props.header.noGutters,
    ...getHtmlClassAttributeObject(props.header.class),
  })
})

const contentClasses = computed(() => {
  return getCleanSetObject({
    s_tableHeadCell__content: true,
    [`s_tableHeadCell__content--align__${props.header.align}`]: !!props.header.align,
    's_tableHeadCell__content--textWrap': !!props.header.textWrap,
  })
})

const sortPriority = computed(() => {
  const priorities = Object.entries(sortOrders.value)
    .filter(([_, order]) => order !== undefined)
    .map(([name]) => name)

  const priority = priorities.indexOf(props.header.value.toString())

  return priority > -1 ? priority + 1 : null
})

const isSorted = computed(() => {
  const priority = sortPriority.value

  if (!props.multiSort && priority && priority > 1) {
    return false
  }

  return sortOrders.value[props.header.value.toString()] !== undefined
})

const sortIconClasses = computed(() => {
  return getCleanSetObject({
    s_tableHeadCell__sorter: true,
    's_tableHeadCell__sorter--sorted': isSorted.value,
  })
})

const sortBy = () => {
  const order = getNextSortOrder(sortOrders.value[props.header.value])

  if (props.header.sortable !== false) {
    if (props.multiSort) {
      if (order === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete sortOrders.value[props.header.value.toString()]
        sortOrders.value = {
          ...sortOrders.value,
        }
      } else {
        sortOrders.value = {
          ...sortOrders.value,
          [props.header.value]: order,
        }
      }
    } else {
      sortOrders.value =
        order !== undefined
          ? {
              [props.header.value]: order,
            }
          : {}
    }
  } else {
    sortOrders.value = {}
  }
}

const sortIcon = computed(() => {
  if (!isSorted.value) {
    return '⇅'
  }

  const displayPriority = props.multiSort ? (sortPriority.value?.toString() ?? '') : ''
  const order = sortOrders.value[props.header.value.toString()]

  if (order === KTableSortOrder.ascending) {
    return `↑${displayPriority}`
  }

  if (order === KTableSortOrder.descending) {
    return `↓${displayPriority}`
  }

  return '⇅'
})
</script>

<style lang="scss">
.s_tableHeadCell {
  font-size: map-deep-get($s_headings, 'caption', 'size');

  @include tableCell();

  &__inner {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
  }

  &__content {
    @include tableCellContent();
  }

  &__sorter {
    margin-left: calc($s_spacer / 2);
    font-size: map-deep-get($s_headings, 'caption', 'size');
    color: s_getAppColor('disabled');

    &.s_button {
      flex: 0 0 auto;
      padding: 0;
      font-size: 0.9rem;
    }

    &--sorted {
      color: s_getPresetColor('info');
    }
  }
}
</style>
