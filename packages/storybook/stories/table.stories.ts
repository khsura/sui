import { faker } from '@khsura/shared'
import { STable, SButton, SIcon, SCheckbox } from '@khsura/sui/index'
import type { TableHeader, TableItem } from '@khsura/sui/index'
import { action } from '@storybook/addon-actions'
import type { Meta } from '@storybook/vue3'
import { ref } from 'vue'
import { createStoryObj } from '@khsura/storybook/helpers'

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
        const expanded = ref<TableItem[]>([items.value[0]])
        const selected = ref<TableItem[]>([])

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const itemClass = (_item: any) => {
          return _item.value4 > 500 ? 's_backgroundColor__warning' : ''
        }

        return {
          headers,
          items,
          expanded,
          selected,
          itemClass,
          args,
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

const headers = ref<TableHeader[]>([
  {
    text: 'no',
    value: 'number',
    width: '20',
    align: 'center',
    textWrap: true,
    sortable: true,
    cellNoGutters: true,
  },
  { text: 'header2', value: 'value2', width: '150', align: 'start' },
  {
    text: 'header3',
    align: 'center',
    sortable: true,
    value: 'value3',
    width: '30%',
    cellClass: 's_text--truncate',
  },
  {
    text: 'header4',
    value: 'value4',
    sortable: true,
    width: '20%',
  },
  { text: 'header5', value: 'value5', align: 'end', width: '10%' },
  { text: 'header6', value: 'value6', align: 'center', width: '10%', sortable: true },
  { text: 'header7', value: 'value7', width: '10%' },
  { text: 'header8', value: 'value8', width: '300px' },
])

const items = ref<TableItem[]>([
  {
    number: 1,
    value2: faker.animal.type(),
    value3: 'Frozen Yogurt',
    value4: 159,
    value5: 6.0,
    value6: 24,
    value7: 4.0,
    value8: '1%',
  },
  {
    number: 2,
    value2: faker.animal.type(),
    value3: 'Ice cream sandwich',
    value4: 237,
    value5: 9.0,
    value6: 37,
    value7: 4.3,
    value8: '1%',
  },
  {
    number: 3,
    value2: faker.animal.type(),
    value3: 'Eclair',
    value4: 262,
    value5: 16.0,
    value6: 23,
    value7: 6.0,
    value8: '7%',
  },
  {
    number: 4,
    value3: 'Cupcake',
    value2: faker.animal.type(),
    value4: 305,
    value5: 3.7,
    value6: 67,
    value7: '-',
    value8: '8%',
  },
  {
    number: 5,
    value3: 'Gingerbread',
    value2: faker.animal.type(),
    value4: 356,
    value5: 16.0,
    value6: 49,
    value7: 3.9,
    value8: '16%',
    footerMessage: 'Gingerbread is very delicious',
  },
  {
    number: 6,
    value3: 'Jelly bean',
    value2: faker.animal.type(),
    value4: 375,
    value5: 0.0,
    value6: 94,
    value7: 0.0,
    value8: '0%',
  },
  {
    number: 7,
    value3: 'Lollipop',
    value2: faker.animal.type(),
    value4: 392,
    value6: 0.2,
    value7: 98,
    value8: '-',
    value9: '2%',
  },
  {
    number: 8,
    value3: 'Honeycomb',
    value2: faker.animal.type(),
    value4: 408,
    value5: 3.2,
    value6: 87,
    value7: 6.5,
    value8: '45%',
  },
  {
    number: 9,
    value3: 'Donut',
    value2: faker.animal.type(),
    value4: 452,
    value6: 25.0,
    value7: 51,
    value8: 4.9,
    value9: '22%',
  },
  {
    number: 10,
    value3: 'KitKat',
    value2: faker.animal.type(),
    value4: 518,
    value6: 26.0,
    value7: 65,
    value8: 7,
    value9: '6%',
    footerMessage: 'KitKat is very delicious',
  },
])
