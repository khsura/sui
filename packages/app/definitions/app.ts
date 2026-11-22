import type { ComponentDefaultsOptions } from './componentDefaults'
import { type AppTheme } from '@/app/constants'
import type { AppThemeType, DisplayOptions, DisplayPreset, ThemeConfig, ThemeConfigOptions } from '@/app/types'

/** @deprecated Use the typed `defaults` option instead. Kept as an untyped alias of the per-component layer. */
export type ComponentsOption = {
  [ComponentName: string]: Record<string, unknown>
}

export interface AppStateOptions {
  theme?: AppThemeType
  display?: DisplayOptions
  themes?: {
    [AppTheme.light]?: ThemeConfigOptions
    [AppTheme.dark]?: ThemeConfigOptions
  }
  /** @deprecated Use `defaults` — same per-component layer, typed, plus `global`. `defaults` wins when both set a prop. */
  components?: ComponentsOption
  /** App-wide default props: per component (`SButton: { variant: 'text' }`) and `global` styling props (`global: { size: 'small' }`). */
  defaults?: ComponentDefaultsOptions
}

export interface AppState<T extends string = 'sui'> extends Required<AppStateOptions> {
  readonly name: T
  display: DisplayPreset
  themes: {
    [AppTheme.light]: ThemeConfig
    [AppTheme.dark]: ThemeConfig
  }
}
