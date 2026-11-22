import { type PropsComponentTheme } from './core'
import { type PropsSizePreset } from './propsSizePreset'
import { type MaterialDesignIcon } from '@/app/types'

export type PropsEmptyState = {
  /** Material Design icon shown above the title, such as `mdi-inbox-outline`. Ignored when `image` is set. Decorative: hidden from screen readers. */
  icon?: MaterialDesignIcon | undefined
  /** Illustration URL shown above the title. Wins over `icon`. Decorative (`alt=""`): put the meaning in `title` and `text`. */
  image?: string | undefined
  /** Short headline, such as `No orders yet`. Rendered as text, not as a heading element. */
  title?: string | undefined
  /** Supporting sentence under the title that says why it is empty or what to do next. */
  text?: string | undefined
  /** Label of the built-in action button. The button is shown only when this is set; clicking it emits `action`. */
  actionText?: string | undefined
  /** Colour of the icon only (preset name or CSS colour), not a background: an empty state has no background of its own. */
  color?: string | null | undefined
} & PropsComponentTheme &
  PropsSizePreset
