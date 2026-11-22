import { type PropsBorder, type PropsColor } from './core'
import { type PropsSizeUnion } from './propsSizeUnion'
import { type MaterialDesignIcon } from '@/app/types'

export type PropsAvatar = {
  /** Image URL. When it is missing or fails to load, the avatar shows `text`, then `icon`. Do not put an `<img>` in the slot. */
  image?: string | undefined
  /** Accessible name of the avatar, usually the person's name. Used as the image `alt` and as the `aria-label`. Leave it empty for a decorative avatar. */
  alt?: string | undefined
  /** Initials shown when there is no image or it fails to load. Keep it to 1–3 characters, such as `JD`, not a full name. */
  text?: string | undefined
  /** Material Design icon shown when there is neither an image nor text. Defaults to `mdi-account`. */
  icon?: MaterialDesignIcon | undefined
} & PropsColor &
  PropsSizeUnion &
  Pick<PropsBorder, 'borderRadius' | 'outlined'>
