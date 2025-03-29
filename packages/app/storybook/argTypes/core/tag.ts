import type { ArgTypes } from '@storybook/vue3'
import type { PropsTag, HtmlTagName } from '~/index'
import { htmlTagNames } from '~/storybook/configs'
import { getMarkdownArrayTypeDescription } from '~/storybook/helpers'

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
