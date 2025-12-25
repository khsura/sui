import { setup } from '@storybook/vue3-vite'
import { i18n, sui } from '../plugins'

setup((app) => {
  app.use(sui)
  app.use(i18n)
})
