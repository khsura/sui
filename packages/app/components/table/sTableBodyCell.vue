<template>
  <td class="s_tableBodyCell" :class="computedCellClass" :style="itemStyles" v-bind="getCleanSetObject({ colspan })">
    <slot></slot>
  </td>
</template>

<script lang="ts" setup generic="T extends TableItem = TableItem">
import { computed } from 'vue'
import { getCleanSetObject } from '@/app/lib'
import { useComponentDefaultsService, useTableBodyCellService } from '@/app/services'
import { type TableItem } from '@/app/types'
import type { PropsTableBodyCell } from '@/app/definitions'

const rawProps = defineProps<PropsTableBodyCell<T>>()
const props = useComponentDefaultsService('STableBodyCell', rawProps)
const { itemStyles, itemClasses } = useTableBodyCellService(props)

const computedCellClass = computed(() => {
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
