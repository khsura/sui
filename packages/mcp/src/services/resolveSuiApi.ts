import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { suiApiSchema } from '@khsura/shared/schemas'
import type { SuiApi } from '@khsura/shared/types'
import type { ResolvedSuiApi, ResolveSuiApiOptions } from '../types'
import { bundledSuiApiPath } from '../configs'
import {
  API_SOURCE_BUNDLED,
  API_SOURCE_PROJECT,
  JSON_ENCODING,
  PROJECT_ROOT_ENV_NAME,
  SUI_API_PROJECT_SEGMENTS,
} from '../constants'

const readSuiApi = (path: string): SuiApi => suiApiSchema.parse(JSON.parse(readFileSync(path, JSON_ENCODING)))

/** Walks up from `startDir` to the filesystem root, returning the nearest project sui-api.json. */
const findProjectSuiApi = (startDir: string): string | undefined => {
  let currentDir = resolve(startDir)

  while (true) {
    const candidatePath = join(currentDir, ...SUI_API_PROJECT_SEGMENTS)

    if (existsSync(candidatePath)) {
      return candidatePath
    }

    const parentDir = dirname(currentDir)

    if (parentDir === currentDir) {
      return undefined
    }

    currentDir = parentDir
  }
}

const loadBundled = (bundledPath: string, warning?: string): ResolvedSuiApi => {
  if (!existsSync(bundledPath)) {
    throw new Error(
      `No @khsura/sui API found: no project install has sui-api.json and the bundled copy is missing at ${bundledPath}.${warning ? ` ${warning}` : ''}`,
    )
  }

  return { api: readSuiApi(bundledPath), source: API_SOURCE_BUNDLED, path: bundledPath, warning }
}

/**
 * Resolves sui-api.json: the project's installed `@khsura/sui` (walking up from
 * `SUI_PROJECT_ROOT`, else the cwd), falling back to the copy bundled with sui-mcp.
 */
export const resolveSuiApi = ({
  env = process.env,
  cwd = process.cwd(),
  bundledPath = bundledSuiApiPath,
}: ResolveSuiApiOptions = {}): ResolvedSuiApi => {
  const projectRootOverride = env[PROJECT_ROOT_ENV_NAME]?.trim()
  const startDir = projectRootOverride?.length ? projectRootOverride : cwd
  const projectPath = findProjectSuiApi(startDir)

  if (!projectPath) {
    return loadBundled(bundledPath)
  }

  try {
    return { api: readSuiApi(projectPath), source: API_SOURCE_PROJECT, path: projectPath }
  } catch (error) {
    return loadBundled(
      bundledPath,
      `${projectPath} could not be read as sui-api.json (${error instanceof Error ? error.message : String(error)}).`,
    )
  }
}
