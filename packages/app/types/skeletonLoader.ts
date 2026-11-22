import { type SkeletonLoaderPreset } from '@/app/constants'

/** A preset name of SSkeletonLoader's `type` string: `'text'`, `'avatar'`, `'list-item-avatar'`, … */
export type SkeletonLoaderPresetType = `${SkeletonLoaderPreset}`

/** One comma-separated part of a `type` string, such as `text@3`. */
export type SkeletonLoaderTypeEntry = {
  preset: SkeletonLoaderPresetType
  /** Times the preset is drawn, at least 1. */
  count: number
}

/** One drawn preset: a bone (no children) or a group of bones (`card`, `table`, …). */
export type SkeletonLoaderNode = {
  /** Stable key for `v-for`, made of the node's position: `'0'`, `'0-2'`. */
  key: string
  preset: SkeletonLoaderPresetType
  children: SkeletonLoaderNode[]
}
