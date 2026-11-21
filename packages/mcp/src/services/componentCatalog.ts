import type { SuiApi } from '@khsura/shared/types'
import type { ComponentAliasMatch, ComponentLookup, ComponentSummary } from '../types'
import { COMPONENT_ALIASES, MAX_NAME_SUGGESTIONS } from '../constants'
import { levenshteinDistance } from '../lib'
import { candidateComponentKeys, componentPurpose, toComponentKey } from '../utils'

export const useComponentCatalogService = (api: SuiApi) => {
  const componentKeys = new Set(api.components.map((component) => toComponentKey(component.name)))

  const listComponents = (): ComponentSummary[] =>
    api.components.map((component) => ({
      name: component.name,
      family: component.family,
      purpose: componentPurpose(component),
    }))

  const suggestNames = (query: string, excludedNames: string[] = []): string[] => {
    const queryKeys = candidateComponentKeys(query)

    const distanceTo = (name: string) =>
      Math.min(...queryKeys.map((queryKey) => levenshteinDistance(queryKey, toComponentKey(name))))

    return api.components
      .filter((component) => !excludedNames.includes(component.name))
      .map((component) => ({ name: component.name, distance: distanceTo(component.name) }))
      .sort((left, right) => left.distance - right.distance || left.name.localeCompare(right.name))
      .slice(0, MAX_NAME_SUGGESTIONS)
      .map((candidate) => candidate.name)
  }

  /**
   * The other-library alias for a name that is not a component. An alias whose SUI targets are all
   * missing from this API version is skipped, so the Levenshtein suggestions answer instead.
   */
  const findAlias = (query: string): ComponentAliasMatch | undefined => {
    const queryKeys = candidateComponentKeys(query)
    const entry = Object.entries(COMPONENT_ALIASES).find(([alias]) => queryKeys.includes(toComponentKey(alias)))

    if (!entry) {
      return undefined
    }

    const [alias, { suiNames, hint }] = entry
    const availableNames = suiNames.filter((name: string) => componentKeys.has(toComponentKey(name)))

    return suiNames.length && !availableNames.length ? undefined : { alias, suiNames: availableNames, hint }
  }

  const findComponent = (query: string): ComponentLookup => {
    for (const candidateKey of candidateComponentKeys(query)) {
      const component = api.components.find((entry) => toComponentKey(entry.name) === candidateKey)

      if (component) {
        return { found: true, component }
      }
    }

    const alias = findAlias(query)

    return { found: false, suggestions: suggestNames(query, alias?.suiNames), alias }
  }

  return { listComponents, findComponent }
}
