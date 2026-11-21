interface AppColors {
  appBar: string
  title: string
  text: string
  textErrorHover: string
  // Error messages under form inputs; must reach 4.5:1 on `background` and `card`.
  textError: string
  // Keyboard focus ring; must reach 3:1 on `background` and `card`.
  focusRing: string
  secondaryText: string
  anchor: string
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

export interface ThemeConfig {
  appColors: AppColors
  presetColors: PresetColors & Record<string, string>
}

export interface ThemeConfigOptions {
  appColors?: Partial<AppColors>
  presetColors?: Partial<PresetColors> & Record<string, string>
}

export type AppThemeType = 'light' | 'dark'
