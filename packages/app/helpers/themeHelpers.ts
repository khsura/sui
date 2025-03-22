import { AppTheme } from '@khsura/sui/constants'
import { getWindow } from '@khsura/sui/lib'
import type { AppThemeType } from '@khsura/sui/types'

export const getBrowserTheme = (): AppThemeType => {
  const window = getWindow()

  return window?.matchMedia?.('(prefers-color-scheme: dark)').matches ? AppTheme.dark : AppTheme.light
}
