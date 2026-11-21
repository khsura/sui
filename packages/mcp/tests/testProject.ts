import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const latestFixturePath = fileURLToPath(new URL('./fixtures/suiApiLatest.json', import.meta.url))
export const olderFixturePath = fileURLToPath(new URL('./fixtures/suiApiOlder.json', import.meta.url))

const PROJECT_API_SEGMENTS = ['node_modules', '@khsura', 'sui', 'dist']

export const makeTempDir = (): string => mkdtempSync(join(tmpdir(), 'sui-mcp-'))

/** Creates a fake project whose node_modules/@khsura/sui/dist/sui-api.json is `fixturePath` (or raw `contents`). */
export const makeProject = (
  source: { fixturePath: string } | { contents: string },
): { root: string; apiPath: string } => {
  const root = makeTempDir()
  const distDir = join(root, ...PROJECT_API_SEGMENTS)
  const apiPath = join(distDir, 'sui-api.json')

  mkdirSync(distDir, { recursive: true })
  if ('fixturePath' in source) {
    copyFileSync(source.fixturePath, apiPath)
  } else {
    writeFileSync(apiPath, source.contents)
  }

  return { root, apiPath }
}
