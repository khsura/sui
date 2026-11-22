import { type PropsColor, type PropsDisabled } from './core'
import { type PropsSizePreset } from './propsSizePreset'

export type PropsPagination = {
  /** Current page, starting at 1. Use `v-model`. Values outside `1…length` are clamped. Defaults to `1`. */
  modelValue?: number | undefined
  /** Number of pages (not the number of rows): `Math.ceil(totalItems / itemsPerPage)`. */
  length: number
  /**
   * Most slots to show, pages and ellipses together (not counting the arrow buttons). Hidden pages become "…",
   * and the first and last page stay visible. Defaults to `7`.
   */
  totalVisible?: number | undefined
  /** Shows the first-page and last-page buttons beside the previous and next buttons. Hidden in compact mode. */
  showFirstLastPage?: boolean | undefined
  /**
   * Compact mode: no first/last buttons and at most 5 page slots. Leave it unset and SPagination switches to it
   * by itself when the full list does not fit its width (on a phone, for example). `true` or `false` forces it.
   */
  compact?: boolean | undefined
  /** Accessible name of the `<nav>` landmark. Defaults to `'Pagination'`. */
  ariaLabel?: string | undefined
  /** Accessible name of a page button, followed by its number: `'Page'` gives "Page 3". Defaults to `'Page'`. */
  pageAriaLabel?: string | undefined
  /** Accessible name of the first-page button. Defaults to `'First page'`. */
  firstAriaLabel?: string | undefined
  /** Accessible name of the previous-page button. Defaults to `'Previous page'`. */
  prevAriaLabel?: string | undefined
  /** Accessible name of the next-page button. Defaults to `'Next page'`. */
  nextAriaLabel?: string | undefined
  /** Accessible name of the last-page button. Defaults to `'Last page'`. */
  lastAriaLabel?: string | undefined
} & Pick<PropsDisabled, 'disabled'> &
  PropsColor &
  PropsSizePreset
