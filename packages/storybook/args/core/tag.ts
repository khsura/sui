import type { PropsTag } from '@sui/app/definitions'
import type { HtmlTagName } from '@sui/app/types'

export const argsTag = <T extends HtmlTagName>(defaults?: { tag?: T | undefined | null }): Partial<PropsTag> => ({
  tag: defaults?.tag ?? 'div',
})
