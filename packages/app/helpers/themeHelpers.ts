import { AppTheme } from '@/app/constants'
import { getWindow } from '@/app/lib'
import type { AppThemeType } from '@/app/types'

/**
 * @deprecated Use `useTheme()` instead. This performs a one-shot, non-reactive
 * read of the OS preference. `useTheme().theme` is reactive and persisted, and
 * `setTheme('auto')` follows the OS live.
 */
export const getBrowserTheme = (): AppThemeType => {
  const window = getWindow()

  return window?.matchMedia?.('(prefers-color-scheme: dark)').matches ? AppTheme.dark : AppTheme.light
}
