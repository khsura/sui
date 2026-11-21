import { expect, type Page } from '@playwright/test'
import {
  resizeObserverLoopMessage,
  resizeScrollBlockedClassName,
  resizeScrollBrowser,
  resizeScrollDistance,
  resizeScrollPageHeight,
  resizeScrollPageStoryId,
  resizeScrollShellStoryId,
  storyRenderFinishedPhase,
  visualViewportHeight,
  visualViewportWidths,
} from './constants'
import {
  getVisualStoryPath,
  readWindowErrors,
  recordWindowErrors,
  resizeViewportGradually,
  serveStoryAssetsOffline,
  showStoryInPlace,
  visualTest,
  waitForStoryRender,
} from './lib'

const [phoneWidth, , desktopWidth] = visualViewportWidths

const isPageScrollBlocked = async (page: Page) =>
  await page.evaluate(
    (className) => document.documentElement.classList.contains(className),
    resizeScrollBlockedClassName,
  )

// The app shell's drawer locked the page scroll while it crossed the md breakpoint and never released it, so after a
// window resize no story in that preview (the responsive grid, say) could scroll.
visualTest(
  'the page still scrolls after resizing the window across breakpoints',
  async ({ page, theme, browserName }) => {
    visualTest.skip(
      browserName !== resizeScrollBrowser,
      `the resize regression runs once per theme, in ${resizeScrollBrowser}`,
    )

    await recordWindowErrors(page)
    await page.setViewportSize({ width: desktopWidth, height: visualViewportHeight })
    await serveStoryAssetsOffline(page)
    await page.goto(getVisualStoryPath(resizeScrollShellStoryId, theme), { waitUntil: 'networkidle' })
    expect(await waitForStoryRender(page)).toBe(storyRenderFinishedPhase)

    await resizeViewportGradually(page, phoneWidth, visualViewportHeight)
    await resizeViewportGradually(page, desktopWidth, visualViewportHeight)

    expect(await isPageScrollBlocked(page)).toBe(false)

    await showStoryInPlace(page, resizeScrollPageStoryId)
    expect(await waitForStoryRender(page)).toBe(storyRenderFinishedPhase)
    await resizeViewportGradually(page, desktopWidth, resizeScrollPageHeight)

    expect(await isPageScrollBlocked(page)).toBe(false)

    await page.mouse.move(desktopWidth / 2, resizeScrollPageHeight / 2)
    await page.mouse.wheel(0, resizeScrollDistance)

    await expect
      .poll(async () => await page.evaluate(() => document.scrollingElement?.scrollTop ?? 0))
      .toBeGreaterThan(0)
    expect((await readWindowErrors(page)).filter((message) => message.includes(resizeObserverLoopMessage))).toEqual([])
  },
)
