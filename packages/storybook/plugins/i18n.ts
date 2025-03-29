import { i18nConfig } from '@khsura/sui/index'
import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  ...i18nConfig,
  legacy: true,
})
