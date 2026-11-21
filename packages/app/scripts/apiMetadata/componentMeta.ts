import fs from 'node:fs'
import path from 'node:path'
import type { SuiApiComponent, SuiApiProp } from '@khsura/shared/types'
import type { PropertyMeta, PropertyMetaSchema } from 'vue-component-meta'
import { ENUM_SCHEMA_KIND, NULLISH_SCHEMA_MEMBERS, QUOTED_LITERAL_PATTERN } from './constants'
import { extractPatternSlots } from './slotPatterns'
import type { ComponentExport, ComponentMetaChecker } from './types'

const byName = <T extends { name: string }>(left: T, right: T) => (left.name < right.name ? -1 : 1)

/**
 * String-literal values of a closed union (`'small' | 'large' | null`).
 * Returns undefined for open types (`string`, `boolean`, objects), so only real enums get values.
 */
const toEnumValues = (schema: PropertyMetaSchema): string[] | undefined => {
  if (typeof schema === 'string' || schema.kind !== ENUM_SCHEMA_KIND) {
    return undefined
  }

  const members = (schema.schema ?? []).filter(
    (member) => typeof member !== 'string' || !NULLISH_SCHEMA_MEMBERS.includes(member),
  )

  const literals = members.flatMap((member) => {
    const match = typeof member === 'string' ? QUOTED_LITERAL_PATTERN.exec(member) : null

    return match ? [match[1]] : []
  })

  return literals.length > 0 && literals.length === members.length ? literals.sort() : undefined
}

const toProp = (prop: PropertyMeta): SuiApiProp => {
  const enumValues = toEnumValues(prop.schema)

  return {
    name: prop.name,
    type: prop.type,
    required: prop.required,
    description: prop.description,
    ...(prop.default === undefined ? {} : { default: prop.default }),
    ...(enumValues ? { enumValues } : {}),
  }
}

export const extractComponentMeta = (
  checker: ComponentMetaChecker,
  appRoot: string,
  entry: ComponentExport,
): SuiApiComponent => {
  const componentFile = path.join(appRoot, entry.file)
  const meta = checker.getComponentMeta(componentFile)
  const namedSlots = meta.slots.map(({ name, type, description }) => ({ name, type, description }))

  return {
    ...entry,
    props: meta.props
      .filter((prop) => !prop.global)
      .map(toProp)
      .sort(byName),
    slots: [...namedSlots, ...extractPatternSlots(fs.readFileSync(componentFile, 'utf8'))].sort(byName),
    events: meta.events.map(({ name, type, description }) => ({ name, type, description })).sort(byName),
  }
}
