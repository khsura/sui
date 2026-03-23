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
        textErrorHover: '#b76d48',
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
        secondary: '#ff5533',
        success: '#4caf50',
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
        title: '#fefefe',
        textErrorHover: '#b76d48',
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
        success: '#4caf50',
        info: '#134ff3',
        warning: '#ffeb99',
        important: '#fff0f0',
        error: '#df0101',
      },
    },
  },
  components: {},
} satisfies Omit<AppState, 'name'>
