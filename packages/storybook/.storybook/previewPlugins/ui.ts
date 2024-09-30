import { setup } from '@storybook/vue3'
import { i18n, sui } from '@khsura/storybook/plugins'

setup((app) => {
  app.use(sui)
  app.use(i18n)
})
