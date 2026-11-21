import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { nextTick, onMounted, ref } from 'vue'
import { expect, waitFor } from 'storybook/test'
import {
  SButton,
  SCard,
  SCardActions,
  SCardText,
  SCardTitle,
  SDialog,
  SIcon,
  SList,
  SListItem,
  SListItemAction,
  SListItemContent,
  SListItemIcon,
  SListItemSubtitle,
  SListItemTitle,
  SMenu,
  SSnackbar,
  SSpacer,
  STooltip,
} from '@/app/index'
import { assertNoListMarkers } from '@/app/storybook/helpers'

// Stress cases for the overlay components. Each story groups several cases so the visual harness stays fast,
// and each `play` function opens the overlays and checks the geometry, so the stories double as interaction tests.
const overlayStress: Meta = {
  title: 'Stress/Overlays',
  parameters: {
    layout: 'fullscreen',
  },
}

export default overlayStress

// Distance (px) every overlay must keep from the viewport edges, matching the library gutter.
const viewportGutter = 8
// A wrapped tooltip is at least two caption lines tall.
const wrappedTooltipMinHeight = 30
// The dialog stories open a dialog that is wider than a phone, so the phone gutter is visible.
const dialogMaxWidth = 420
// Sub-pixel rounding allowed in the geometry checks.
const pixelTolerance = 1

// Each item has a real icon: a dot-shaped icon (mdi-circle-small) reads as a list bullet in the screenshots.
const menuItems = [
  { label: 'Call', icon: 'mdi-phone' },
  { label: 'Edit contact', icon: 'mdi-pencil' },
  { label: 'Delete', icon: 'mdi-delete' },
]

const longTooltipText =
  'Archiving moves the project out of the active list. Collaborators keep read access, and you can restore it from Settings at any time.'

const tallDialogParagraphs = Array.from(
  { length: 24 },
  (_, index) => `Paragraph ${index + 1}. The terms below describe how the service stores and processes your files.`,
)

const overlayComponents = {
  SButton,
  SCard,
  SCardActions,
  SCardText,
  SCardTitle,
  SDialog,
  SIcon,
  SList,
  SListItem,
  SListItemAction,
  SListItemContent,
  SListItemIcon,
  SListItemSubtitle,
  SListItemTitle,
  SMenu,
  SSnackbar,
  SSpacer,
  STooltip,
}

const menuListTemplate = /* html */ `
  <SList dense>
    <SListItem v-for="item in menuItems" :key="item.label" link>
      <SListItemIcon align-center><SIcon :icon="item.icon" /></SListItemIcon>
      <SListItemContent><SListItemTitle>{{ item.label }}</SListItemTitle></SListItemContent>
    </SListItem>
  </SList>
`

const getRect = (element: Element | null) => {
  if (!element) {
    throw new Error('overlay element not found')
  }

  return element.getBoundingClientRect()
}

// Plain throwing checks: they run inside `waitFor` callbacks, which retry until no error is thrown.
const assertThat = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const assertInsideViewport = (element: Element | null) => {
  const rect = getRect(element)
  const minimum = viewportGutter - pixelTolerance

  const isInside =
    rect.left >= minimum &&
    rect.top >= minimum &&
    rect.right <= window.innerWidth - minimum &&
    rect.bottom <= window.innerHeight - minimum

  assertThat(isInside, `overlay ${JSON.stringify(rect)} is not ${viewportGutter}px inside the viewport`)
}

const assertNotOverlapping = (first: Element | null, second: Element | null) => {
  const firstRect = getRect(first)
  const secondRect = getRect(second)

  const isSeparate =
    firstRect.bottom <= secondRect.top + pixelTolerance ||
    firstRect.top >= secondRect.bottom - pixelTolerance ||
    firstRect.right <= secondRect.left + pixelTolerance ||
    firstRect.left >= secondRect.right - pixelTolerance

  assertThat(isSeparate, 'overlay covers its activator')
}

const assertTextNotClipped = (element: Element | null) => {
  if (!element) {
    throw new Error('menu element not found')
  }

  for (const title of element.querySelectorAll('.s_listItemTitle')) {
    assertThat(title.scrollWidth <= title.clientWidth + pixelTolerance, `menu item "${title.textContent}" is clipped`)
  }

  assertThat(element.scrollWidth <= element.clientWidth + pixelTolerance, 'menu content is clipped')
}

// Menus opened from the four viewport corners and from a list row at the right edge (the AI-eval contact list).
export const MenuPlacement = {
  tags: ['visual'],
  render: () => ({
    components: overlayComponents,
    setup() {
      const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
      const cornerMenus = ref(corners.map(() => false))
      const rowMenu = ref(false)

      onMounted(async () => {
        await nextTick()
        cornerMenus.value = corners.map(() => true)
        rowMenu.value = true
      })

      return { corners, cornerMenus, rowMenu, menuItems }
    },
    template: /* html */ `
      <div class="stress-stage" style="position: fixed; inset: 0;">
        <div
          v-for="(corner, index) in corners"
          :key="corner"
          :data-corner="corner"
          style="position: absolute;"
          :style="{
            top: corner.startsWith('top') ? '8px' : 'auto',
            bottom: corner.startsWith('bottom') ? '8px' : 'auto',
            left: corner.endsWith('left') ? '8px' : 'auto',
            right: corner.endsWith('right') ? '8px' : 'auto',
          }"
        >
          <SMenu v-model="cornerMenus[index]" location="bottom">
            <template #activator="{ on, attrs }">
              <SButton v-on="on" v-bind="attrs" :class="'stress-activator--' + corner">{{ corner }}</SButton>
            </template>
            ${menuListTemplate}
          </SMenu>
        </div>
        <SList divided style="position: absolute; top: 35%; left: 0; right: 0;">
          <SListItem>
            <SListItemContent>
              <SListItemTitle>Alice Johnson</SListItemTitle>
              <SListItemSubtitle>+1 555 010 2231</SListItemSubtitle>
            </SListItemContent>
            <SListItemAction align-center>
              <SMenu v-model="rowMenu" location="bottom" close-on-content-click>
                <template #activator="{ on, attrs }">
                  <SButton variant="icon" class="stress-activator--row" aria-label="Actions" v-on="on" v-bind="attrs">
                    <SIcon icon="mdi-dots-vertical" />
                  </SButton>
                </template>
                ${menuListTemplate}
              </SMenu>
            </SListItemAction>
          </SListItem>
        </SList>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument

    await waitFor(() => expect(ownerDocument.querySelectorAll('.s_menu__content')).toHaveLength(5))

    const activatorClasses = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'row']
    const contents = [...ownerDocument.querySelectorAll('.s_menu__content')]

    await waitFor(() => {
      contents.forEach((content, index) => {
        const activator = canvasElement.querySelector(`.stress-activator--${activatorClasses[index]}`)

        assertInsideViewport(content)
        assertNotOverlapping(content, activator)
        assertTextNotClipped(content)
        assertNoListMarkers(content)
      })
    })
  },
} satisfies StoryObj

// A menu inside a scrolling container must follow its activator when the container scrolls.
export const MenuInScrollContainer = {
  render: () => ({
    components: overlayComponents,
    setup() {
      return { menuItems }
    },
    template: /* html */ `
      <div class="stress-scroller" style="height: 240px; overflow: auto; margin: 16px; border: 1px solid currentColor;">
        <div style="height: 160px;"></div>
        <SMenu location="bottom">
          <template #activator="{ on, attrs }">
            <SButton class="stress-activator--scroll" v-on="on" v-bind="attrs">open menu</SButton>
          </template>
          ${menuListTemplate}
        </SMenu>
        <div style="height: 600px;"></div>
      </div>
    `,
  }),
  play: async ({ canvasElement, userEvent }) => {
    const activator = canvasElement.querySelector('.stress-activator--scroll')
    const scroller = canvasElement.querySelector('.stress-scroller')

    if (!activator || !scroller) {
      throw new Error('scroll stress elements not found')
    }

    await userEvent.click(activator)

    const content = await waitFor(async () => {
      const element = canvasElement.ownerDocument.querySelector('.s_menu__content')

      await expect(element).toBeVisible()

      return element
    })

    scroller.scrollTop = 100
    scroller.dispatchEvent(new Event('scroll'))

    await waitFor(async () => {
      await expect(Math.abs(getRect(content).top - getRect(activator).bottom)).toBeLessThanOrEqual(1)
    })
  },
} satisfies StoryObj

// Esc closes a menu and focus goes back to its activator.
export const MenuKeyboard = {
  render: () => ({
    components: overlayComponents,
    setup() {
      return { menuItems }
    },
    template: /* html */ `
      <div style="padding: 16px;">
        <SMenu location="bottom">
          <template #activator="{ on, attrs }">
            <SButton class="stress-activator--keyboard" v-on="on" v-bind="attrs">open menu</SButton>
          </template>
          ${menuListTemplate}
        </SMenu>
      </div>
    `,
  }),
  play: async ({ canvasElement, userEvent }) => {
    const ownerDocument = canvasElement.ownerDocument
    const activator = canvasElement.querySelector<HTMLElement>('.stress-activator--keyboard')

    if (!activator) {
      throw new Error('menu activator not found')
    }

    await userEvent.click(activator)
    await waitFor(() => expect(ownerDocument.querySelector('.s_menu__content')).toBeVisible())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(ownerDocument.querySelector('.s_menu__content')).toBeNull())
    await expect(ownerDocument.activeElement).toBe(activator)
  },
} satisfies StoryObj

// A dialog wider than a phone, with a menu opened inside it: the dialog keeps a gutter from the screen edges
// and the menu sits above the dialog, inside the viewport.
export const DialogWithMenu = {
  tags: ['visual'],
  render: () => ({
    components: overlayComponents,
    setup() {
      return { dialogMaxWidth, menuItems }
    },
    template: /* html */ `
      <div style="padding: 16px;">
        <SDialog :max-width="dialogMaxWidth">
          <template #activator="{ on, attrs }">
            <SButton class="stress-activator--dialog" v-on="on" v-bind="attrs">Delete account</SButton>
          </template>
          <SCard>
            <SCardTitle>Delete account?</SCardTitle>
            <SCardText>This permanently deletes your account and all of its data. You cannot undo this.</SCardText>
            <SCardActions>
              <SMenu location="bottom">
                <template #activator="{ on, attrs }">
                  <SButton variant="text" class="stress-activator--nested" v-on="on" v-bind="attrs">More</SButton>
                </template>
                ${menuListTemplate}
              </SMenu>
              <SSpacer />
              <SButton variant="text">Cancel</SButton>
              <SButton color="error">Delete</SButton>
            </SCardActions>
          </SCard>
        </SDialog>
      </div>
    `,
  }),
  play: async ({ canvasElement, userEvent }) => {
    const ownerDocument = canvasElement.ownerDocument
    const activator = canvasElement.querySelector('.stress-activator--dialog')

    if (!activator) {
      throw new Error('dialog activator not found')
    }

    await userEvent.click(activator)

    const dialog = await waitFor(async () => {
      const element = ownerDocument.querySelector('.s_dialog__content')

      await expect(element).toBeVisible()

      return element
    })

    const nested = ownerDocument.querySelector('.stress-activator--nested')

    if (!nested) {
      throw new Error('nested menu activator not found')
    }

    await userEvent.click(nested)

    const menu = await waitFor(async () => {
      const element = ownerDocument.querySelector('.s_menu__content')

      await expect(element).toBeVisible()

      return element
    })

    await waitFor(async () => {
      assertInsideViewport(dialog)
      assertInsideViewport(menu)

      const menuRect = getRect(menu)

      const topElement = ownerDocument.elementFromPoint(
        menuRect.left + menuRect.width / 2,
        menuRect.top + menuRect.height / 2,
      )

      await expect(menu?.contains(topElement)).toBe(true)
    })
  },
} satisfies StoryObj

// Content taller than the viewport scrolls inside the dialog; the dialog itself stays inside the viewport.
export const DialogTallContent = {
  tags: ['visual'],
  render: () => ({
    components: overlayComponents,
    setup() {
      return { tallDialogParagraphs }
    },
    template: /* html */ `
      <div style="padding: 16px;">
        <SDialog scrollable :max-width="600">
          <template #activator="{ on, attrs }">
            <SButton class="stress-activator--tall" v-on="on" v-bind="attrs">Read the terms</SButton>
          </template>
          <SCard>
            <SCardTitle>Terms of service</SCardTitle>
            <SCardText class="stress-tall-text">
              <p v-for="paragraph in tallDialogParagraphs" :key="paragraph">{{ paragraph }}</p>
            </SCardText>
            <SCardActions>
              <SSpacer />
              <SButton color="primary">Accept</SButton>
            </SCardActions>
          </SCard>
        </SDialog>
      </div>
    `,
  }),
  play: async ({ canvasElement, userEvent }) => {
    const ownerDocument = canvasElement.ownerDocument
    const activator = canvasElement.querySelector('.stress-activator--tall')

    if (!activator) {
      throw new Error('dialog activator not found')
    }

    await userEvent.click(activator)

    const dialog = await waitFor(async () => {
      const element = ownerDocument.querySelector('.s_dialog__content')

      await expect(element).toBeVisible()

      return element
    })

    await waitFor(async () => {
      assertInsideViewport(dialog)

      const text = ownerDocument.querySelector('.stress-tall-text')

      await expect(text?.scrollHeight ?? 0).toBeGreaterThan(text?.clientHeight ?? 0)
    })
  },
} satisfies StoryObj

// Focus moves into an open dialog, Tab stays inside it, Esc closes it and focus returns to the activator.
export const DialogKeyboard = {
  render: () => ({
    components: overlayComponents,
    template: /* html */ `
      <div style="padding: 16px;">
        <SDialog :max-width="400">
          <template #activator="{ on, attrs }">
            <SButton class="stress-activator--focus" v-on="on" v-bind="attrs">Open dialog</SButton>
          </template>
          <SCard>
            <SCardTitle>Rename file</SCardTitle>
            <SCardText>Pick a new name for the file.</SCardText>
            <SCardActions>
              <SSpacer />
              <SButton variant="text" class="stress-dialog-first">Cancel</SButton>
              <SButton color="primary" class="stress-dialog-last">Save</SButton>
            </SCardActions>
          </SCard>
        </SDialog>
      </div>
    `,
  }),
  play: async ({ canvasElement, userEvent }) => {
    const ownerDocument = canvasElement.ownerDocument
    const activator = canvasElement.querySelector<HTMLElement>('.stress-activator--focus')

    if (!activator) {
      throw new Error('dialog activator not found')
    }

    await userEvent.click(activator)

    const dialog = await waitFor(async () => {
      const element = ownerDocument.querySelector('.s_dialog__content')

      await expect(element).toBeVisible()

      return element
    })

    await waitFor(() => expect(dialog?.contains(ownerDocument.activeElement)).toBe(true))

    ownerDocument.querySelector<HTMLElement>('.stress-dialog-last')?.focus()
    await userEvent.tab()
    await expect(ownerDocument.activeElement).toBe(ownerDocument.querySelector('.stress-dialog-first'))

    await userEvent.tab({ shift: true })
    await expect(ownerDocument.activeElement).toBe(ownerDocument.querySelector('.stress-dialog-last'))

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(ownerDocument.querySelector('.s_dialog__content')).toBeNull())
    await expect(ownerDocument.activeElement).toBe(activator)
  },
} satisfies StoryObj

// A long tooltip wraps onto several lines and stays inside the viewport, even next to the right edge.
export const TooltipLongText = {
  tags: ['visual'],
  render: () => ({
    components: overlayComponents,
    setup() {
      return { longTooltipText }
    },
    template: /* html */ `
      <div style="display: flex; justify-content: flex-end; padding: 16px;">
        <STooltip location="bottom">
          <template #activator>
            <SButton class="stress-activator--tooltip">Archive</SButton>
          </template>
          {{ longTooltipText }}
        </STooltip>
      </div>
    `,
  }),
  play: async ({ canvasElement, userEvent }) => {
    const ownerDocument = canvasElement.ownerDocument
    const activator = canvasElement.querySelector('.stress-activator--tooltip')

    if (!activator) {
      throw new Error('tooltip activator not found')
    }

    await userEvent.hover(activator)

    const tooltip = await waitFor(async () => {
      const element = ownerDocument.querySelector('.s_tooltip__content:not(.s_tooltip__content-hidden)')

      await expect(element).toBeVisible()

      return element
    })

    await waitFor(async () => {
      assertInsideViewport(tooltip)
      await expect(getRect(tooltip).height).toBeGreaterThanOrEqual(wrappedTooltipMinHeight)
      await expect(tooltip?.scrollWidth ?? 0).toBeLessThanOrEqual((tooltip?.clientWidth ?? 0) + 1)
    })
  },
} satisfies StoryObj

// Two snackbars at once: a bottom one with an action button that sets no colour (it must be readable on the
// dark snackbar), and a top one with a long multi-line message. Two snackbars at the same location would
// overlap: stacking them needs a queue component (SSnackbarQueue, planned).
export const SnackbarActions = {
  tags: ['visual'],
  render: () => ({
    components: overlayComponents,
    setup() {
      const bottomSnackbar = ref(false)
      const topSnackbar = ref(false)

      onMounted(async () => {
        await nextTick()
        bottomSnackbar.value = true
        topSnackbar.value = true
      })

      return { bottomSnackbar, topSnackbar }
    },
    template: /* html */ `
      <div style="height: 100vh;">
        <SSnackbar v-model="bottomSnackbar">
          File deleted
          <template #action>
            <SButton variant="text" class="stress-snackbar-action">Undo</SButton>
          </template>
        </SSnackbar>
        <SSnackbar v-model="topSnackbar" location="top" multi-line>
          Your changes were saved, but two collaborators edited the same section. Review the conflicts before you publish.
          <template #action>
            <SButton variant="text">Review</SButton>
          </template>
        </SSnackbar>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument

    await waitFor(() => expect(ownerDocument.querySelectorAll('.s_snackbar__wrapper')).toHaveLength(2))

    for (const wrapper of ownerDocument.querySelectorAll('.s_snackbar__wrapper')) {
      assertInsideViewport(wrapper)
    }

    const action = ownerDocument.querySelector('.stress-snackbar-action')
    const wrapper = ownerDocument.querySelector('.s_snackbar__wrapper')

    if (!action || !wrapper) {
      throw new Error('snackbar action not found')
    }

    await expect(getComputedStyle(action).color).toBe(getComputedStyle(wrapper).color)
  },
} satisfies StoryObj
