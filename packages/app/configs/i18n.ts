import { i18nMessages } from '@khsura/sui/constants'
import { formatNumber } from '@khsura/sui/lib'
import { type VueMessageType } from 'vue-i18n'

export const i18nConfig = {
  availableLocales: ['en', 'mn', 'ja'],
  locale: 'en',
  fallbackLocale: 'en',
  messages: i18nMessages,
  modifiers: {
    formatNumber: (v: VueMessageType) => formatNumber(v.toString()),
  },
}
