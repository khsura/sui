import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { expect, waitFor } from 'storybook/test'
import {
  SAppBar,
  SAppBarTitle,
  SBottomNavigation,
  SButton,
  SCard,
  SCardActions,
  SCardText,
  SCardTitle,
  SContainer,
  SDialog,
  SIcon,
  SLayout,
  SList,
  SListItem,
  SListItemContent,
  SListItemIcon,
  SListItemTitle,
  SMain,
  SNavigationDrawer,
  SSnackbar,
  SSpacer,
} from '@/app/index'

/**
 * iPhone safe areas (notch / home indicator), simulated. Playwright cannot emulate `env(safe-area-inset-*)`, so these
 * stories set the `--s-safe-area-*` variables SApp reads them into, as an iPhone in portrait would report them, and
 * assert that each component clears them. Without a safe area the variables are 0px and nothing moves.
 */
const safeArea: Meta = {
  title: 'UI Components/Layout/Safe Area',
  parameters: {
    layout: 'fullscreen',
    appDecorator: { main: false },
  },
}

export default safeArea

// an iPhone in portrait: the notch / status bar on top, the home indicator at the bottom, no side insets
const SIMULATED_INSETS = { top: 47, right: 0, bottom: 34, left: 0 }
const BOTTOM_NAVIGATION_HEIGHT = 56
const toPx = (value: number) => `${value}px`
const insetEntries = Object.entries(SIMULATED_INSETS)

// Overlays teleport into SApp's own container, so the variables go on the SApp element, not on the story root.
const useSimulatedSafeArea = () => {
  const storyRoot = useTemplateRef<HTMLElement>('storyRoot')

  onMounted(() => {
    const appElement = storyRoot.value?.closest<HTMLElement>('.s_app')

    insetEntries.forEach(([side, value]) => appElement?.style.setProperty(`--s-safe-area-${side}`, toPx(value)))
  })

  onBeforeUnmount(() => {
    const appElement = storyRoot.value?.closest<HTMLElement>('.s_app')

    insetEntries.forEach(([side]) => appElement?.style.removeProperty(`--s-safe-area-${side}`))
  })
}

const getElement = (root: HTMLElement, selector: string) => {
  const element = root.querySelector<HTMLElement>(selector)

  if (!element) {
    throw new Error(`${selector} is not rendered`)
  }

  return element
}

const navIcons = ['mdi-view-dashboard', 'mdi-folder', 'mdi-account-group', 'mdi-chart-bar', 'mdi-cog']
const navItems = navIcons.map((icon, index) => ({ icon, title: `Navigation item ${index + 1}` }))

const safeAreaComponents = {
  SAppBar,
  SAppBarTitle,
  SBottomNavigation,
  SButton,
  SCard,
  SCardActions,
  SCardText,
  SCardTitle,
  SContainer,
  SDialog,
  SIcon,
  SLayout,
  SList,
  SListItem,
  SListItemContent,
  SListItemIcon,
  SListItemTitle,
  SMain,
  SNavigationDrawer,
  SSnackbar,
  SSpacer,
}

/**
 * The app shell on a notched iPhone: the fixed app bar pads below the notch (and SMain starts below it), the bottom
 * navigation grows above the home indicator, the open mobile drawer clears both, and the snackbar sits above the
 * navigation.
 */
export const SafeAreaShell = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: safeAreaComponents,
      setup: () => {
        useSimulatedSafeArea()

        return {
          currentTab: ref('recent'),
          isDrawerOpen: ref(true),
          isSnackbarOpen: ref(true),
          navItems,
          BOTTOM_NAVIGATION_HEIGHT,
        }
      },
      template: `
        <div ref="storyRoot">
          <SLayout>
            <SAppBar position="fixed">
              <SButton variant="icon" aria-label="Toggle navigation" @click="isDrawerOpen = !isDrawerOpen">
                <SIcon icon="mdi-menu" />
              </SButton>
              <SAppBarTitle>Safe area</SAppBarTitle>
            </SAppBar>
            <SNavigationDrawer v-model="isDrawerOpen" force-mobile persistent>
              <SList>
                <SListItem v-for="item in navItems" :key="item.title" link>
                  <SListItemIcon><SIcon :icon="item.icon" /></SListItemIcon>
                  <SListItemContent><SListItemTitle>{{ item.title }}</SListItemTitle></SListItemContent>
                </SListItem>
              </SList>
            </SNavigationDrawer>
            <SMain>
              <SContainer><p>The first line of content starts below the app bar.</p></SContainer>
            </SMain>
            <SSnackbar v-model="isSnackbarOpen">Saved</SSnackbar>
            <SBottomNavigation v-model="currentTab" :height="BOTTOM_NAVIGATION_HEIGHT">
              <SButton value="recent"><SIcon icon="mdi-history" /><span>Recent</span></SButton>
              <SButton value="favorites"><SIcon icon="mdi-heart" /><span>Favorites</span></SButton>
              <SButton value="nearby"><SIcon icon="mdi-map-marker" /><span>Nearby</span></SButton>
            </SBottomNavigation>
          </SLayout>
        </div>
      `,
    }),
  play: async ({ canvasElement }) => {
    const appBar = getElement(canvasElement, '.s_appBar')
    const bottomNavigation = getElement(canvasElement, '.s_bottomNavigation')
    const drawer = getElement(canvasElement, '.s_navigationDrawer')
    const main = getElement(canvasElement, '.s_main')

    await waitFor(() => expect(getComputedStyle(appBar).paddingTop).toBe(toPx(SIMULATED_INSETS.top)))

    // the fixed app bar: below the notch, and SMain starts below the whole bar
    await expect(getComputedStyle(main).marginTop).toBe(toPx(appBar.getBoundingClientRect().height))

    // the bottom navigation: grows by the home indicator and keeps its items above it
    await expect(getComputedStyle(bottomNavigation).paddingBottom).toBe(toPx(SIMULATED_INSETS.bottom))
    await expect(bottomNavigation.getBoundingClientRect().height).toBe(
      BOTTOM_NAVIGATION_HEIGHT + SIMULATED_INSETS.bottom,
    )

    // the mobile drawer: clears the notch, the home indicator and its own side
    const drawerStyle = getComputedStyle(drawer)

    await expect(drawerStyle.paddingTop).toBe(toPx(SIMULATED_INSETS.top))
    await expect(drawerStyle.paddingBottom).toBe(toPx(SIMULATED_INSETS.bottom))
    await expect(drawerStyle.paddingLeft).toBe(toPx(SIMULATED_INSETS.left))

    // the snackbar: above the bottom navigation, which already includes the home indicator
    const snackbar = await waitFor(() => getElement(canvasElement, '.s_snackbar__wrapper'))

    await expect(getComputedStyle(snackbar).bottom).toBe(toPx(BOTTOM_NAVIGATION_HEIGHT + SIMULATED_INSETS.bottom))
  },
} satisfies StoryObj

/** A fullscreen dialog on a notched iPhone: its content clears the notch and the home indicator on the card colour. */
export const SafeAreaFullscreenDialog = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: safeAreaComponents,
      setup: () => {
        useSimulatedSafeArea()

        return { isDialogOpen: ref(true) }
      },
      template: `
        <div ref="storyRoot">
          <SDialog v-model="isDialogOpen" fullscreen>
            <SCard>
              <SCardTitle>Edit profile</SCardTitle>
              <SCardText>The title stays below the notch and the actions above the home indicator.</SCardText>
              <SCardActions>
                <SSpacer />
                <SButton variant="text" @click="isDialogOpen = false">Cancel</SButton>
                <SButton color="primary" @click="isDialogOpen = false">Save</SButton>
              </SCardActions>
            </SCard>
          </SDialog>
        </div>
      `,
    }),
  play: async ({ canvasElement }) => {
    const dialog = await waitFor(() => getElement(canvasElement, '.s_dialog__content--fullscreen'))

    await waitFor(() => expect(getComputedStyle(dialog).paddingTop).toBe(toPx(SIMULATED_INSETS.top)))

    const dialogStyle = getComputedStyle(dialog)

    await expect(dialogStyle.paddingBottom).toBe(toPx(SIMULATED_INSETS.bottom))
    await expect(dialogStyle.paddingLeft).toBe(toPx(SIMULATED_INSETS.left))
    await expect(dialogStyle.paddingRight).toBe(toPx(SIMULATED_INSETS.right))
  },
} satisfies StoryObj
