import { AppTheme } from '@/app/constants'
import { getWindow } from '@/app/lib'
import type { AppThemeType } from '@/app/types'

export const getBrowserTheme = (): AppThemeType => {
  const window = getWindow()

  return window?.matchMedia?.('(prefers-color-scheme: dark)').matches ? AppTheme.dark : AppTheme.light
}
