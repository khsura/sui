import type { Page } from '@playwright/test'
import { resizeScrollSettleMs, resizeScrollStepDelayMs, resizeScrollSteps } from '../constants'

// Drags the viewport to `width` in small steps, like a user resizing the browser window, then lets it settle.
export const resizeViewportGradually = async (page: Page, width: number, height: number) => {
  const startWidth = page.viewportSize()?.width ?? width

  for (let step = 1; step <= resizeScrollSteps; step++) {
    await page.setViewportSize({
      width: Math.round(startWidth + ((width - startWidth) * step) / resizeScrollSteps),
      height,
    })
    await page.waitForTimeout(resizeScrollStepDelayMs)
  }

  await page.waitForTimeout(resizeScrollSettleMs)
}

// Records every window error (a ResizeObserver loop is reported only as an error event) before any page script runs.
export const recordWindowErrors = async (page: Page) => {
  await page.addInitScript(() => {
    const messages: string[] = []

    Reflect.set(window, '__suiWindowErrors', messages)
    window.addEventListener('error', (event) => messages.push(event.message))
  })
}

export const readWindowErrors = async (page: Page): Promise<string[]> =>
  await page.evaluate(() => {
    const messages: unknown = Reflect.get(window, '__suiWindowErrors')

    return Array.isArray(messages) ? messages.map(String) : []
  })

// Switches the preview to another story in the same document, as the Storybook sidebar does.
export const showStoryInPlace = async (page: Page, storyId: string) => {
  await page.evaluate((id) => {
    const channel: unknown = Reflect.get(window, '__STORYBOOK_ADDONS_CHANNEL__')
    const emit: unknown = typeof channel === 'object' && channel !== null ? Reflect.get(channel, 'emit') : undefined

    if (typeof emit !== 'function') {
      throw new Error('Storybook preview channel not found')
    }

    Reflect.apply(emit, channel, ['setCurrentStory', { storyId: id, viewMode: 'story' }])
  }, storyId)
}
