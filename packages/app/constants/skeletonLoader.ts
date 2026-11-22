/** The presets SSkeletonLoader's `type` string is made of. */
export enum SkeletonLoaderPreset {
  text = 'text',
  heading = 'heading',
  avatar = 'avatar',
  button = 'button',
  image = 'image',
  card = 'card',
  listItem = 'list-item',
  listItemAvatar = 'list-item-avatar',
  tableRow = 'table-row',
  table = 'table',
}

/** Separates the presets in a `type` string: `'avatar, text'`. */
export const skeletonLoaderTypeSeparator = ','
/** Separates a preset from its repeat count: `'text@3'`. */
export const skeletonLoaderRepeatSeparator = '@'
/** Times a preset is drawn when the `type` string gives no `@N`, or an invalid one. */
export const skeletonLoaderDefaultRepeat = 1
/** Most times one preset is drawn, so a typo such as `text@1000` cannot flood the DOM. */
export const skeletonLoaderMaxRepeat = 50
/** `type` drawn when the prop resolves to nothing (for example a component default of `undefined`). */
export const skeletonLoaderDefaultType = 'text'
/** Text lines in a `card` preset, under its heading. */
export const skeletonLoaderCardTextLines = 2
/** Text lines beside the avatar of a `list-item-avatar` preset. */
export const skeletonLoaderListItemAvatarTextLines = 2
/** Cells in a `table-row` preset. */
export const skeletonLoaderTableColumns = 4
/** Rows in a `table` preset. */
export const skeletonLoaderTableRows = 5
/** Levels SSkeletonLoader's template draws (table → row → cell). A preset must not nest deeper. */
export const skeletonLoaderMaxDepth = 3
