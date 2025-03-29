import { setup } from '@storybook/vue3'
import { i18n, sui } from '~/storybook'

setup((app) => {
  app.use(sui)
  app.use(i18n)
})
