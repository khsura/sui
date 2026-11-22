import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import {
  skeletonLoaderDefaultRepeat,
  skeletonLoaderMaxRepeat,
  skeletonLoaderRepeatSeparator,
  skeletonLoaderTypeSeparator,
} from '@/app/constants'
import { skeletonLoaderPresetElements, skeletonLoaderPresetParts, skeletonLoaderPresets } from '@/app/configs'
import type { SkeletonLoaderNode, SkeletonLoaderPresetType, SkeletonLoaderTypeEntry } from '@/app/types'

/** Whether `name` is one of SSkeletonLoader's presets. */
export const isSkeletonLoaderPreset = (name: string): name is SkeletonLoaderPresetType => {
  return skeletonLoaderPresets.some((preset) => preset === name)
}

const parseRepeat = (rawCount: string | undefined) => {
  const count = Number(rawCount?.trim())

  if (rawCount === undefined || !Number.isInteger(count) || count < skeletonLoaderDefaultRepeat) {
    return skeletonLoaderDefaultRepeat
  }

  return Math.min(count, skeletonLoaderMaxRepeat)
}

/**
 * Splits a `type` string such as `'avatar, text@3'` into its presets and repeat counts. Spaces and empty parts are
 * ignored, an unknown preset is dropped, and a missing or invalid `@N` counts as 1 (at most 50).
 */
export const parseSkeletonLoaderType = (type: string): SkeletonLoaderTypeEntry[] => {
  return type.split(skeletonLoaderTypeSeparator).flatMap((part) => {
    const [rawName = '', rawCount] = part.split(skeletonLoaderRepeatSeparator)
    const name = rawName.trim()

    return isSkeletonLoaderPreset(name) ? [{ preset: name, count: parseRepeat(rawCount) }] : []
  })
}

const expandEntries = (entries: SkeletonLoaderTypeEntry[], keyPrefix: string): SkeletonLoaderNode[] => {
  return entries
    .flatMap(({ preset, count }) => Array.from({ length: count }, () => preset))
    .map((preset, index) => {
      const key = keyPrefix ? `${keyPrefix}-${index}` : `${index}`

      return { key, preset, children: expandEntries(skeletonLoaderPresetParts[preset], key) }
    })
}

/** The bones a `type` string draws, with every repeat and every group (`card`, `table`, …) expanded. */
export const getSkeletonLoaderNodes = (type: string): SkeletonLoaderNode[] => {
  return expandEntries(parseSkeletonLoaderType(type), '')
}

/** The classes of one drawn node: `s_skeletonLoader__bone` for a bone, and the preset's own element class. */
export const getSkeletonLoaderNodeClass = (node: SkeletonLoaderNode) => {
  return {
    s_skeletonLoader__bone: node.children.length === 0,
    [`s_skeletonLoader__${skeletonLoaderPresetElements[node.preset]}`]: true,
  }
}

/** How many levels deep a node tree goes: 1 for bones only, 3 for a `table` (table → row → cell). */
export const getSkeletonLoaderDepth = (nodes: SkeletonLoaderNode[]): number => {
  return nodes.reduce((depth, node) => Math.max(depth, 1 + getSkeletonLoaderDepth(node.children)), 0)
}

/** SSkeletonLoader's bone tree for a reactive `type` string. */
export const useSkeletonLoaderService = (type: MaybeRefOrGetter<string>) => {
  const nodes = computed(() => getSkeletonLoaderNodes(toValue(type)))

  return { nodes }
}
