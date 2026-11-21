import type { SuiApiComponent, SuiApiProp } from '@khsura/shared/types'
import type { ComponentSummary, ResolvedSuiApi } from '../types'
import {
  ACTIVATOR_COMPONENTS,
  ACTIVATOR_NOTE,
  API_SOURCE_BUNDLED,
  LAYOUT_CHILD_COMPONENTS,
  LAYOUT_CHILD_NOTE,
  LIST_COMPONENTS_TOOL_NAME,
  SLOTLESS_ACTIVATOR_NOTE,
  SLOTLESS_ACTIVATOR_NOTE_COMPONENTS,
} from '../constants'
import { inlineCode, markdownTable } from '../lib'

const OPTIONAL_TYPE_SUFFIX = / \| undefined$/
const EMPTY_CELL = '—'

/** First line of every response: which @khsura/sui version answered and where it came from. */
export const formatSourceHeader = (resolved: ResolvedSuiApi): string => {
  const lines = [`_${resolved.api.package} ${resolved.api.version} · source: ${resolved.source} (${resolved.path})_`]

  if (resolved.source === API_SOURCE_BUNDLED) {
    lines.push(
      '_No project install of @khsura/sui with sui-api.json was found, so the API bundled with sui-mcp (the latest release it ships) is used. It can differ from the version your project installs._',
    )
  }

  if (resolved.warning) {
    lines.push(`_Warning: ${resolved.warning}_`)
  }

  return lines.join('\n')
}

export const formatComponentList = (resolved: ResolvedSuiApi, summaries: ComponentSummary[]): string =>
  [
    formatSourceHeader(resolved),
    '',
    `${summaries.length} components.`,
    '',
    markdownTable(
      ['Name', 'Family', 'Purpose'],
      summaries.map((summary) => [summary.name, summary.family, summary.purpose]),
    ),
  ].join('\n')

const componentNotes = (name: string): string[] => {
  const notes: string[] = []

  if (ACTIVATOR_COMPONENTS.some((activatorName) => activatorName === name)) {
    notes.push(ACTIVATOR_NOTE)
  }

  if (SLOTLESS_ACTIVATOR_NOTE_COMPONENTS.some((tooltipName) => tooltipName === name)) {
    notes.push(SLOTLESS_ACTIVATOR_NOTE)
  }

  if (LAYOUT_CHILD_COMPONENTS.some((layoutChildName) => layoutChildName === name)) {
    notes.push(LAYOUT_CHILD_NOTE)
  }

  return notes
}

const propRow = (prop: SuiApiProp, withDescription: boolean): string[] => {
  const row = [
    inlineCode(prop.name),
    inlineCode(prop.type.replace(OPTIONAL_TYPE_SUFFIX, '')),
    prop.default === undefined ? EMPTY_CELL : inlineCode(prop.default),
    prop.required ? 'yes' : 'no',
    prop.enumValues?.length ? prop.enumValues.map(inlineCode).join(', ') : EMPTY_CELL,
  ]

  return withDescription ? [...row, prop.description || EMPTY_CELL] : row
}

const formatProps = (props: SuiApiProp[]): string => {
  if (!props.length) {
    return 'None.'
  }

  const withDescription = props.some((prop) => prop.description)
  const headers = ['Name', 'Type', 'Default', 'Required', 'Values']

  return markdownTable(
    withDescription ? [...headers, 'Description'] : headers,
    props.map((prop) => propRow(prop, withDescription)),
  )
}

/** A dynamic slot family reads as `item.<column>` plus the regex a concrete name must match. */
const entryName = (entry: { name: string; pattern?: string }): string =>
  entry.pattern ? `${inlineCode(entry.name)} (pattern ${inlineCode(entry.pattern)})` : inlineCode(entry.name)

const formatNamedTypes = (
  entries: { name: string; type: string; description: string; pattern?: string }[],
  typeHeader: string,
): string => {
  if (!entries.length) {
    return 'None.'
  }

  const withDescription = entries.some((entry) => entry.description)
  const headers = withDescription ? ['Name', typeHeader, 'Description'] : ['Name', typeHeader]

  const rows = entries.map((entry) => {
    const row = [entryName(entry), inlineCode(entry.type)]

    return withDescription ? [...row, entry.description || EMPTY_CELL] : row
  })

  return markdownTable(headers, rows)
}

export const formatComponentApi = (resolved: ResolvedSuiApi, component: SuiApiComponent): string =>
  [
    formatSourceHeader(resolved),
    '',
    `# ${component.name}`,
    '',
    `Family: ${component.family} · File: ${inlineCode(component.file)}`,
    ...componentNotes(component.name).flatMap((note) => ['', `> ${note}`]),
    '',
    `## Props (${component.props.length})`,
    '',
    formatProps(component.props),
    '',
    `## Slots (${component.slots.length})`,
    '',
    formatNamedTypes(component.slots, 'Slot props'),
    '',
    `## Events (${component.events.length})`,
    '',
    formatNamedTypes(component.events, 'Payload'),
  ].join('\n')

export const formatUnknownComponent = (resolved: ResolvedSuiApi, query: string, suggestions: string[]): string => {
  const hint = suggestions.length
    ? `Did you mean: ${suggestions.map(inlineCode).join(', ')}?`
    : `Call ${inlineCode(LIST_COMPONENTS_TOOL_NAME)} to see every component.`

  return [formatSourceHeader(resolved), '', `Unknown component ${inlineCode(query)}. ${hint}`].join('\n')
}
