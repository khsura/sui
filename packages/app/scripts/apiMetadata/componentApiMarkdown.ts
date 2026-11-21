import type { SuiApiComponent, SuiApiEvent, SuiApiProp, SuiApiSlot } from '@khsura/shared/types'
import {
  SKILL_TABLE_DESCRIPTION_HEADER,
  SKILL_TABLE_EMPTY_CELL,
  SKILL_TABLE_EVENT_HEADERS,
  SKILL_TABLE_NONE,
  SKILL_TABLE_OPTIONAL_TYPE_SUFFIX,
  SKILL_TABLE_PROP_HEADERS,
  SKILL_TABLE_REQUIRED_NO,
  SKILL_TABLE_REQUIRED_YES,
  SKILL_TABLE_SLOT_HEADERS,
} from './constants'
import { inlineCode, markdownTable } from './markdownTable'

/** Adds the Description column only when at least one row has one, so empty columns don't pad every table. */
const withOptionalDescription = <Entry extends { description: string }>(
  entries: Entry[],
  headers: string[],
  toRow: (entry: Entry) => string[],
): string => {
  if (!entries.length) {
    return SKILL_TABLE_NONE
  }

  const withDescription = entries.some((entry) => entry.description)

  const rows = entries.map((entry) =>
    withDescription ? [...toRow(entry), entry.description || SKILL_TABLE_EMPTY_CELL] : toRow(entry),
  )

  return markdownTable(withDescription ? [...headers, SKILL_TABLE_DESCRIPTION_HEADER] : headers, rows)
}

const propRow = (prop: SuiApiProp): string[] => [
  inlineCode(prop.name),
  inlineCode(prop.type.replace(SKILL_TABLE_OPTIONAL_TYPE_SUFFIX, '')),
  prop.default === undefined ? SKILL_TABLE_EMPTY_CELL : inlineCode(prop.default),
  prop.required ? SKILL_TABLE_REQUIRED_YES : SKILL_TABLE_REQUIRED_NO,
  prop.enumValues?.length ? prop.enumValues.map(inlineCode).join(', ') : SKILL_TABLE_EMPTY_CELL,
]

/** A dynamic slot family reads as `item.<column>` plus the regex a concrete name must match. */
const slotRow = (slot: SuiApiSlot): string[] => [
  slot.pattern ? `${inlineCode(slot.name)} (pattern ${inlineCode(slot.pattern)})` : inlineCode(slot.name),
  inlineCode(slot.type),
]

const eventRow = (event: SuiApiEvent): string[] => [inlineCode(event.name), inlineCode(event.type)]

/** Props, slots and events of one component as the markdown that lives between the skill markers. */
export const renderComponentApiTables = (component: SuiApiComponent): string =>
  [
    `**${component.name} props**`,
    '',
    withOptionalDescription(component.props, SKILL_TABLE_PROP_HEADERS, propRow),
    '',
    `**${component.name} slots**`,
    '',
    withOptionalDescription(component.slots, SKILL_TABLE_SLOT_HEADERS, slotRow),
    '',
    `**${component.name} events**`,
    '',
    withOptionalDescription(component.events, SKILL_TABLE_EVENT_HEADERS, eventRow),
  ].join('\n')
