import { createRequire } from 'node:module'
import path from 'node:path'
import type { Page } from '@playwright/test'
import { mdiFontCdnPathPattern, mdiFontPackage, visualServerUrl } from '../constants'

const mdiFontDir = path.dirname(createRequire(import.meta.url).resolve(`${mdiFontPackage}/package.json`))

// Keeps screenshots independent of the network: same-origin requests go to the static Storybook server,
// the icon font comes from node_modules, and any other off-site request is aborted.
export const serveStoryAssetsOffline = async (page: Page) => {
  const { origin } = new URL(visualServerUrl)

  await page.route('**/*', async (route) => {
    const requestUrl = new URL(route.request().url())

    if (requestUrl.origin === origin) {
      await route.continue()

      return
    }

    const mdiFontFile = mdiFontCdnPathPattern.exec(requestUrl.pathname)?.[1]

    if (mdiFontFile) {
      await route.fulfill({ path: path.join(mdiFontDir, mdiFontFile) })

      return
    }

    await route.abort()
  })
}
