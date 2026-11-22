import { type PropsColor } from './core'
import { type PropsSizeUnion } from './propsSizeUnion'

export type PropsAvatarGroup = {
  /** The most avatars shown. The rest collapse into one "+N" avatar. Shows every avatar when unset. */
  max?: number | undefined
  /** Accessible name of the "+N" avatar. `{count}` is replaced with the number of hidden avatars. Defaults to `{count} more`. */
  moreLabel?: string | undefined
} & PropsColor &
  PropsSizeUnion
