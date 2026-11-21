import type { SuiApiSlot } from '@khsura/shared/types'
import ts from 'typescript'
import { parse } from 'vue/compiler-sfc'
import { DEFINE_SLOTS_CALLEE, PATTERN_SLOT_WILDCARD, REGEX_SPECIAL_CHARACTERS, SFC_SCRIPT_FILENAME } from './constants'

const escapeRegex = (text: string) => text.replace(REGEX_SPECIAL_CHARACTERS, '\\$&')

const findDefineSlotsType = (node: ts.Node): ts.TypeLiteralNode | undefined => {
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === DEFINE_SLOTS_CALLEE &&
    node.typeArguments?.[0] &&
    ts.isTypeLiteralNode(node.typeArguments[0])
  ) {
    return node.typeArguments[0]
  }

  return ts.forEachChild(node, findDefineSlotsType)
}

const unwrapParentheses = (node: ts.TypeNode): ts.TypeNode =>
  ts.isParenthesizedTypeNode(node) ? unwrapParentheses(node.type) : node

/** The slot-props type of `((props: X) => void) | undefined`, printed as written (`X`). */
const toSlotPropsType = (valueType: ts.TypeNode, sourceFile: ts.SourceFile): string => {
  const members = ts.isUnionTypeNode(valueType) ? valueType.types : [valueType]
  const slotFunction = members.map(unwrapParentheses).find(ts.isFunctionTypeNode)
  const propsType = slotFunction?.parameters[0]?.type

  return propsType ? propsType.getText(sourceFile) : 'any'
}

const toDescription = (member: ts.Node): string =>
  ts
    .getJSDocCommentsAndTags(member)
    .filter(ts.isJSDoc)
    .map((doc) => ts.getTextOfJSDocComment(doc.comment) ?? '')
    .join('\n')

/**
 * A template-literal index signature (`` [column: `item.${string}`]: … ``) as a slot entry:
 * a readable name (`item.<column>`, using the index parameter's name) and an anchored regex `pattern`.
 */
const toPatternSlot = (member: ts.IndexSignatureDeclaration, sourceFile: ts.SourceFile): SuiApiSlot | undefined => {
  const [parameter] = member.parameters
  const keyType = parameter?.type

  if (!keyType || !ts.isTemplateLiteralTypeNode(keyType)) {
    return undefined
  }

  const placeholder = `<${parameter.name.getText(sourceFile)}>`
  const name = keyType.templateSpans.reduce((label, span) => label + placeholder + span.literal.text, keyType.head.text)

  const pattern = keyType.templateSpans.reduce(
    (source, span) => source + PATTERN_SLOT_WILDCARD + escapeRegex(span.literal.text),
    escapeRegex(keyType.head.text),
  )

  return {
    name,
    type: toSlotPropsType(member.type, sourceFile),
    description: toDescription(member),
    pattern: `^${pattern}$`,
  }
}

/**
 * Dynamic slot families declared in `defineSlots` as template-literal index signatures.
 * vue-component-meta only reports named slot properties, so these are read from the SFC source.
 */
export const extractPatternSlots = (sfcSource: string): SuiApiSlot[] => {
  const scriptSetup = parse(sfcSource).descriptor.scriptSetup

  if (!scriptSetup) {
    return []
  }

  const sourceFile = ts.createSourceFile(SFC_SCRIPT_FILENAME, scriptSetup.content, ts.ScriptTarget.Latest, true)
  const slotsType = findDefineSlotsType(sourceFile)

  return (slotsType?.members ?? []).flatMap((member) =>
    ts.isIndexSignatureDeclaration(member) ? (toPatternSlot(member, sourceFile) ?? []) : [],
  )
}
