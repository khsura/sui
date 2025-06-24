import { type AppTheme } from '@khsura/sui/constants'
import { type DisplayOptions, type DisplayPreset } from './display'

interface AppColors {
  appBar: string
  title: string
  text: string
  textErrorHover: string
  secondaryText: string
  background: string
  button: string
  card: string
  switch: string
  border: string
  disabled: string
  inputPlaceholderShown: string
  snackbar: string
  [index: string]: string
}

interface PresetColors {
  primary: string
  secondary: string
  success: string
  info: string
  warning: string
  important: string
  error: string
}

interface ThemeConfig {
  appColors: AppColors
  presetColors: PresetColors & Record<string, string>
}

interface ThemeConfigOptions {
  appColors?: Partial<AppColors>
  presetColors?: Partial<PresetColors> & Record<string, string>
}

export type AppThemeType = 'light' | 'dark'

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
