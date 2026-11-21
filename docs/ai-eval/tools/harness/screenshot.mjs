// Screenshots every page in ./pages at 375x812 and 1280x800 (viewport only), plus the
// scenarios in ./scenarios.mjs. Requires the Vite dev server (`npx vite`) on BASE_URL.
// Usage: node screenshot.mjs <outDir> [pageId ...]
// Writes <outDir>/<pageId>--<scenario>--<width>.png (JPEG q70 if the PNG exceeds MAX_PNG_BYTES)
// and <outDir>/console.json with runtime errors/warnings per page+width.
import { readdir, writeFile, stat, rm, mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { chromium } from 'playwright'
import { scenarios } from './scenarios.mjs'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5199'

const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 1280, height: 800 },
]

const SETTLE_MS = 800
const MAX_PNG_BYTES = 150 * 1024
const JPEG_QUALITY = 70
const outDir = resolve(process.argv[2] ?? 'screenshots')
const only = process.argv.slice(3)

const visibleTextInputs = (page) =>
  page.locator('input:not([type=checkbox]):not([type=radio]):not([type=hidden]):visible, textarea:visible')

const runStep = (page, step) => {
  if ('wait' in step) return page.waitForTimeout(step.wait)
  if ('click' in step) return page.getByText(step.click, { exact: true }).locator('visible=true').first().click()
  if ('clickContains' in step) return page.getByText(step.clickContains).locator('visible=true').first().click()
  if ('clickIcon' in step) return page.locator(`.${step.clickIcon}:visible`).first().click()
  if ('clickNthInput' in step) return visibleTextInputs(page).nth(step.clickNthInput).click()
  if ('clickRadio' in step) return page.locator('input[type=radio]').nth(step.clickRadio).click({ force: true })
  if ('fill' in step) return visibleTextInputs(page).nth(step.fill[0]).fill(step.fill[1])
  throw new Error(`Unknown step ${JSON.stringify(step)}`)
}

const shoot = async (page, file) => {
  const pngPath = `${file}.png`

  await page.screenshot({ path: pngPath })
  if ((await stat(pngPath)).size > MAX_PNG_BYTES) {
    await rm(pngPath)
    await page.screenshot({ path: `${file}.jpg`, type: 'jpeg', quality: JPEG_QUALITY })
  }
}

const main = async () => {
  await mkdir(join(outDir, 'fullpage'), { recursive: true })
  const pageIds = (await readdir('pages')).filter((id) => !only.length || only.includes(id)).sort()
  const browser = await chromium.launch()
  const consoleLog = {}

  for (const pageId of pageIds) {
    for (const viewport of VIEWPORTS) {
      const shots = { base: [], ...(scenarios[pageId] ?? {}) }

      for (const [scenario, steps] of Object.entries(shots)) {
        const context = await browser.newContext({ viewport })
        const page = await context.newPage()
        const messages = []

        page.on(
          'console',
          (msg) => ['error', 'warning'].includes(msg.type()) && messages.push(`${msg.type()}: ${msg.text()}`),
        )
        page.on('pageerror', (err) => messages.push(`pageerror: ${err.message}`))
        await page.goto(`${BASE_URL}/?page=${pageId}`)
        await page.waitForFunction(() => window.__evalMounted === true)
        await page.waitForTimeout(SETTLE_MS)
        try {
          for (const step of steps) await runStep(page, step)
        } catch (err) {
          messages.push(`step-failed(${scenario}): ${err.message.split('\n')[0]}`)
        }

        await shoot(page, join(outDir, `${pageId}--${scenario}--${viewport.width}`))
        if (scenario === 'base') {
          // Full-page capture for scoring content below the fold; reviewed, not committed.
          await page.screenshot({
            path: join(outDir, 'fullpage', `${pageId}--${viewport.width}.jpg`),
            type: 'jpeg',
            quality: JPEG_QUALITY,
            fullPage: true,
          })
        }

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)

        if (scrollWidth > viewport.width) messages.push(`horizontal-overflow(${scenario}): scrollWidth ${scrollWidth}`)
        consoleLog[`${pageId}@${viewport.width}/${scenario}`] = [...new Set(messages)]
        await context.close()
      }
    }
  }

  await browser.close()
  await writeFile(join(outDir, 'console.json'), `${JSON.stringify(consoleLog, null, 2)}\n`)
}

main()
