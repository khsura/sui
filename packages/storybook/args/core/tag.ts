import type { PropsTag } from '@khsura/sui/definitions'
import type { HtmlTagName } from '@khsura/sui/types'

export const argsTag = <T extends HtmlTagName>(defaults?: { tag?: T | undefined | null }): Partial<PropsTag> => ({
  tag: defaults?.tag ?? 'div',
})
