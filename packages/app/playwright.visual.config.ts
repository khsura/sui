import { defineConfig } from '@playwright/test'
import {
  visualBrowsers,
  visualMaxDiffPixelRatio,
  visualPixelThreshold,
  visualServerPort,
  visualServerTimeoutMs,
  visualStorybookDir,
  visualTestTimeoutMs,
  visualThemes,
  visualViewportHeight,
  visualViewportWidths,
} from './tests/visual/constants'
import type { VisualOptions } from './tests/visual/types'

const isCi = Boolean(process.env.CI)
const [, , desktopWidth] = visualViewportWidths

// Visual regression harness: screenshots every story tagged `visual` in the static Storybook build.
// Run it through `yarn test:visual` so the browsers match the CI container (docs/visual-testing.md).
export default defineConfig<VisualOptions>({
  testDir: './tests/visual',
  testMatch: '**/*.visual.ts',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  outputDir: './.visual/results',
  timeout: visualTestTimeoutMs,
  fullyParallel: true,
  forbidOnly: isCi,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: './.visual/report', open: 'never' }]],
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      threshold: visualPixelThreshold,
      maxDiffPixelRatio: visualMaxDiffPixelRatio,
      stylePath: './tests/visual/screenshot.css',
    },
  },
  use: {
    baseURL: `http://127.0.0.1:${visualServerPort}`,
    viewport: { width: desktopWidth, height: visualViewportHeight },
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'UTC',
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure',
  },
  projects: visualBrowsers.flatMap((browserName) =>
    visualThemes.map((theme) => ({
      name: `${browserName}-${theme}`,
      use: { browserName, theme, colorScheme: theme },
    })),
  ),
  webServer: {
    command: `yarn http-server ${visualStorybookDir} --port ${visualServerPort} --silent`,
    url: `http://127.0.0.1:${visualServerPort}/index.json`,
    reuseExistingServer: false,
    timeout: visualServerTimeoutMs,
  },
})
