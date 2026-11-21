import type { SuiApi } from '@khsura/shared/types'
import type { API_SOURCE_BUNDLED, API_SOURCE_PROJECT } from '../constants'

export type SuiApiSourceKind = typeof API_SOURCE_PROJECT | typeof API_SOURCE_BUNDLED

export interface ResolvedSuiApi {
  api: SuiApi
  source: SuiApiSourceKind
  path: string
  /** Why a project file was found but not used, when the bundled copy is served instead. */
  warning?: string
}

export interface ResolveSuiApiOptions {
  env?: NodeJS.ProcessEnv
  cwd?: string
  bundledPath?: string
}

export type LoadSuiApi = () => ResolvedSuiApi
