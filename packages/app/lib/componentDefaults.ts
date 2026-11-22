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

const UPPERCASE_LETTER = /\B([A-Z])/g

/** Whether the parent passed `propName` (camelCase or kebab-case) in the raw vnode props. */
export const hasRawProp = (rawProps: object, propName: string) =>
  propName in rawProps || propName.replace(UPPERCASE_LETTER, '-$1').toLowerCase() in rawProps
