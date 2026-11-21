import type { Page } from '@playwright/test'
import { storyRenderTerminalPhases, visualStoryRenderPollingMs, visualStoryRenderTimeoutMs } from '../constants'

// Resolves with the phase that ended the story render (play function included), read from Storybook's preview global.
export const waitForStoryRender = async (page: Page): Promise<unknown> => {
  const phaseHandle = await page.waitForFunction(
    (terminalPhases) => {
      const readProperty = (target: unknown, key: string): unknown =>
        typeof target === 'object' && target !== null ? Reflect.get(target, key) : undefined

      const phase = readProperty(readProperty(readProperty(window, '__STORYBOOK_PREVIEW__'), 'currentRender'), 'phase')

      return terminalPhases.includes(String(phase)) ? phase : false
    },
    storyRenderTerminalPhases,
    // Poll on a timer, not on requestAnimationFrame: WebKit can stop running rAF callbacks after a play function
    // opens an overlay, so the default rAF polling never saw the finished phase.
    { timeout: visualStoryRenderTimeoutMs, polling: visualStoryRenderPollingMs },
  )

  return await phaseHandle.jsonValue()
}

export const waitForFonts = async (page: Page) => {
  await page.evaluate(async () => {
    await document.fonts.ready
  })
}
