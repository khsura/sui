import { SEMVER_PATTERN } from '../constants'

interface ParsedVersion {
  core: [number, number, number]
  preRelease?: string
}

const parseVersion = (version: string): ParsedVersion | undefined => {
  const match = SEMVER_PATTERN.exec(version)

  if (!match) {
    return undefined
  }

  const [, major, minor, patch, preRelease] = match

  return { core: [Number(major), Number(minor), Number(patch)], preRelease }
}

/**
 * Orders two semver strings: negative when `left` is older, positive when newer, 0 when equal.
 * A pre-release sorts before its release (`1.20.0-beta.1` < `1.20.0`); pre-release tags compare as text.
 * Returns `undefined` when either string is not a semver version.
 */
export const compareVersions = (left: string, right: string): number | undefined => {
  const leftVersion = parseVersion(left)
  const rightVersion = parseVersion(right)

  if (!leftVersion || !rightVersion) {
    return undefined
  }

  const coreDifference = leftVersion.core
    .map((part, index) => part - rightVersion.core[index])
    .find((difference) => difference !== 0)

  if (coreDifference !== undefined) {
    return coreDifference
  }

  if (leftVersion.preRelease === rightVersion.preRelease) {
    return 0
  }

  if (leftVersion.preRelease === undefined || rightVersion.preRelease === undefined) {
    return leftVersion.preRelease === undefined ? 1 : -1
  }

  return leftVersion.preRelease.localeCompare(rightVersion.preRelease)
}

/** True when `version` is `minimum` or newer; false when either is not a semver version. */
export const isVersionAtLeast = (version: string, minimum: string): boolean =>
  (compareVersions(version, minimum) ?? -1) >= 0
