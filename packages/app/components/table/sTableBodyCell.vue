<template>
  <td class="s_tableBodyCell" :class="cellClass" :style="itemStyles" v-bind="getCleanSetObject({ colspan })">
    <slot></slot>
  </td>
</template>

<script lang="ts" setup generic="T extends TableItem = TableItem">
import { type PropsTableBodyCell, type TableItem } from '@sui/app/types'
import { getCleanSetObject } from '@sui/app/lib'
import { useTableBodyCellService } from '@sui/app/services'
import { computed } from 'vue'

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<PropsTableBodyCell<T>>()
const { itemStyles, itemClasses } = useTableBodyCellService(props)

const cellClass = computed(() => {
  return getCleanSetObject({
    's_tableBodyCell--sticky': props.sticky,
    [`s_tableBodyCell--align__${props.header?.align}`]: !!props.header?.align,
    's_tableBodyCell--textWrap': !!props.header?.textWrap,
    's_tableBodyCell--noGutters': !!props.header?.cellNoGutters,
    ...itemClasses.value,
  })
})
</script>

<style lang="scss">
@import './mixins';

.s_tableBodyCell {
  @include tableCell();
  @include tableCellContent();
}
</style>
