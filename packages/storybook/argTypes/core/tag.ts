import { htmlTagNames } from '@sui/storybook/configs'
import { getMarkdownArrayTypeDescription } from '@sui/storybook/helpers'
import type { PropsTag } from '@sui/app/definitions'
import type { HtmlTagName } from '@sui/app/types'
import type { ArgTypes } from '@storybook/types'

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
