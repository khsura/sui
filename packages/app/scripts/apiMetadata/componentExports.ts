import fs from 'node:fs'
import path from 'node:path'
import {
  BARREL_FILE,
  COMPONENTS_DIR,
  CORE_FAMILY,
  DEFAULT_VUE_EXPORT_PATTERN,
  STAR_EXPORT_PATTERN,
  TS_EXTENSION,
} from './constants'
import type { ComponentExport } from './types'

const toPosix = (filePath: string) => filePath.split(path.sep).join('/')

// `export * from './x'` points at either `x.ts` or `x/index.ts`.
const resolveStarExport = (fromDir: string, specifier: string) => {
  const target = path.resolve(fromDir, specifier)
  const asFile = `${target}${TS_EXTENSION}`

  return fs.existsSync(asFile) ? asFile : path.join(target, BARREL_FILE)
}

const toFamily = (componentsDir: string, vueFile: string) => {
  const [topFolder] = path.relative(componentsDir, path.dirname(vueFile)).split(path.sep)

  return topFolder || CORE_FAMILY
}

const collectExports = (barrelFile: string, appRoot: string, componentsDir: string): ComponentExport[] => {
  const barrelDir = path.dirname(barrelFile)
  const source = fs.readFileSync(barrelFile, 'utf8')

  const ownExports = [...source.matchAll(DEFAULT_VUE_EXPORT_PATTERN)].map(([, name, specifier]) => {
    const vueFile = path.resolve(barrelDir, specifier)

    return { name, file: toPosix(path.relative(appRoot, vueFile)), family: toFamily(componentsDir, vueFile) }
  })

  const nestedExports = [...source.matchAll(STAR_EXPORT_PATTERN)].flatMap(([, specifier]) =>
    collectExports(resolveStarExport(barrelDir, specifier), appRoot, componentsDir),
  )

  return [...ownExports, ...nestedExports]
}

/** Every `S*` component reachable from `components/index.ts`, sorted by name. */
export const findPublicComponents = (appRoot: string): ComponentExport[] => {
  const componentsDir = path.join(appRoot, COMPONENTS_DIR)

  return collectExports(path.join(componentsDir, BARREL_FILE), appRoot, componentsDir).sort((left, right) =>
    left.name < right.name ? -1 : 1,
  )
}
