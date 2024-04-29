import { createSUI } from '@sui/app'
import { setup } from '@storybook/vue3'

let isAppLoaded = false

const suiPlugin = createSUI({
  themes: {
    light: {
      presetColors: {
        tertiary: '#545499',
      },
    },
  },
})

setup((app) => {
  if (!isAppLoaded) {
    app.use(suiPlugin)
    isAppLoaded = true
  }
})
