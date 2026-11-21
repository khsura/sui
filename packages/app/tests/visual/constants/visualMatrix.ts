// Stories carrying this tag are screenshotted; every other story is skipped.
export const visualTag = 'visual'

// Phone, tablet and desktop widths: every visual story is captured at each one.
export const visualViewportWidths = [375, 768, 1280] as const
export const visualViewportHeight = 800

export const visualThemes = ['light', 'dark'] as const
export const visualBrowsers = ['chromium', 'webkit'] as const

// Static Storybook build that the harness serves and screenshots.
export const visualStorybookDir = 'storybook-static'
export const visualServerPort = 6007
export const visualServerTimeoutMs = 60_000

// `Date` is frozen at this instant in the page, so date-dependent stories render the same every day.
export const visualFixedTime = '2026-01-01T09:00:00.000Z'

// Story render (including its play function) must finish within this time.
export const visualStoryRenderTimeoutMs = 15_000

// Storybook's `__STORYBOOK_PREVIEW__.currentRender.phase` values that end a render.
export const storyRenderFinishedPhase = 'finished'
export const storyRenderTerminalPhases = [storyRenderFinishedPhase, 'errored', 'aborted']
export const visualTestTimeoutMs = 60_000

// Per-pixel colour tolerance (0..1, absorbs antialiasing) and the share of pixels allowed to differ.
export const visualPixelThreshold = 0.2
export const visualMaxDiffPixelRatio = 0.002
