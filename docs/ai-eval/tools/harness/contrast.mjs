// Lists visible text whose contrast against its effective background is below MIN_RATIO,
// for every page in ./pages (base state, plus the scenarios in ./scenarios.mjs), at 1280px.
// Usage: node contrast.mjs   (Vite dev server must be running on BASE_URL)
import { readdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { scenarios } from './scenarios.mjs'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5199'
const MIN_RATIO = 3
const SETTLE_MS = 800

const scan = (minRatio) => {
  const parse = (value) => (value.match(/[\d.]+/g) ?? []).map(Number)

  const luminance = ([r, g, b]) => {
    const channel = (v) => {
      const s = v / 255

      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    }

    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
  }

  const backgroundOf = (el) => {
    for (let node = el; node; node = node.parentElement) {
      const rgba = parse(getComputedStyle(node).backgroundColor)

      if (rgba.length === 3 || (rgba.length === 4 && rgba[3] > 0.5)) return rgba.slice(0, 3)
    }

    return [255, 255, 255]
  }

  const findings = []

  for (const el of document.querySelectorAll('body *')) {
    const ownText = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim()

    const rect = el.getBoundingClientRect()

    if (!ownText || rect.width === 0 || rect.height === 0 || getComputedStyle(el).visibility === 'hidden') continue
    const style = getComputedStyle(el)

    if (Number(style.opacity) < 0.5 || el.closest('[disabled], .s_button--disabled')) continue
    const fg = luminance(parse(style.color).slice(0, 3))
    const bg = luminance(backgroundOf(el))
    const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05)

    if (ratio < minRatio)
      findings.push(`${ownText.slice(0, 30)} — ${style.color} on ${backgroundOf(el).join(',')} = ${ratio.toFixed(2)}`)
  }

  return [...new Set(findings)]
}

const runStep = (page, step) => {
  if ('wait' in step) return page.waitForTimeout(step.wait)
  if ('click' in step) return page.getByText(step.click, { exact: true }).locator('visible=true').first().click()
  if ('clickContains' in step) return page.getByText(step.clickContains).locator('visible=true').first().click()
  if ('clickIcon' in step) return page.locator(`.${step.clickIcon}:visible`).first().click()

  return undefined
}

const main = async () => {
  const browser = await chromium.launch()

  for (const pageId of (await readdir('pages')).sort()) {
    for (const [scenario, steps] of Object.entries({ base: [], ...(scenarios[pageId] ?? {}) })) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

      await page.goto(`${BASE_URL}/?page=${pageId}`)
      await page.waitForFunction(() => window.__evalMounted === true)
      await page.waitForTimeout(SETTLE_MS)
      try {
        for (const step of steps) await runStep(page, step)
      } catch {
        // scenario steps that need typing are skipped here; screenshot.mjs covers them
      }

      const findings = await page.evaluate(scan, MIN_RATIO)

      if (findings.length) process.stdout.write(`${pageId}/${scenario}\n  ${findings.join('\n  ')}\n`)
      await page.close()
    }
  }

  await browser.close()
}

main()
