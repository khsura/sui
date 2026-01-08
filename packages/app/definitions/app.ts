import { type AppTheme } from '@/app/constants'
import type { AppThemeType, DisplayOptions, DisplayPreset, ThemeConfig, ThemeConfigOptions } from '@/app/types'

export interface AppStateOptions {
  theme?: AppThemeType
  display?: DisplayOptions
  themes?: {
    [AppTheme.light]?: ThemeConfigOptions
    [AppTheme.dark]?: ThemeConfigOptions
  }
}

export interface AppState<T extends string = 'sui'> extends Required<AppStateOptions> {
  readonly name: T
  display: DisplayPreset
  themes: {
    [AppTheme.light]: ThemeConfig
    [AppTheme.dark]: ThemeConfig
  }
}
