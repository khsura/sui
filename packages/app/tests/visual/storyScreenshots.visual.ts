import { fileURLToPath } from 'node:url'
import { expect } from '@playwright/test'
import {
  storyRenderFinishedPhase,
  visualFixedTime,
  visualStorybookDir,
  visualViewportHeight,
  visualViewportWidths,
} from './constants'
import {
  getVisualStoryPath,
  readStoryFailures,
  readVisualStories,
  recordStoryFailures,
  serveStoryAssetsOffline,
  visualTest,
  waitForFonts,
  waitForStoryRender,
} from './lib'

const storybookDir = fileURLToPath(new URL(`../../${visualStorybookDir}`, import.meta.url))
const visualStories = readVisualStories(storybookDir)

visualTest('the static Storybook build has stories tagged visual', () => {
  expect(visualStories.length).toBeGreaterThan(0)
})

for (const story of visualStories) {
  for (const width of visualViewportWidths) {
    visualTest(`${story.title} / ${story.name} @ ${width}px`, async ({ page, theme }) => {
      await page.setViewportSize({ width, height: visualViewportHeight })
      await page.clock.setFixedTime(visualFixedTime)
      await serveStoryAssetsOffline(page)
      await recordStoryFailures(page)
      await page.goto(getVisualStoryPath(story.id, theme), { waitUntil: 'networkidle' })

      expect(await waitForStoryRender(page)).toBe(storyRenderFinishedPhase)
      expect(await readStoryFailures(page)).toEqual([])
      await waitForFonts(page)

      await expect(page).toHaveScreenshot(`${story.id}--${width}.png`, { fullPage: true })
    })
  }
}
