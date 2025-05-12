import type { PropsActivator, PropsBorder } from './core'

export type PropsSnackbar = PropsActivator &
  PropsBorder & {
    multiLine?: boolean | null
    timeout?: number | null
    location?: 'bottom' | 'top' | null
  }
