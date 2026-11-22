import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { userEvent, waitFor } from 'storybook/test'
import {
  SBadge,
  SBreadcrumbs,
  SButton,
  SCard,
  SCardActions,
  SCardText,
  SCardTitle,
  SChip,
  SColumn,
  SExpansionPanel,
  SExpansionPanelContent,
  SExpansionPanelHeader,
  SExpansionPanels,
  SIcon,
  SImage,
  SList,
  SListItem,
  SListItemAction,
  SListItemContent,
  SListItemIcon,
  SListItemSubtitle,
  SListItemTitle,
  SRow,
  SStepper,
  STab,
  STable,
  STabs,
  type TableHeader,
} from '@/app/index'
import { assertNoListMarkers } from '@/app/storybook/helpers'

// Stress cases for the data-display components. Each story groups several cases so the visual harness stays fast,
// and each `play` function checks the geometry, so the stories double as interaction tests.
const dataDisplayStress: Meta = {
  title: 'Stress/Data display',
}

export default dataDisplayStress

// Sub-pixel rounding allowed in the geometry checks.
const pixelTolerance = 1
// The narrowest a list item's text may get next to its actions before the actions move below it.
const listContentMinWidth = 96
const tableRowCount = 12
const tableMaxHeight = 320
const tabLabels = ['Overview', 'Specifications', 'Reviews and ratings', 'Shipping', 'Returns', 'Warranty', 'FAQ']

// A local image, so the screenshots do not depend on the network.
const createImage = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>`,
  )}`

const products = [
  {
    name: 'Wireless Headphones',
    image: createImage('#1e3c72', '#2a5298'),
    tag: 'New',
    price: '$129.99',
    categories: ['Audio', 'Electronics', 'Bluetooth', 'Noise cancelling'],
  },
  {
    name: 'Noise-Cancelling Over-Ear Studio Headphones with Carrying Case',
    image: createImage('#ff512f', '#dd2476'),
    tag: 'Sale',
    price: '$249.00',
    categories: ['Audio'],
  },
  {
    name: 'Supercalifragilisticexpialidocious',
    image: '',
    tag: '',
    price: '$9.50',
    categories: ['Toys', 'Kids'],
  },
  {
    name: 'Mug',
    image: createImage('#11998e', '#38ef7d'),
    tag: 'New',
    price: '$14.99',
    categories: [],
  },
]

const getRect = (element: Element | null) => {
  if (!element) {
    throw new Error('element not found')
  }

  return element.getBoundingClientRect()
}

// Plain throwing checks: they run inside `waitFor` callbacks, which retry until no error is thrown.
const assertThat = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const assertNoPageOverflow = (canvasElement: HTMLElement) => {
  const root = canvasElement.ownerDocument.documentElement

  assertThat(root.scrollWidth <= root.clientWidth + pixelTolerance, 'the page scrolls horizontally')
}

const getTitlePadding = (element: Element) => {
  const style = getComputedStyle(element)

  return Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight)
}

// The rectangle of an element's text, not of its box.
const getTextRect = (element: Element | null) => {
  if (!element) {
    throw new Error('element not found')
  }

  const range = element.ownerDocument.createRange()

  range.selectNodeContents(element)

  return range.getBoundingClientRect()
}

// Product cards in a grid: a long title, an unbreakable title, a missing image, unequal content heights,
// a centred title, chips that wrap and a badge on an icon button. The cards are flex columns, as AI code writes them.
export const CardGrid = {
  tags: ['visual'],
  render: () => ({
    components: {
      SBadge,
      SButton,
      SCard,
      SCardActions,
      SCardText,
      SCardTitle,
      SChip,
      SColumn,
      SIcon,
      SImage,
      SRow,
    },
    setup: () => ({ products }),
    template: /* html */ `
      <div>
        <SRow align="center" justify="spaceBetween" class="s_mb__4">
          <SColumn cols="auto"><h1 class="s_text--h5">Product catalog</h1></SColumn>
          <SColumn cols="auto">
            <SBadge value overlap color="error" content="12" label="12 items in cart" class="stress-cart-badge">
              <SButton variant="icon" aria-label="Cart"><SIcon icon="mdi-cart" /></SButton>
            </SBadge>
          </SColumn>
        </SRow>
        <SRow>
          <SColumn v-for="product in products" :key="product.name" :cols="12" :sm="6" :lg="3">
            <SCard :elevation="2" class="stress-product-card" style="display: flex; flex-direction: column; height: 100%;">
              <SImage :src="product.image" :alt="product.name" :aspect-ratio="4 / 3" object-fit="cover" class="stress-product-image">
                <div v-if="product.tag" class="s_pa__2">
                  <SBadge value inline color="error" :content="product.tag" :label="product.tag" />
                </div>
              </SImage>
              <SCardTitle class="stress-product-title">{{ product.name }}</SCardTitle>
              <SCardText style="flex: 1 0 auto;">
                <div class="s_text--h6 s_mb__2">{{ product.price }}</div>
                <div class="stress-chips" style="display: flex; flex-wrap: wrap; gap: 4px;">
                  <SChip v-for="category in product.categories" :key="category" size="small" outlined color="primary">{{ category }}</SChip>
                </div>
              </SCardText>
              <SCardActions>
                <SButton color="primary" block><SIcon icon="mdi-cart-plus" /><span class="s_ml__2">Add to cart</span></SButton>
              </SCardActions>
            </SCard>
          </SColumn>
        </SRow>
        <SRow>
          <SColumn :cols="12" :sm="6">
            <SCard outlined>
              <SCardTitle class="s_textAlign__center stress-centred-title">Sign in</SCardTitle>
              <SCardText class="s_textAlign__center">The title above is centred with a text-align class.</SCardText>
            </SCard>
          </SColumn>
        </SRow>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      assertNoPageOverflow(canvasElement)

      // Every product image keeps its 4:3 shape, even in a flex-column card next to a taller card.
      for (const image of canvasElement.querySelectorAll('.stress-product-image')) {
        const rect = getRect(image)

        assertThat(Math.abs(rect.height - (rect.width * 3) / 4) <= pixelTolerance, 'a card image is squashed')
      }

      // Titles wrap between words: the first word of a title is never split across two lines.
      for (const title of canvasElement.querySelectorAll('.stress-product-title')) {
        const firstWord = title.textContent?.trim().split(' ')[0] ?? ''
        const textNode = [...title.childNodes].find((node) => node.textContent?.includes(firstWord))

        if (!firstWord || !textNode || textNode.nodeType !== Node.TEXT_NODE) {
          continue
        }

        const range = title.ownerDocument.createRange()
        const start = textNode.textContent?.indexOf(firstWord) ?? 0

        range.setStart(textNode, start)
        range.setEnd(textNode, start + firstWord.length)
        const wordRects = [...range.getClientRects()]
        const lineCount = new Set(wordRects.map((rect) => Math.round(rect.top))).size
        const wordWidth = wordRects.reduce((total, rect) => total + rect.width, 0)
        // A word wider than the title's content box may (and must) be split.
        const isWiderThanTitle = wordWidth > title.clientWidth - getTitlePadding(title)

        assertThat(lineCount === 1 || isWiderThanTitle, `"${firstWord}" is broken mid-word`)
        assertThat(title.scrollWidth <= title.clientWidth + pixelTolerance, `"${firstWord}" overflows its card`)
      }

      // A text-align class centres the card title.
      const centredTitle = canvasElement.querySelector('.stress-centred-title')
      const titleRect = getRect(centredTitle)
      const textRect = getTextRect(centredTitle)
      const leftGap = textRect.left - titleRect.left
      const rightGap = titleRect.right - textRect.right

      assertThat(Math.abs(leftGap - rightGap) <= pixelTolerance * 2, 'the s_textAlign__center title is not centred')
    })
  },
} satisfies StoryObj

type Order = {
  id: number
  customer: string
  email: string
  product: string
  note: string
  status: string
  total: string
  date: string
}

const orderHeaders: TableHeader<keyof Order>[] = [
  { text: 'Order', value: 'id', sortable: true },
  { text: 'Customer', value: 'customer', sortable: true },
  { text: 'Email', value: 'email' },
  { text: 'Product', value: 'product' },
  { text: 'Note', value: 'note', textWrap: true, width: 240 },
  { text: 'Status', value: 'status' },
  { text: 'Total', value: 'total', align: 'end', sortable: true },
  { text: 'Date', value: 'date' },
]

const orders: Order[] = Array.from({ length: tableRowCount }, (_, index) => ({
  id: 1000 + index,
  customer: index === 0 ? 'Bartholomew Montgomery-Fitzgerald' : `Customer ${index + 1}`,
  email: `customer${index + 1}@example.com`,
  product: index === 1 ? 'Noise-Cancelling Over-Ear Studio Headphones' : 'Mug',
  note:
    index === 0
      ? 'Leave the parcel with the neighbour at number 12 if nobody answers the door, and call before delivery.'
      : '',
  status: index % 2 ? 'Shipped' : 'Pending',
  total: `$${(index * 17.5 + 9.99).toFixed(2)}`,
  date: `2026-11-${String(index + 1).padStart(2, '0')}`,
}))

// A wide table in a height-limited box with a sticky header, long cell text, a sorted column, an empty table and a
// loading table. At 375px the table scrolls inside its own box instead of the page.
export const TableStates = {
  tags: ['visual'],
  render: () => ({
    components: { STable, SChip },
    setup: () => ({ orderHeaders, orders, tableMaxHeight, itemsPerPage: ref(tableRowCount) }),
    template: /* html */ `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <STable
          v-model:items-per-page="itemsPerPage"
          class="stress-wide-table"
          :headers="orderHeaders"
          :items="orders"
          sticky-header
          outlined
          dense
          :style="{ maxHeight: tableMaxHeight + 'px' }"
        >
          <template #item.status="{ item }">
            <SChip size="small" :color="item.status === 'Shipped' ? 'info' : 'warning'">{{ item.status }}</SChip>
          </template>
        </STable>
        <STable class="stress-empty-table" :headers="orderHeaders.slice(0, 3)" :items="[]" outlined hide-pagination />
        <STable class="stress-loading-table" :headers="orderHeaders.slice(0, 3)" :items="[]" outlined hide-pagination loading />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const sorter = await waitFor(() => {
      const button = canvasElement.querySelector<HTMLElement>('.stress-wide-table .s_tableHeadCell__sorter')

      assertThat(!!button, 'sort button not found')

      return button
    })

    if (sorter) {
      await userEvent.click(sorter)
    }

    const wrapper = canvasElement.querySelector('.stress-wide-table .s_table__wrapper')

    await waitFor(() => {
      // Scroll the rows to the end on every retry, so the check does not depend on when the styles apply.
      if (wrapper) {
        wrapper.scrollTop = wrapper.scrollHeight
      }

      assertNoPageOverflow(canvasElement)
      assertThat(
        !!canvasElement.querySelector('.stress-wide-table .s_tableHeadCell__sorter--sorted'),
        'no sort indicator',
      )

      // The height limit makes the rows scroll inside the table, and the pagination stays visible below them.
      const table = getRect(canvasElement.querySelector('.stress-wide-table'))
      const pagination = getRect(canvasElement.querySelector('.stress-wide-table .s_tablePagination'))

      assertThat(table.height <= tableMaxHeight + pixelTolerance, 'the table grows past its max-height')
      assertThat(pagination.bottom <= table.bottom + pixelTolerance, 'the pagination is cut off by the max-height')
      assertThat(!!wrapper && wrapper.scrollTop > 0, 'the rows do not scroll inside the table')

      // The sticky header stays at the top of the scrolled rows.
      const header = getRect(canvasElement.querySelector('.stress-wide-table .s_table__head .s_table__row'))
      const wrapperRect = getRect(wrapper)

      assertThat(Math.abs(header.top - wrapperRect.top) <= pixelTolerance, 'the sticky header scrolled away')

      assertThat(
        !!canvasElement.querySelector('.stress-empty-table .s_table__noData'),
        'the empty table has no empty state',
      )
      assertThat(
        !!canvasElement.querySelector('.stress-loading-table .s_table__row--loading'),
        'the loading table shows no loading row',
      )
    })
  },
} satisfies StoryObj

// More tabs than fit, with long labels. At 375px the tabs stay on one row and scroll sideways.
const tabsTemplate = /* html */ `
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <STabs v-model="activeTab" class="stress-many-tabs" underlined>
      <STab v-for="(label, index) in tabLabels" :key="label" :tab="index">{{ label }}</STab>
    </STabs>
    <STabs v-model="denseTab" class="stress-two-tabs" bordered dense>
      <STab :tab="0">Account settings and preferences</STab>
      <STab :tab="1">Billing</STab>
    </STabs>
  </div>
`

// The selected tab is fully inside the scrolling row of tabs.
const assertSelectedTabInView = (canvasElement: HTMLElement) => {
  const tabs = getRect(canvasElement.querySelector('.stress-many-tabs'))
  const selected = getRect(canvasElement.querySelector('.stress-many-tabs .s_toggleButton--selected'))

  assertThat(
    selected.left >= tabs.left - pixelTolerance && selected.right <= tabs.right + pixelTolerance,
    'the selected tab is out of view',
  )
}

export const TabsOverflow = {
  tags: ['visual'],
  render: () => ({
    components: { STab, STabs },
    setup: () => ({ tabLabels, activeTab: ref(0), denseTab: ref(0) }),
    template: tabsTemplate,
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      assertNoPageOverflow(canvasElement)

      for (const tabs of canvasElement.querySelectorAll('.s_tabs')) {
        const tops = new Set([...tabs.querySelectorAll('.s_tab')].map((tab) => Math.round(getRect(tab).top)))

        assertThat(tops.size === 1, 'the tabs wrap onto more than one row')

        for (const label of tabs.querySelectorAll('.s_toggleButton__button')) {
          assertThat(label.scrollWidth <= label.clientWidth + pixelTolerance, `tab "${label.textContent}" is clipped`)
        }
      }

      assertSelectedTabInView(canvasElement)
    })
  },
} satisfies StoryObj

// A selected tab past the right edge is scrolled into view. Not a visual story: Chromium's full-page capture
// re-lays the page out and clamps the scroll position of inner scrollers, so the screenshot would not show it.
export const TabsSelectedOutOfView = {
  render: () => ({
    components: { STab, STabs },
    setup: () => ({ tabLabels, activeTab: ref(tabLabels.length - 2), denseTab: ref(1) }),
    template: tabsTemplate,
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() => assertSelectedTabInView(canvasElement))

    const firstTab = canvasElement.querySelector<HTMLElement>('.stress-many-tabs .s_toggleButton__button')

    if (firstTab) {
      await userEvent.click(firstTab)
    }

    await waitFor(() => assertSelectedTabInView(canvasElement))
  },
} satisfies StoryObj

// Tabs that do not fit a 375px column (the after-M2 eval: "Account" was cut off with no sign that the row
// scrolls). The end that hides tabs fades out and shows a scroll arrow, and the last tab, once selected, is
// scrolled fully into view. The play ends back on the first tab, so the screenshot shows the starting state: the
// right-hand arrow and fade. The arrow's own scrolling is covered by tests/components/sTabs.test.ts: its smooth
// scroll animation does not run reliably in the visual harness's WebKit.
const narrowTabsLabels = ['Getting started', 'Billing and invoices', 'Account settings', 'Notifications', 'Security']

const getScrollButton = (canvasElement: HTMLElement, edge: 'start' | 'end') =>
  canvasElement.querySelector<HTMLElement>(`.stress-narrow-tabs .s_tabs__scrollButton--${edge}`)

const assertScrollButtons = (canvasElement: HTMLElement, expected: { start: boolean; end: boolean }) => {
  for (const edge of ['start', 'end'] as const) {
    const button = getScrollButton(canvasElement, edge)
    const isVisible = !!button && getRect(button).width > 0
    const tabs = getRect(canvasElement.querySelector('.stress-narrow-tabs'))

    if (button && isVisible) {
      const arrow = getRect(button)

      const isAtEdge =
        edge === 'start'
          ? Math.abs(arrow.left - tabs.left) <= pixelTolerance
          : Math.abs(arrow.right - tabs.right) <= pixelTolerance

      assertThat(isAtEdge, `the ${edge} scroll arrow is not at the ${edge} edge of the tabs`)
    }

    assertThat(
      isVisible === expected[edge],
      `the ${edge} scroll arrow should be ${expected[edge] ? 'shown' : 'hidden'}`,
    )
  }
}

const assertTabFullyInView = (canvasElement: HTMLElement, tabIndex: number) => {
  const scroller = getRect(canvasElement.querySelector('.stress-narrow-tabs .s_toggleButtonGroup__content'))
  const tab = getRect(canvasElement.querySelectorAll('.stress-narrow-tabs .s_tab')[tabIndex] ?? null)

  assertThat(
    tab.left >= scroller.left - pixelTolerance && tab.right <= scroller.right + pixelTolerance,
    `tab ${tabIndex + 1} is not fully in view`,
  )
}

export const TabsNarrowScrollAffordance = {
  tags: ['visual'],
  render: () => ({
    components: { SCard, STab, STabs },
    setup: () => ({ narrowTabsLabels, activeTab: ref(0) }),
    template: /* html */ `
      <div style="max-width: 375px;">
        <SCard class="s_pa__4">
          <STabs v-model="activeTab" class="stress-narrow-tabs">
            <STab v-for="(label, index) in narrowTabsLabels" :key="label" :tab="index">{{ label }}</STab>
          </STabs>
        </SCard>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const lastTabIndex = narrowTabsLabels.length - 1

    const selectedTab = () =>
      canvasElement.querySelector<HTMLElement>('.stress-narrow-tabs [role="tab"][aria-selected="true"]')

    await waitFor(() => assertScrollButtons(canvasElement, { start: false, end: true }))

    selectedTab()?.focus()
    await userEvent.keyboard('{End}')
    await waitFor(() => {
      assertTabFullyInView(canvasElement, lastTabIndex)
      assertScrollButtons(canvasElement, { start: true, end: false })
    })

    selectedTab()?.focus()
    await userEvent.keyboard('{Home}')
    await waitFor(() => {
      assertTabFullyInView(canvasElement, 0)
      assertScrollButtons(canvasElement, { start: false, end: true })
    })
  },
} satisfies StoryObj

const files = [
  { name: 'Quarterly financial report final version.pdf', meta: '2.3 MB · Modified 2026-11-02 by Bartholomew' },
  { name: 'Team photo.jpg', meta: '4.0 MB · Modified yesterday' },
]

const breadcrumbs = [
  { text: 'Home', href: '#' },
  { text: 'Electronics and accessories', href: '#' },
  { text: 'Audio', href: '#' },
  { text: 'Noise-cancelling headphones', disabled: true },
]

const steps = [
  { step: 1, text: 'Shipping address' },
  { step: 2, text: 'Delivery method' },
  { step: 3, text: 'Payment' },
  { step: 4, text: 'Review and confirm' },
]

// List rows (as <ul>/<li>) with a long title and subtitle, an icon and two text actions; expansion panels with a long header;
// breadcrumbs and a stepper with long labels.
export const ListsAndPanels = {
  tags: ['visual'],
  render: () => ({
    components: {
      SBreadcrumbs,
      SButton,
      SCard,
      SExpansionPanel,
      SExpansionPanelContent,
      SExpansionPanelHeader,
      SExpansionPanels,
      SIcon,
      SList,
      SListItem,
      SListItemAction,
      SListItemContent,
      SListItemIcon,
      SListItemSubtitle,
      SListItemTitle,
      SStepper,
    },
    setup: () => ({ files, breadcrumbs, steps, openPanels: ref([0]), step: ref(2) }),
    template: /* html */ `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <SBreadcrumbs :items="breadcrumbs" />
        <SCard outlined>
          <SList divided tag="ul" class="stress-file-list">
            <SListItem v-for="file in files" :key="file.name" tag="li">
              <SListItemIcon align-center><SIcon icon="mdi-file-document-outline" /></SListItemIcon>
              <SListItemContent>
                <SListItemTitle>{{ file.name }}</SListItemTitle>
                <SListItemSubtitle>{{ file.meta }}</SListItemSubtitle>
              </SListItemContent>
              <SListItemAction align-center>
                <SButton variant="text" color="primary">Rename</SButton>
                <SButton variant="text" color="error">Delete</SButton>
              </SListItemAction>
            </SListItem>
          </SList>
        </SCard>
        <SExpansionPanels v-model="openPanels" class="stress-panels">
          <SExpansionPanel :index="0">
            <SExpansionPanelHeader>What is the return policy for items bought during a sale?</SExpansionPanelHeader>
            <SExpansionPanelContent>
              Sale items can be returned within 30 days. The refund goes to the original payment method.
            </SExpansionPanelContent>
          </SExpansionPanel>
          <SExpansionPanel :index="1">
            <SExpansionPanelHeader>Shipping</SExpansionPanelHeader>
            <SExpansionPanelContent>Orders ship within two working days.</SExpansionPanelContent>
          </SExpansionPanel>
        </SExpansionPanels>
        <SStepper v-model="step" :items="steps" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      assertNoPageOverflow(canvasElement)

      // The file list renders as <ul>/<li>, the breadcrumbs as <ol>/<li>: none of them shows a list marker.
      assertNoListMarkers(canvasElement)

      // The row text keeps a readable width; when the actions do not fit beside it, they move below it.
      for (const content of canvasElement.querySelectorAll('.stress-file-list .s_listItemContent')) {
        assertThat(getRect(content).width >= listContentMinWidth, 'the list text collapses next to its actions')
      }

      // The first crumb starts at the content edge, like the card below it.
      const crumbs = getTextRect(canvasElement.querySelector('.s_breadcrumbs__listItem'))
      const card = getRect(canvasElement.querySelector('.stress-file-list'))

      assertThat(Math.abs(crumbs.left - card.left) <= pixelTolerance, 'the breadcrumbs are indented')

      // The panel content starts at the same x as its header text.
      const header = canvasElement.querySelector('.stress-panels .s_expansionPanelHeader .s_listItemContent')
      const content = canvasElement.querySelector('.stress-panels .s_expansionPanelContent__content')
      const headerText = getTextRect(header)
      const contentText = getTextRect(content)

      assertThat(Math.abs(headerText.left - contentText.left) <= pixelTolerance, 'the panel content is not aligned')
    })
  },
} satisfies StoryObj
