import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { userEvent, waitFor } from 'storybook/test'
import {
  SExpansionPanel,
  SExpansionPanelContent,
  SExpansionPanelHeader,
  SExpansionPanels,
  STab,
  STabs,
  SWindow,
  SWindowItem,
  type PropsTabs,
} from '@/app/index'
import { createStoryObj } from '@/app/storybook/helpers'

const tab: Meta<PropsTabs> = {
  title: 'UI Components/Tabs',
  // axe audits every story of this component in CI (keyboard-driven component without a screenshot)
  tags: ['a11y'],
  argTypes: {
    selectedTabColor: {
      control: {
        type: 'color',
      },
    },
  },
  args: {
    outlined: false,
    borderRadius: null,
    dense: false,
    bordered: false,
    shrink: false,
    selectedTabColor: 'primary',
  },
}

export default tab

export const Tab = createStoryObj<PropsTabs>({
  render: (args) => {
    return {
      components: {
        STab,
        STabs,
      },
      setup() {
        const tab1 = ref(1)
        const tab2 = ref(1)

        return {
          tab1,
          tab2,
          args,
        }
      },
      template: /* html */ `
      <div>
        <h3>Tabs without column control</h3>
        <STabs
          v-model="tab1"
          :outlined="args.outlined"
          :rounded="args.rounded"
          :tile="args.tile"
          :dense="args.dense"
          :bordered="args.bordered"
          :selected-tab-color="args.selectedTabColor"
          :shrink="args.shrink"
        >
          <STab :tab="0">Tab1</STab>
          <STab :tab="1">Tab2</STab>
          <STab :tab="2">Tab3</STab>
          <STab :tab="3">Tab4</STab>
          <STab :tab="4" disabled>Tab5</STab>
        </STabs>
        <h3 class="s_mt__5">Tabs with column control</h3>
        <STabs
          v-model="tab2"
          :outlined="args.outlined"
          :rounded="args.rounded"
          :tile="args.tile"
          :dense="args.dense"
          :bordered="args.bordered"
          :selected-targs.ab-color="args.selectedTabColor"
          :shrink="args.shrink"
        >
          <STab :tab="0" cols="4" sm="grow">Tab1</STab>
          <STab :tab="1" cols="4" sm="grow">Tab2</STab>
          <STab :tab="2" cols="4" sm="grow">Tab3</STab>
          <STab :tab="3" cols="6" sm="grow">Tab4</STab>
          <STab :tab="4" cols="6" sm="grow" disabled>Tab5</STab>
        </STabs>
      </div>
      `,
    }
  },
})

const FIXED_WINDOW_HEIGHT = 120
// Allowed difference, in px, between a panel's box and the window box it should fill.
const SIZE_TOLERANCE = 1

const faqSections = [
  {
    id: 'start',
    label: 'Getting started',
    faqs: [
      { question: 'How do I create an account?', answer: 'Open the sign-up page and follow the steps.' },
      { question: 'Is there a free trial?', answer: 'Yes, every plan starts with a 14-day trial.' },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    faqs: [
      { question: 'Which cards do you accept?', answer: 'All major credit and debit cards.' },
      { question: 'Can I get an invoice?', answer: 'Invoices are in the billing settings.' },
      { question: 'How do I cancel?', answer: 'Cancel any time from the billing settings.' },
      { question: 'Do you offer refunds?', answer: 'Within 30 days of a payment, yes.' },
    ],
  },
]

const assertThat = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const getElement = (root: Element, selector: string): HTMLElement => {
  const element = root.querySelector<HTMLElement>(selector)

  if (!element) {
    throw new Error(`${selector} not found`)
  }

  return element
}

// The window has a height, and its active panel is shown inside it with its own (non-zero) height.
const assertActivePanelShown = (windowElement: HTMLElement, panelLabel: string) => {
  const windowBox = windowElement.getBoundingClientRect()
  const activePanel = getElement(windowElement, '.s_windowItem--active')
  const panelBox = activePanel.getBoundingClientRect()

  assertThat(windowBox.height > 0, `${panelLabel}: the window renders at 0 height`)
  assertThat(activePanel.textContent?.includes(panelLabel) ?? false, `${panelLabel}: it is not the active panel`)
  assertThat(Math.abs(panelBox.left - windowBox.left) <= SIZE_TOLERANCE, `${panelLabel}: the panel is not in view`)
  assertThat(Math.abs(panelBox.top - windowBox.top) <= SIZE_TOLERANCE, `${panelLabel}: the panel is not at the top`)
  assertThat(
    Math.abs(panelBox.height - windowBox.height) <= SIZE_TOLERANCE,
    `${panelLabel}: the window (${windowBox.height}px) does not match the panel (${panelBox.height}px)`,
  )
}

/**
 * Tab panels rendered with SWindow bound to the STabs model, as the getting-started skill advises. The first
 * window has no height: it must size itself to the active panel. The second has a fixed height that every panel
 * fills. The play function switches tabs both ways and checks the panels after each slide.
 */
export const TabPanelsInWindow = {
  tags: ['visual'],
  render: () => ({
    components: {
      SExpansionPanel,
      SExpansionPanelContent,
      SExpansionPanelHeader,
      SExpansionPanels,
      STab,
      STabs,
      SWindow,
      SWindowItem,
    },
    setup: () => ({
      activeTab: ref('start'),
      fixedTab: ref('start'),
      sections: faqSections,
      fixedHeight: FIXED_WINDOW_HEIGHT,
    }),
    template: /* html */ `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <STabs v-model="activeTab" class="stress-window-tabs s_mb__4">
            <STab v-for="section in sections" :key="section.id" :tab="section.id">{{ section.label }}</STab>
          </STabs>
          <SWindow v-model="activeTab" class="stress-window-auto" mandatory hide-arrows>
            <SWindowItem v-for="section in sections" :key="section.id" :value="section.id">
              <h3 class="s_mb__2">{{ section.label }}</h3>
              <SExpansionPanels>
                <SExpansionPanel v-for="(faq, index) in section.faqs" :key="faq.question" :index="index">
                  <SExpansionPanelHeader>{{ faq.question }}</SExpansionPanelHeader>
                  <SExpansionPanelContent>{{ faq.answer }}</SExpansionPanelContent>
                </SExpansionPanel>
              </SExpansionPanels>
            </SWindowItem>
          </SWindow>
        </div>
        <div>
          <STabs v-model="fixedTab" class="s_mb__4">
            <STab v-for="section in sections" :key="section.id" :tab="section.id">{{ section.label }}</STab>
          </STabs>
          <SWindow v-model="fixedTab" class="stress-window-fixed" mandatory hide-arrows :style="{ height: fixedHeight + 'px' }">
            <SWindowItem v-for="section in sections" :key="section.id" :value="section.id">
              <h3>{{ section.label }}</h3>
            </SWindowItem>
          </SWindow>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const autoWindow = getElement(canvasElement, '.stress-window-auto')
    const fixedWindow = getElement(canvasElement, '.stress-window-fixed')
    const tabButtons = Array.from(getElement(canvasElement, '.stress-window-tabs').querySelectorAll('button'))
    const [firstSection, secondSection] = faqSections

    assertThat(tabButtons.length === faqSections.length, 'the tab buttons are not rendered')
    await waitFor(() => assertActivePanelShown(autoWindow, firstSection.label))
    await waitFor(() => assertActivePanelShown(fixedWindow, firstSection.label))
    assertThat(
      Math.abs(fixedWindow.getBoundingClientRect().height - FIXED_WINDOW_HEIGHT) <= SIZE_TOLERANCE,
      'the fixed-height window lost its height',
    )

    const firstPanelHeight = autoWindow.getBoundingClientRect().height

    await userEvent.click(tabButtons[1])
    await waitFor(() => assertActivePanelShown(autoWindow, secondSection.label))
    assertThat(
      autoWindow.getBoundingClientRect().height > firstPanelHeight,
      'the window did not grow to the taller panel',
    )

    await userEvent.click(tabButtons[0])
    await waitFor(() => assertActivePanelShown(autoWindow, firstSection.label))
  },
} satisfies StoryObj
