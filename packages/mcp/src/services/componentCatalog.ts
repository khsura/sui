import type { SuiApi } from '@khsura/shared/types'
import type { ComponentLookup, ComponentSummary } from '../types'
import { MAX_NAME_SUGGESTIONS } from '../constants'
import { levenshteinDistance } from '../lib'
import { candidateComponentKeys, componentPurpose, toComponentKey } from '../utils'

export const useComponentCatalogService = (api: SuiApi) => {
  const listComponents = (): ComponentSummary[] =>
    api.components.map((component) => ({
      name: component.name,
      family: component.family,
      purpose: componentPurpose(component),
    }))

  const suggestNames = (query: string): string[] => {
    const queryKeys = candidateComponentKeys(query)

    const distanceTo = (name: string) =>
      Math.min(...queryKeys.map((queryKey) => levenshteinDistance(queryKey, toComponentKey(name))))

    return api.components
      .map((component) => ({ name: component.name, distance: distanceTo(component.name) }))
      .sort((left, right) => left.distance - right.distance || left.name.localeCompare(right.name))
      .slice(0, MAX_NAME_SUGGESTIONS)
      .map((candidate) => candidate.name)
  }

  const findComponent = (query: string): ComponentLookup => {
    for (const candidateKey of candidateComponentKeys(query)) {
      const component = api.components.find((entry) => toComponentKey(entry.name) === candidateKey)

      if (component) {
        return { found: true, component }
      }
    }

    return { found: false, suggestions: suggestNames(query) }
  }

  return { listComponents, findComponent }
}
