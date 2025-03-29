import { AppTheme } from '~/constants'
import { getWindow } from '~/lib'
import type { AppThemeType } from '~/types'

export const getBrowserTheme = (): AppThemeType => {
  const window = getWindow()

  return window?.matchMedia?.('(prefers-color-scheme: dark)').matches ? AppTheme.dark : AppTheme.light
}
