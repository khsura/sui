import { createI18n } from 'vue-i18n'
import { i18nConfig } from '@/app/index'

export const i18n = createI18n({
  ...i18nConfig,
  legacy: true,
  locale: 'mn',
})
