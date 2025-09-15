import { STable, SButton, SIcon, SCheckbox } from '@khsura/sui/components'
import type { TableItem } from '@khsura/sui/index'
import { action } from 'storybook/actions'
import type { Meta } from '@storybook/vue3-vite'
import { ref, defineComponent, onMounted } from 'vue'
import { createStoryObj } from '@khsura/storybook/helpers'
import { tableHeaders, tableItems } from '@khsura/storybook/constants'
import { wait } from '@khsura/shared'

const table: Meta<typeof STable> = {
  title: 'UI Components/Table',
}

export default table

export const Table = createStoryObj<typeof STable>({
  render: (args) => {
    return {
      components: {
        STable,
        SIcon,
        SButton,
        SCheckbox,
      },
      setup() {
        const items = ref([...tableItems])
        const expanded = ref<TableItem[]>([items.value[0]])
        const selected = ref<TableItem[]>([])
        const itemsPerPage = ref(5)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const itemClass = (_item: any) => {
          return _item.value4 > 500 ? 's_backgroundColor__warning' : ''
        }

        return {
          headers: tableHeaders,
          items,
          expanded,
          selected,
          itemClass,
          args,
          itemsPerPage,
        }
      },
      template: /* html */ `
      <div>
        <STable
          v-bind="args"
          :items="items"
          :item-key="args.itemKey"
          :item-class="itemClass"
          :headers="headers"
          :expanded="expanded"
          :selected="selected"
          @update:expanded="expanded = $event"
          @update:selected="selected = $event"
          @click:row="args.clicsRow"
          :style="{ maxHeight: args.stickyHeader ? '400px' : null,  }"
          v-model:items-per-page="itemsPerPage"
        >
          <template #group="{group}">
            <strong>#Group: {{ group }}</strong>
          </template>
          <template #itemHeader="{ item, value, isSelected, select, row, group }">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong>#ItemHeader: {{ value }}</strong>
              <SCheckbox :id="\`checkbox_\${group}_\${row}\`" :modelValue="isSelected" hide-details @update:modelValue="select()"></SCheckbox>
            </div>
          </template>
          <template #[\`item.value3\`]="{ item, value, expand, isExpanded }">
            <div>
              <span>{{ value }}</span>
              <SButton variant="icon" size="mini" @click="expand" style="float:right;">
                <SIcon icon="mdi-menu-down" :rotated="isExpanded"></SIcon>
              </SButton>
            </div>
            <div>Second line</div>
            <div>Third line</div>
          </template>
          <template #expanded="{ item }">
            <div style="opacity: 0.7">{{ item }}</div>
          </template>
          <template #itemFooter="{ value }">
            <span class="s_textColor__primary">#ItemFooter: {{ value }}</span>
          </template>
        </STable>
  
        <div class="s_text--caption">
          <div>expanded: </div>
          <div>{{ expanded }}</div>
        </div>
        <div class="s_text--caption">
          <div>selected: </div>
          <div>{{ selected }}</div>
        </div>
      </div>
      `,
    }
  },
  args: {
    itemKey: 'number',
    hideHeader: false,
    hidePagination: false,
    dense: false,
    outlined: true,
    underlined: true,
    multiSort: false,
    stickyLeftColumnsOffset: 0,
    stickyLeftColumnsSize: 0,
    stickyLeftColumnsStart: 0,
    stickyHeader: false,
    singleExpand: false,
    itemHeader: 'value6',
    itemFooter: 'footerMessage',
    groupBy: 'value6',
    hideTopBottomBorders: false,
    hideVerticalBorders: false,
    shadowExpandedContent: false,
    'onClick:row': action('click row'),
  },
})

export const TableServer = createStoryObj<typeof STable>({
  render: (args) => {
    return defineComponent({
      components: {
        STable,
      },
      setup() {
        const items = ref<TableItem[]>([])
        const totalItems = ref(0)
        const loading = ref(false)
        const itemsPerPage = ref(5)

        const updateOptions = async (options: {
          pageIndex: number
          itemsPerPage: number
          sortBy: { key: string; order: 'asc' | 'desc' }[]
        }) => {
          loading.value = true
          await wait(1000)
          items.value = tableItems.slice(
            options.pageIndex * options.itemsPerPage,
            (options.pageIndex + 1) * options.itemsPerPage,
          )
          totalItems.value = tableItems.length
          loading.value = false
        }

        onMounted(async () => {
          await updateOptions({ pageIndex: 0, itemsPerPage: itemsPerPage.value, sortBy: [] })
        })

        return {
          args,
          updateOptions,
          items,
          totalItems,
          loading,
          headers: tableHeaders,
          itemsPerPage,
        }
      },
      template: /* html */ `
        <STable
          v-bind="args"
          :items="items"
          :item-key="args.itemKey"
          :headers="headers"
          :loading="loading"
          v-model:items-per-page="itemsPerPage"
          :total-items="totalItems"
          @update:options="updateOptions"
        />
      `,
    })
  },
  args: {
    itemKey: 'number',
    hideHeader: false,
    hidePagination: false,
    dense: false,
    outlined: true,
  },
})
