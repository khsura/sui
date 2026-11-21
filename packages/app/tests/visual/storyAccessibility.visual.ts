import { fileURLToPath } from 'node:url'
import { expect } from '@playwright/test'
import {
  a11yAuditBrowser,
  a11yTag,
  storyRenderFinishedPhase,
  visualFixedTime,
  visualStorybookDir,
  visualTag,
  visualViewportHeight,
  visualViewportWidths,
} from './constants'
import {
  findBlockingA11yViolations,
  formatA11yViolations,
  getVisualStoryPath,
  readTaggedStories,
  serveStoryAssetsOffline,
  visualTest,
  waitForFonts,
  waitForStoryRender,
} from './lib'

// axe audit of every story tagged `visual` or `a11y`, in light and dark: serious or critical WCAG A/AA findings fail.
const storybookDir = fileURLToPath(new URL(`../../${visualStorybookDir}`, import.meta.url))
const auditedStories = readTaggedStories(storybookDir, [visualTag, a11yTag])
const [, , desktopWidth] = visualViewportWidths

for (const story of auditedStories) {
  visualTest(`a11y: ${story.title} / ${story.name}`, async ({ page, theme, browserName }) => {
    visualTest.skip(browserName !== a11yAuditBrowser, `axe runs once per theme, in ${a11yAuditBrowser}`)

    await page.setViewportSize({ width: desktopWidth, height: visualViewportHeight })
    await page.clock.setFixedTime(visualFixedTime)
    await serveStoryAssetsOffline(page)
    await page.goto(getVisualStoryPath(story.id, theme), { waitUntil: 'networkidle' })

    expect(await waitForStoryRender(page)).toBe(storyRenderFinishedPhase)
    await waitForFonts(page)

    // Compared as text so a failure prints one readable line per offending element.
    expect(formatA11yViolations(await findBlockingA11yViolations(page))).toBe('')
  })
}
