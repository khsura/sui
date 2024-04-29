import type { AppThemeType } from '@sui/app/types'
import { getWindow } from '@sui/app/lib'
import { AppTheme } from '@sui/app/constants'

export const getBrowserTheme = (): AppThemeType => {
  const window = getWindow()

  return window?.matchMedia('(prefers-color-scheme: dark)').matches ? AppTheme.dark : AppTheme.light
}
