import type { PropsTag, HtmlTagName } from '~/index'

export const argsTag = <T extends HtmlTagName>(defaults?: { tag?: T | undefined | null }): Partial<PropsTag> => ({
  tag: defaults?.tag ?? 'div',
})
