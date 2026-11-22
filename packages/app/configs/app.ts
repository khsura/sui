import { thresholds, scrollBarWidth } from './core'
import { AppTheme } from '@/app/constants'
import { type AppState } from '@/app/definitions'

export const defaultAppConfig = {
  theme: AppTheme.light,
  display: {
    thresholds,
    scrollBarWidth,
  },
  themes: {
    [AppTheme.light]: {
      appColors: {
        appBar: '#ffffff',
        title: '#1a2b49',
        text: '#333333',
        anchor: '#000000',
        textErrorHover: '#b76d48',
        textError: '#df0101',
        focusRing: '#134ff3',
        secondaryText: '#6d6d6d',
        background: '#f7f7f7',
        button: '#e3e3e3',
        switch: '#ffffff',
        card: '#ffffff',
        border: '#adadad',
        disabled: '#c5c5c5',
        inputPlaceholderShown: '#f5f5f5',
        snackbar: '#424242',
      },
      presetColors: {
        primary: '#0071eb',
        secondary: '#cc4125',
        success: '#2e7d32',
        info: '#134ff3',
        warning: '#ffeb99',
        important: '#fff0f0',
        error: '#df0101',
      },
    },
    [AppTheme.dark]: {
      appColors: {
        appBar: '#222222',
        text: '#fdfdfd',
        anchor: '#ffffff',
        title: '#fefefe',
        textErrorHover: '#b76d48',
        textError: '#ff8a80',
        focusRing: '#8ab4f8',
        secondaryText: '#cccccc',
        background: '#333333',
        button: '#181818',
        switch: '#222222',
        card: '#222222',
        border: '#717171',
        disabled: '#717171',
        inputPlaceholderShown: '#424242',
        snackbar: '#424242',
      },
      presetColors: {
        primary: '#0071eb',
        secondary: '#686868',
        success: '#2e7d32',
        info: '#134ff3',
        warning: '#ffeb99',
        important: '#fff0f0',
        error: '#df0101',
      },
    },
  },
  components: {},
  defaults: {},
} satisfies Omit<AppState, 'name'>
