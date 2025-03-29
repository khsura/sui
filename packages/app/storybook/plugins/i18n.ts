import { createI18n } from 'vue-i18n'
import { i18nConfig } from '~/index'

export const i18n = createI18n({
  ...i18nConfig,
  legacy: true,
})
