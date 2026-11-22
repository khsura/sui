/** Marker for a gap in the page list that SPagination draws as "…". */
export const paginationEllipsis = 'ellipsis'
/** Page slots (pages and ellipses together) SPagination shows when `totalVisible` is not set. */
export const paginationDefaultTotalVisible = 7
/** Most page slots SPagination shows in compact mode. */
export const paginationCompactMaxVisible = 5
/** Fewest slots that fit "first, …, current, …, last". Below it the list is a plain window of pages. */
export const paginationMinEllipsisSlots = 5
/** Fewest pages an ellipsis may stand for. Hiding a single page behind "…" saves no space. */
export const paginationMinHiddenPages = 2
/** Previous and next buttons, always shown. */
export const paginationStepButtonCount = 2
/** First, previous, next and last buttons. */
export const paginationAllButtonCount = 4
/** Page shown when no `modelValue` is given. */
export const paginationFirstPage = 1
/** Rows per page STablePagination uses when `itemsPerPage` is not set. */
export const tablePaginationDefaultItemsPerPage = 10
/** A page item inside SPagination, used to measure how many fit. */
export const paginationSlotSelector = '.s_pagination__slot'
