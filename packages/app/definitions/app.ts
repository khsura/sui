import { type AppTheme } from '@/app/constants'
import type { AppThemeType, DisplayOptions, DisplayPreset, ThemeConfig, ThemeConfigOptions } from '@/app/types'

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
  components?: ComponentsOption
}

export interface AppState<T extends string = 'sui'> extends Required<AppStateOptions> {
  readonly name: T
  display: DisplayPreset
  themes: {
    [AppTheme.light]: ThemeConfig
    [AppTheme.dark]: ThemeConfig
  }
}
