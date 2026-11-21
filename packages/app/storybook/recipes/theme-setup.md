---
title: Theme and dark mode
whenToUse: Setting brand colors per theme with createSUI and letting users switch between light, dark and the OS setting.
components: SSwitch, SButton, SCard, SCardTitle, SCardText, SCardActions, SRow
---

Register the plugin with your theme colors once, in `main.ts` (in Nuxt put the same object under `sui` in `nuxt.config.ts`):

```ts
import { createApp } from 'vue'
import { createSUI } from '@khsura/sui'
import '@khsura/sui/base.css'
import '@khsura/sui/style.css'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'

createApp(App)
  .use(
    createSUI({
      theme: 'light',
      themes: {
        light: { presetColors: { primary: '#3949ab', secondary: '#00897b' } },
        dark: {
          presetColors: { primary: '#9fa8da', secondary: '#80cbc4' },
          appColors: { background: '#121212', card: '#1e1e1e' },
        },
      },
    }),
  )
  .mount('#app')
```

- Wrap the app in `<SApp>`; it sets the `--s-color-*` variables every component reads.
- Options are deep-merged with the defaults, so pass only what you change.
- `presetColors` keys: `primary`, `secondary`, `success`, `info`, `warning`, `important`, `error` (extra keys become usable as `color`). Use opaque hex values.
- `useTheme()` returns `{ theme, setTheme }`. Toggle with `setTheme(theme.value === 'dark' ? 'light' : 'dark')`; `setTheme(null)` follows the OS. There is no `toggleTheme()`.
