import {
  SkeletonLoaderPreset,
  skeletonLoaderCardTextLines,
  skeletonLoaderDefaultRepeat,
  skeletonLoaderListItemAvatarTextLines,
  skeletonLoaderTableColumns,
  skeletonLoaderTableRows,
} from '@/app/constants'
import { type SkeletonLoaderPresetType, type SkeletonLoaderTypeEntry } from '@/app/types'

/**
 * What each SSkeletonLoader preset is made of. A preset with no parts is a single bone; the others are groups the
 * component lays out (a card stacks its parts, a table row puts its cells side by side).
 */
export const skeletonLoaderPresetParts = {
  [SkeletonLoaderPreset.text]: [],
  [SkeletonLoaderPreset.heading]: [],
  [SkeletonLoaderPreset.avatar]: [],
  [SkeletonLoaderPreset.button]: [],
  [SkeletonLoaderPreset.image]: [],
  [SkeletonLoaderPreset.card]: [
    { preset: SkeletonLoaderPreset.image, count: skeletonLoaderDefaultRepeat },
    { preset: SkeletonLoaderPreset.heading, count: skeletonLoaderDefaultRepeat },
    { preset: SkeletonLoaderPreset.text, count: skeletonLoaderCardTextLines },
  ],
  [SkeletonLoaderPreset.listItem]: [{ preset: SkeletonLoaderPreset.text, count: skeletonLoaderDefaultRepeat }],
  [SkeletonLoaderPreset.listItemAvatar]: [
    { preset: SkeletonLoaderPreset.avatar, count: skeletonLoaderDefaultRepeat },
    { preset: SkeletonLoaderPreset.text, count: skeletonLoaderListItemAvatarTextLines },
  ],
  [SkeletonLoaderPreset.tableRow]: [{ preset: SkeletonLoaderPreset.text, count: skeletonLoaderTableColumns }],
  [SkeletonLoaderPreset.table]: [{ preset: SkeletonLoaderPreset.tableRow, count: skeletonLoaderTableRows }],
} satisfies Record<SkeletonLoaderPresetType, SkeletonLoaderTypeEntry[]>

/** The camelCase BEM element each preset draws: `list-item-avatar` → `.s_skeletonLoader__listItemAvatar`. */
export const skeletonLoaderPresetElements = {
  [SkeletonLoaderPreset.text]: 'text',
  [SkeletonLoaderPreset.heading]: 'heading',
  [SkeletonLoaderPreset.avatar]: 'avatar',
  [SkeletonLoaderPreset.button]: 'button',
  [SkeletonLoaderPreset.image]: 'image',
  [SkeletonLoaderPreset.card]: 'card',
  [SkeletonLoaderPreset.listItem]: 'listItem',
  [SkeletonLoaderPreset.listItemAvatar]: 'listItemAvatar',
  [SkeletonLoaderPreset.tableRow]: 'tableRow',
  [SkeletonLoaderPreset.table]: 'table',
} satisfies Record<SkeletonLoaderPresetType, string>

/** Every preset name, in the order the docs list them. */
export const skeletonLoaderPresets: SkeletonLoaderPresetType[] = Object.values(SkeletonLoaderPreset)
