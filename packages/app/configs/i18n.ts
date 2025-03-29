import { type VueMessageType } from 'vue-i18n'
import { i18nMessages } from '~/constants'
import { formatNumber } from '~/lib'

export const i18nConfig = {
  availableLocales: ['en', 'mn', 'ja'],
  locale: 'en',
  fallbackLocale: 'en',
  messages: i18nMessages,
  modifiers: {
    formatNumber: (v: VueMessageType) => formatNumber(v.toString()),
  },
}
