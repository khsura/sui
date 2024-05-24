import { createSUI } from '@sui/app/index'
import { setup } from '@storybook/vue3'

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
  app.use(suiPlugin)
})
