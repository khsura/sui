import type { ComponentAliasMatch } from '../types'
import { codeList } from './templateAst'

/** `SUI equivalent: \`SColumn\`. <hint>`, or just the hint when SUI has no equivalent yet. */
export const formatComponentAlias = (alias: ComponentAliasMatch): string =>
  alias.suiNames.length ? `SUI equivalent: ${codeList(alias.suiNames)}. ${alias.hint}` : alias.hint
