<template>
  <td class="s_tableBodyCell" :class="cellClass" :style="itemStyles" v-bind="getCleanSetObject({ colspan })">
    <slot></slot>
  </td>
</template>

<script lang="ts" setup generic="T extends TableItem = TableItem">
import { computed } from 'vue'
import { getCleanSetObject } from '@khsura/sui/lib'
import { useTableBodyCellService } from '@khsura/sui/services'
import { type PropsTableBodyCell, type TableItem } from '@khsura/sui/types'

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
.s_tableBodyCell {
  @include tableCell();
  @include tableCellContent();
}
</style>
