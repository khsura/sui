import { type AppTheme } from '@/app/constants'
import type {
  AppThemeType,
  DisplayOptions,
  DisplayPreset,
  ThemeConfig,
  ThemeConfigOptions,
  ThemePreference,
} from '@/app/types'

export type ComponentsOption = {
  [ComponentName: string]: Record<string, unknown>
}

export interface AppStateOptions {
  /** The user's color-mode preference. Defaults to `'auto'` (follow OS). */
  theme?: ThemePreference
  display?: DisplayOptions
  themes?: {
    [AppTheme.light]?: ThemeConfigOptions
    [AppTheme.dark]?: ThemeConfigOptions
  }
  components?: ComponentsOption
}

export interface AppState<T extends string = 'sui'> extends Required<Omit<AppStateOptions, 'theme'>> {
  readonly name: T
  /** Resolved theme actually applied. Never `'auto'`. Consumed by colorService. */
  theme: AppThemeType
  /** The user's persisted preference. Mirrors useColorMode's `store`. */
  themePreference: ThemePreference
  display: DisplayPreset
  themes: {
    [AppTheme.light]: ThemeConfig
    [AppTheme.dark]: ThemeConfig
  }
}
