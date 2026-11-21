import type { SuiApi } from '@khsura/shared/types'
import { renderComponentApiTables } from './componentApiMarkdown'
import { SKILL_TABLE_MARKER_PATTERN, SKILL_TABLE_MARKER_START, SKILL_TABLE_NOTICE } from './constants'
import type { SkillTableSync } from './types'

type Marker = { kind: string; name: string; start: number; end: number }

const startMarker = (name: string) => `<!-- generated:api:start ${name} -->`
const endMarker = (name: string) => `<!-- generated:api:end ${name} -->`

/** The full block a marker pair should hold for one component. */
export const renderSkillTableBlock = (component: SuiApi['components'][number]): string =>
  [
    startMarker(component.name),
    SKILL_TABLE_NOTICE,
    '',
    renderComponentApiTables(component),
    '',
    endMarker(component.name),
  ].join('\n')

const findMarkers = (markdown: string): Marker[] =>
  [...markdown.matchAll(SKILL_TABLE_MARKER_PATTERN)].map((match) => ({
    kind: match[1],
    name: match[2],
    start: match.index,
    end: match.index + match[0].length,
  }))

/**
 * Rewrites every `generated:api` marker pair in a skill reference with the component's current
 * props / slots / events from sui-api.json. Everything outside the markers is returned untouched.
 */
export const syncSkillTableMarkdown = (markdown: string, api: SuiApi): SkillTableSync => {
  const componentsByName = new Map(api.components.map((component) => [component.name, component]))
  const markers = findMarkers(markdown)
  const sync: SkillTableSync = { content: '', components: [], unknownComponents: [], malformedMarkers: [] }
  const pieces: string[] = []
  let cursor = 0
  let index = 0

  while (index < markers.length) {
    const opening = markers[index]
    const closing = markers[index + 1]

    if (opening.kind !== SKILL_TABLE_MARKER_START) {
      sync.malformedMarkers.push(`end ${opening.name} without start`)
      index += 1
      continue
    }

    if (!closing || closing.kind === SKILL_TABLE_MARKER_START || closing.name !== opening.name) {
      sync.malformedMarkers.push(`start ${opening.name} without matching end`)
      index += 1
      continue
    }

    const component = componentsByName.get(opening.name)

    if (component) {
      pieces.push(markdown.slice(cursor, opening.start), renderSkillTableBlock(component))
      cursor = closing.end
      sync.components.push(component.name)
    } else {
      sync.unknownComponents.push(opening.name)
    }

    index += 2
  }

  pieces.push(markdown.slice(cursor))
  sync.content = pieces.join('')

  return sync
}
