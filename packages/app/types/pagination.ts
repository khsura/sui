import { type paginationEllipsis } from '@/app/constants'

/** One slot in SPagination's page list: a page number, or a gap drawn as "…". */
export type PaginationItem = number | typeof paginationEllipsis

/** Inputs of the page-range calculation. */
export type PaginationRangeOptions = {
  /** Current page, starting at 1. Out-of-range values are clamped. */
  page: number
  /** Number of pages. */
  length: number
  /** Most slots (pages and ellipses together) to show. */
  totalVisible: number
}

/** The rows a page shows, both ends included and starting at 1. */
export type PaginationItemRange = {
  first: number
  last: number
}
