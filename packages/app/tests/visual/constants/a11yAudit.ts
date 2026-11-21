// Stories carrying this tag get an axe audit without a screenshot. Every `visual` story is audited too.
export const a11yTag = 'a11y'

// axe impact levels that fail the audit; `minor` and `moderate` findings are reported by the Storybook panel only.
export const a11yBlockingImpacts = ['serious', 'critical']

// WCAG 2.2 level A and AA rules (axe tags). Best-practice rules are left to the Storybook a11y panel.
export const a11yAxeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

// The audit is browser-independent, so it runs once per theme, in Chromium at the desktop width.
export const a11yAuditBrowser = 'chromium'
