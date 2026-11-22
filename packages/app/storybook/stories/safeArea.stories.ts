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
// an iPhone in landscape: the notch / Dynamic Island on one side, so both sides report it, plus the home indicator
const SIMULATED_LANDSCAPE_INSETS = { top: 0, right: 47, bottom: 21, left: 47 }
const BOTTOM_NAVIGATION_HEIGHT = 56
const DRAWER_WIDTH = 256
const toPx = (value: number) => `${value}px`

// Overlays teleport into SApp's own container, so the variables go on the SApp element, not on the story root.
const useSimulatedSafeArea = (insets: Record<string, number> = SIMULATED_INSETS) => {
  const storyRoot = useTemplateRef<HTMLElement>('storyRoot')
  const insetEntries = Object.entries(insets)

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

/**
 * Permanent (desktop-style) drawers on an iPhone in landscape: each pads the side it sits on by that side's inset and
 * widens by it, so its items clear the notch / Dynamic Island, and SMain and the app bar shift by the same amount.
 */
export const SafeAreaLandscapePermanentDrawers = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: safeAreaComponents,
      setup: () => {
        useSimulatedSafeArea(SIMULATED_LANDSCAPE_INSETS)

        return { navItems, DRAWER_WIDTH }
      },
      template: `
        <div ref="storyRoot">
          <SLayout>
            <SAppBar position="fixed"><SAppBarTitle>Landscape</SAppBarTitle></SAppBar>
            <SNavigationDrawer permanent :width="DRAWER_WIDTH">
              <SList>
                <SListItem v-for="item in navItems" :key="item.title" link>
                  <SListItemIcon><SIcon :icon="item.icon" /></SListItemIcon>
                  <SListItemContent><SListItemTitle>{{ item.title }}</SListItemTitle></SListItemContent>
                </SListItem>
              </SList>
            </SNavigationDrawer>
            <SNavigationDrawer permanent location="right" :width="DRAWER_WIDTH">
              <SList>
                <SListItem link><SListItemContent><SListItemTitle>Details</SListItemTitle></SListItemContent></SListItem>
              </SList>
            </SNavigationDrawer>
            <SMain>
              <SContainer><p>The content sits between both drawers, clear of the side insets.</p></SContainer>
            </SMain>
          </SLayout>
        </div>
      `,
    }),
  play: async ({ canvasElement }) => {
    const firstDrawer = await waitFor(() => getElement(canvasElement, '.s_navigationDrawer'))

    // below the desktop breakpoint a permanent drawer is a mobile one (covered by the shell story above)
    if (firstDrawer.classList.contains('s_navigationDrawer--isMobile')) {
      return
    }

    const leftDrawer = getElement(canvasElement, '.s_navigationDrawer--permanent:not(.s_navigationDrawer--right)')
    const rightDrawer = getElement(canvasElement, '.s_navigationDrawer--permanent.s_navigationDrawer--right')
    const main = getElement(canvasElement, '.s_main')
    const appBar = getElement(canvasElement, '.s_appBar')

    await waitFor(() => expect(getComputedStyle(leftDrawer).paddingLeft).toBe(toPx(SIMULATED_LANDSCAPE_INSETS.left)))

    // each drawer pads only the side it sits on and widens by it, so its items keep their usual width
    await expect(getComputedStyle(leftDrawer).paddingRight).toBe('0px')
    await expect(getComputedStyle(rightDrawer).paddingRight).toBe(toPx(SIMULATED_LANDSCAPE_INSETS.right))
    await expect(getComputedStyle(rightDrawer).paddingLeft).toBe('0px')
    await expect(leftDrawer.getBoundingClientRect().width).toBe(DRAWER_WIDTH + SIMULATED_LANDSCAPE_INSETS.left)
    await expect(rightDrawer.getBoundingClientRect().width).toBe(DRAWER_WIDTH + SIMULATED_LANDSCAPE_INSETS.right)

    // SMain shifts by each drawer including its inset, so no content is hidden under a drawer
    const mainStyle = getComputedStyle(main)

    await expect(mainStyle.marginLeft).toBe(toPx(DRAWER_WIDTH + SIMULATED_LANDSCAPE_INSETS.left))
    await expect(mainStyle.marginRight).toBe(toPx(DRAWER_WIDTH + SIMULATED_LANDSCAPE_INSETS.right))

    // the fixed app bar beside the drawers shifts the same way and doesn't pad the insets a second time
    const appBarStyle = getComputedStyle(appBar)

    await expect(appBarStyle.marginLeft).toBe(toPx(DRAWER_WIDTH + SIMULATED_LANDSCAPE_INSETS.left))
    await expect(appBarStyle.paddingLeft).toBe('0px')
    await expect(appBarStyle.paddingRight).toBe('0px')
  },
} satisfies StoryObj
