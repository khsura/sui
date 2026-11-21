import { test } from '@playwright/test'
import type { VisualOptions } from '../types'

// Each Playwright project sets `theme`; the test opens the story with that SUI theme global.
export const visualTest = test.extend<VisualOptions>({
  theme: ['light', { option: true }],
})
