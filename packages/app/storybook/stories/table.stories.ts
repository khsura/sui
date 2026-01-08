import { action } from 'storybook/actions'
import type { Meta } from '@storybook/vue3-vite'
import { ref, defineComponent, onMounted } from 'vue'
import { faker, wait } from '@khsura/shared'
import { STable, SButton, SIcon, SCheckbox } from '@/app/components'
import type { TableItem } from '@/app/index'
import { createStoryObj } from '@/app/storybook/helpers'
import { tableHeaders, tableItems } from '@/app/storybook/constants'

const table: Meta<typeof STable> = {
  title: 'UI Components/Table',
  argTypes: {
    stickyRightColumn: {
      type: 'boolean',
    },
    itemsPerPageLabel: {
      type: 'string',
    },
  },
}

export default table

export const Table = createStoryObj<typeof STable>({
  args: {
    dense: false,
    groupBy: undefined,
    hideHeader: false,
    hidePagination: false,
    hideTopBottomBorders: false,
    hideVerticalBorders: false,
    itemFooter: 'footerMessage',
    itemHeader: undefined,
    itemsPerPage: 1000,
    itemKey: 'name',
    multiSort: false,
    outlined: true,
    singleExpand: false,
    stickyHeader: false,
    stickyLeftColumnsOffset: undefined,
    stickyLeftColumnsSize: undefined,
    stickyLeftColumnsStart: undefined,
    stickyRightColumn: undefined,
    shadowExpandedContent: false,
    singleSelect: false,
    tile: false,
    underlined: true,
    loading: false,
    itemsPerPageLabel: undefined,
  },
  render: (args) => {
    return {
      components: {
        STable,
      },
      setup: () => {
        const headers = [
          {
            text: 'Name',
            value: 'name',
          },
          {
            text: 'Age',
            value: 'age',
          },
          {
            text: 'Gender',
            value: 'gender',
          },
        ]

        const items = Array.from({ length: 50 }, () => ({
          name: faker.person.fullName(),
          age: faker.number.int({ min: 18, max: 65 }),
          gender: faker.person.gender(),
        }))

        return {
          args,
          headers,
          items,
        }
      },
      template: /* html */ `
        <STable
          v-bind="args"
          :items="items"
          :item-key="args.itemKey ?? 'name'"
          :headers="headers"
        />
      `,
    }
  },
})

export const TableMore = createStoryObj<typeof STable>({
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
