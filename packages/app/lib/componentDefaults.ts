import { globalComponentDefaultTargets } from '@/app/configs/componentDefaults'
import type { ComponentDefaultsOptions, ComponentsOption, GlobalComponentDefaultName } from '@/app/definitions'

export type ResolvedComponentDefault = { found: true; value: unknown } | { found: false }

export interface ResolveComponentDefaultInput {
  /** The typed `defaults` layer (app-level, or a scoped one provided further up). */
  defaults: ComponentDefaultsOptions | undefined
  /** The deprecated untyped `components` option. */
  legacyComponents: ComponentsOption | undefined
  componentName: string
  propName: string
  /** Whether the component declares `propName` — `global` never adds props a component lacks. */
  hasProp: boolean
}

const NOT_FOUND: ResolvedComponentDefault = { found: false }
const hasOwn = (source: object, key: string) => Object.prototype.hasOwnProperty.call(source, key)

const getOwnDefinedValue = (source: object | undefined, key: string): ResolvedComponentDefault => {
  if (!source || !hasOwn(source, key)) {
    return NOT_FOUND
  }

  const value: unknown = Reflect.get(source, key)

  return value === undefined ? NOT_FOUND : { found: true, value }
}

const getOwnDefinedObject = (source: object | undefined, key: string): object | undefined => {
  const entry = getOwnDefinedValue(source, key)

  return entry.found && typeof entry.value === 'object' && entry.value !== null ? entry.value : undefined
}

export const isGlobalComponentDefaultName = (name: string): name is GlobalComponentDefaultName =>
  hasOwn(globalComponentDefaultTargets, name)

export const isGlobalComponentDefaultTarget = (componentName: string, propName: GlobalComponentDefaultName) => {
  const targets: ReadonlyArray<string> = globalComponentDefaultTargets[propName]

  return targets.includes(componentName)
}

/**
 * Resolves the configured default of one prop (the explicit-prop check happens before this):
 * component default (`defaults[C]`, then legacy `components[C]`) → `defaults.global` → not found
 * (the caller then falls back to the component's built-in default).
 */
export const resolveComponentDefault = ({
  defaults,
  legacyComponents,
  componentName,
  propName,
  hasProp,
}: ResolveComponentDefaultInput): ResolvedComponentDefault => {
  const componentLayer = getOwnDefinedValue(getOwnDefinedObject(defaults, componentName), propName)

  if (componentLayer.found) {
    return componentLayer
  }

  const legacyLayer = getOwnDefinedValue(getOwnDefinedObject(legacyComponents, componentName), propName)

  if (legacyLayer.found) {
    return legacyLayer
  }

  if (!hasProp || !isGlobalComponentDefaultName(propName) || !isGlobalComponentDefaultTarget(componentName, propName)) {
    return NOT_FOUND
  }

  return getOwnDefinedValue(defaults?.global, propName)
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** `outer` overlaid with the entries of `inner` whose value is not `undefined`. */
const mergeDefinedEntries = (outer: Record<string, unknown>, inner: Record<string, unknown>) => {
  const merged: Record<string, unknown> = { ...outer }

  for (const [key, value] of Object.entries(inner)) {
    if (value !== undefined) {
      merged[key] = value
    }
  }

  return merged
}

/**
 * Merges a scoped defaults layer (`inner`, e.g. an `SDefaultsProvider`'s `defaults`) onto the
 * nearest outer layer (the app-level `createSUI({ defaults })` or an outer provider's merged layer).
 * Merging is per entry and per prop: `inner.SButton.size` overrides `outer.SButton.size` but keeps
 * `outer.SButton.variant`, and `global` merges the same way. `undefined` values never override.
 * It is generic over entry and prop names, so new options (such as `density`) merge with no change here.
 */
export const mergeComponentDefaults = (
  outer: ComponentDefaultsOptions | undefined,
  inner: ComponentDefaultsOptions | undefined,
): ComponentDefaultsOptions => {
  const merged: Record<string, unknown> = { ...outer }

  for (const [entryName, innerEntry] of Object.entries(inner ?? {})) {
    if (innerEntry === undefined) {
      continue
    }

    const outerEntry = merged[entryName]

    merged[entryName] =
      isPlainObject(outerEntry) && isPlainObject(innerEntry) ? mergeDefinedEntries(outerEntry, innerEntry) : innerEntry
  }

  // Boundary: `merged` only holds the entries of two ComponentDefaultsOptions, each entry merged with its own kind.
  return merged as ComponentDefaultsOptions
}

const UPPERCASE_LETTER = /\B([A-Z])/g

/** Whether the parent passed `propName` (camelCase or kebab-case) in the raw vnode props. */
export const hasRawProp = (rawProps: object, propName: string) =>
  propName in rawProps || propName.replace(UPPERCASE_LETTER, '-$1').toLowerCase() in rawProps
