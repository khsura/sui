import { errors, type Page } from '@playwright/test'
import {
  storybookChannelGlobal,
  storyFailureEvents,
  storyFailureMaxLength,
  storyFailuresGlobal,
  storyRenderTerminalPhases,
  visualStoryRenderPollingMs,
  visualStoryRenderTimeoutMs,
} from '../constants'

// Runs in the page: the phase of Storybook's current render, or `false` while it is not one of `terminalPhases`
// (pass `null` to read any phase). Self-contained, because Playwright serialises it into the page.
const readRenderPhase = (terminalPhases: string[] | null): unknown => {
  const readProperty = (target: unknown, key: string): unknown =>
    typeof target === 'object' && target !== null ? Reflect.get(target, key) : undefined

  const phase = readProperty(readProperty(readProperty(window, '__STORYBOOK_PREVIEW__'), 'currentRender'), 'phase')

  return terminalPhases === null || terminalPhases.includes(String(phase)) ? phase : false
}

// Collects the story's failure events from Storybook's preview channel. Call before `page.goto`: the init script
// catches the channel as the preview assigns it to `window`, before the story renders.
export const recordStoryFailures = async (page: Page) => {
  await page.addInitScript(
    ({ channelGlobal, failuresGlobal, failureEvents, maxLength }) => {
      const failures: string[] = []
      let channel: unknown

      Reflect.set(window, failuresGlobal, failures)
      Object.defineProperty(window, channelGlobal, {
        configurable: true,
        get: () => channel,
        set: (value: unknown) => {
          channel = value
          const subscribe = typeof value === 'object' && value !== null ? Reflect.get(value, 'on') : undefined

          if (typeof subscribe !== 'function') {
            return
          }

          for (const eventName of failureEvents) {
            subscribe.call(value, eventName, (payload: unknown) => {
              failures.push(`${eventName}: ${JSON.stringify(payload)?.slice(0, maxLength)}`)
            })
          }
        },
      })
    },
    {
      channelGlobal: storybookChannelGlobal,
      failuresGlobal: storyFailuresGlobal,
      failureEvents: storyFailureEvents,
      maxLength: storyFailureMaxLength,
    },
  )
}

// The failures recordStoryFailures collected, such as an exception thrown by the `play` function.
export const readStoryFailures = async (page: Page): Promise<unknown> =>
  await page.evaluate((failuresGlobal) => Reflect.get(window, failuresGlobal), storyFailuresGlobal)

// Resolves with the phase that ended the story render (play function included), read from Storybook's preview global.
// On a timeout the error names the phase the render was stuck in.
export const waitForStoryRender = async (page: Page): Promise<unknown> => {
  try {
    const phaseHandle = await page.waitForFunction(readRenderPhase, storyRenderTerminalPhases, {
      timeout: visualStoryRenderTimeoutMs,
      // Poll on a timer, not on requestAnimationFrame: WebKit can stop running rAF callbacks after a play function
      // opens an overlay, so the default rAF polling never saw the finished phase.
      polling: visualStoryRenderPollingMs,
    })

    return await phaseHandle.jsonValue()
  } catch (error) {
    if (!(error instanceof errors.TimeoutError)) {
      throw error
    }

    const lastPhase = await page.evaluate(readRenderPhase, null)

    throw new Error(
      `The story render did not finish within ${visualStoryRenderTimeoutMs}ms; it was still in phase "${String(lastPhase)}".`,
    )
  }
}

export const waitForFonts = async (page: Page) => {
  await page.evaluate(async () => {
    await document.fonts.ready
  })
}
