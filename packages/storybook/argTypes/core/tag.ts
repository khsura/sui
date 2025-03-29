import type { PropsTag, HtmlTagName } from '@khsura/sui/index'
import type { ArgTypes } from '@storybook/vue3'
import { htmlTagNames } from '@khsura/storybook/configs'
import { getMarkdownArrayTypeDescription } from '@khsura/storybook/helpers'

export const argTypesTag = <T extends HtmlTagName>(defaults?: {
  tag: T | undefined | null
  allowedTags?: HtmlTagName[]
}): ArgTypes<PropsTag> => {
  return {
    tag: {
      type: 'string',
      description: 'html element tag name',
      table: {
        defaultValue: {
          summary: `${defaults?.tag ?? 'div'}`,
        },
        type: {
          summary: 'HtmlTagName',
          detail: getMarkdownArrayTypeDescription(defaults?.allowedTags ?? htmlTagNames),
        },
      },
    },
  }
}
