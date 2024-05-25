import { i18nMessages } from '@khsura/sui/constants'
import { formatNumber } from '@khsura/sui/lib/formatNumber'
import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  availableLocales: ['en', 'mn', 'ja'],
  locale: 'en',
  fallbackLocale: 'en',
  messages: i18nMessages,
  modifiers: {
    formatNumber: (v) => formatNumber(v.toString()),
  },
})
