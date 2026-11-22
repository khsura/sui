import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import { expect, userEvent, waitFor } from 'storybook/test'
import { SAutocomplete, SButton, SEmptyState, SSelect, STable } from '@/app/index'
import { argTypesComponentTheme, argTypesSizePreset, argTypesTextColor } from '@/app/storybook/argTypes'
import { createStoryObj } from '@/app/storybook/helpers'

const emptyState: Meta<typeof SEmptyState> = {
  title: 'UI Components/EmptyState',
  component: SEmptyState,
  tags: ['a11y'],
  argTypes: {
    ...argTypesTextColor({}),
    ...argTypesComponentTheme,
    ...argTypesSizePreset,
    icon: { control: { type: 'text' }, description: 'Material Design icon, ignored when `image` is set' },
    image: { control: { type: 'text' }, description: 'Decorative illustration URL, wins over `icon`' },
  },
}

export default emptyState

// A small inline illustration, so the stories need no network.
const illustration =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><rect x="20" y="30" width="120" height="70" rx="8" fill="#90a4ae"/><rect x="40" y="15" width="80" height="20" rx="4" fill="#cfd8dc"/></svg>',
  )

export const EmptyState = createStoryObj<typeof SEmptyState>({
  args: {
    icon: 'mdi-inbox-outline',
    image: undefined,
    title: 'No orders yet',
    text: 'Orders you create appear here. Start with your first order.',
    actionText: 'Create order',
    color: undefined,
    theme: undefined,
    size: null,
  },
  render: (args) =>
    defineComponent({
      components: { SEmptyState },
      setup() {
        const clicks = ref(0)

        return { args, clicks }
      },
      template: /* html */ `
        <div>
          <SEmptyState v-bind="args" @action="clicks++"></SEmptyState>
          <p class="s_mt__4">Action clicked {{ clicks }} times</p>
        </div>
      `,
    }),
})

const tableHeaders = [
  { text: 'Order', value: 'id' },
  { text: 'Customer', value: 'customer' },
  { text: 'Total', value: 'total' },
]

// SEmptyState in the no-data slot of STable, SSelect and SAutocomplete. Their default no-data look is unchanged:
// STable still shows its text, and SSelect / SAutocomplete show nothing unless given `noDataText` or the slot.
export const InsideOtherComponents = createStoryObj<typeof SEmptyState>({
  render: () =>
    defineComponent({
      components: { SEmptyState, STable, SSelect, SAutocomplete },
      setup() {
        return { tableHeaders, items: ['Apple', 'Banana', 'Cherry'] }
      },
      template: /* html */ `
        <div style="display: flex; flex-direction: column; gap: 24px; max-width: 640px">
          <STable :headers="tableHeaders" :items="[]" outlined hide-pagination>
            <template #noData>
              <SEmptyState icon="mdi-cart-outline" size="small" title="No orders yet" text="Orders you create appear here."></SEmptyState>
            </template>
          </STable>
          <SSelect label="Warehouse" :items="[]">
            <template #noData>
              <SEmptyState icon="mdi-warehouse" size="mini" title="No warehouses" text="Add one in Settings."></SEmptyState>
            </template>
          </SSelect>
          <SAutocomplete label="Fruit" :items="items">
            <template #noData="{ query }">
              <SEmptyState icon="mdi-magnify" size="mini" :title="'Nothing matches “' + query + '”'"></SEmptyState>
            </template>
          </SAutocomplete>
        </div>
      `,
    }),
})

// Sub-pixel rounding allowed in the geometry checks.
const pixelTolerance = 1
// The phone width the empty states in the frame must fit without scrolling sideways.
const phoneWidth = 375
// The default dark theme's secondaryText (#cccccc), as getComputedStyle reports it.
const darkThemeSecondaryText = 'rgb(204, 204, 204)'
const longTitle = 'We could not find any invoices for this customer in the selected period'

const longText =
  'Try a wider date range or another customer. Supercalifragilisticexpialidociousunbrokenwordthatmustwrap stays inside.'

const assertThat = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const getRect = (element: Element | null | undefined) => {
  if (!element) {
    throw new Error('element not found')
  }

  return element.getBoundingClientRect()
}

// The cases AI code gets wrong: every size, an image instead of an icon, a long title and an unbroken word at
// 375px, two actions in the slot, an empty state in a flex row, in dark theme, in an STable no-data row and
// in an opened SSelect with no items.
// A plain object literal, so Storybook's static indexer reads the `visual` tag.
export const EmptyStateStress = {
  tags: ['visual'],
  render: () => ({
    components: { SEmptyState, SButton, SSelect, STable },
    setup() {
      return { phoneWidth, longTitle, longText, illustration, tableHeaders }
    },
    template: /* html */ `
      <div class="s_pa__4" style="display: flex; flex-direction: column; gap: 16px">
        <div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: 8px">
          <SEmptyState v-for="size in ['mini', 'small', 'default', 'large', 'extra']" :key="size" :size="size"
            icon="mdi-inbox-outline" :title="size" style="width: auto; flex: 1 1 120px; outline: 1px dashed currentColor"></SEmptyState>
        </div>
        <div class="stress-phone" :style="{ width: phoneWidth + 'px', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '12px', outline: '1px dashed currentColor' }">
          <SEmptyState icon="mdi-file-document-outline" color="primary" :title="longTitle" :text="longText" action-text="Change the filters"></SEmptyState>
          <SEmptyState :image="illustration" size="large" title="Your cart is empty" text="Add products to see them here."></SEmptyState>
          <SEmptyState icon="mdi-account-multiple-outline" title="No members">
            <template #actions>
              <SButton color="primary">Invite</SButton>
              <SButton variant="text">Learn more about members</SButton>
            </template>
          </SEmptyState>
          <div style="display: flex; align-items: center; gap: 8px">
            <span>Inbox</span>
            <SEmptyState icon="mdi-email-outline" size="small" title="No mail" :text="longText"></SEmptyState>
          </div>
          <SEmptyState class="stress-dark" theme="dark" icon="mdi-weather-night" title="Dark theme" text="Readable in both themes." action-text="Retry"></SEmptyState>
          <STable :headers="tableHeaders" :items="[]" outlined hide-pagination>
            <template #noData>
              <SEmptyState icon="mdi-cart-outline" size="small" title="No orders yet" :text="longText"></SEmptyState>
            </template>
          </STable>
          <SSelect class="stress-select" label="Warehouse" :items="[]">
            <template #noData>
              <SEmptyState icon="mdi-warehouse" size="mini" title="No warehouses" text="Add one in Settings."></SEmptyState>
            </template>
          </SSelect>
          <div style="height: 200px"></div>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.ownerDocument.documentElement
    const phone = canvasElement.querySelector('.stress-phone')
    const combobox = canvasElement.querySelector<HTMLElement>('.stress-select [role="combobox"]')

    assertThat(!!combobox, 'the select is not rendered')
    await userEvent.click(combobox as HTMLElement)

    await waitFor(() => {
      const frame = getRect(phone)
      const emptyStates = [...(phone?.querySelectorAll('.s_emptyState') ?? [])]

      assertThat(emptyStates.length === 6, `expected 6 empty states in the frame, found ${emptyStates.length}`)

      for (const [index, element] of emptyStates.entries()) {
        const rect = getRect(element)

        assertThat(
          rect.left >= frame.left - pixelTolerance && rect.right <= frame.right + pixelTolerance,
          `empty state ${index} overflows the ${phoneWidth}px frame`,
        )

        for (const part of element.querySelectorAll(
          '.s_emptyState__title, .s_emptyState__text, .s_emptyState__image',
        )) {
          const partRect = getRect(part)

          assertThat(
            partRect.left >= rect.left - pixelTolerance && partRect.right <= rect.right + pixelTolerance,
            `empty state ${index}: ${part.className} sticks out of its box`,
          )
          assertThat(
            part.scrollWidth <= part.clientWidth + pixelTolerance,
            `empty state ${index}: ${part.className} is clipped`,
          )
        }
      }

      // theme="dark" on a light page: the title and the muted text take the dark theme's colours, not the app's.
      const dark = phone?.querySelector('.stress-dark')
      const darkTitleColor = getComputedStyle(dark?.querySelector('.s_emptyState__title') ?? document.body).color
      const darkTextColor = getComputedStyle(dark?.querySelector('.s_emptyState__text') ?? document.body).color

      assertThat(
        darkTitleColor === getComputedStyle(dark ?? document.body).color,
        'the dark title does not follow the theme',
      )
      assertThat(
        darkTextColor === darkThemeSecondaryText,
        `the dark text is ${darkTextColor}, not the dark secondaryText`,
      )

      const menuMessage = canvasElement.ownerDocument.querySelector('.s_select__noData .s_emptyState__title')

      assertThat(
        menuMessage?.textContent?.trim() === 'No warehouses',
        'the opened select does not show its empty state',
      )
    })

    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + pixelTolerance)
  },
} satisfies StoryObj<typeof SEmptyState>
