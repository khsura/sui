export const overlaysContainerId = 'sAppOverlayContainer'

// Distance (px) SMenu and STooltip keep from the viewport edges when they flip or shift to stay visible.
export const overlayViewportGutter = 8

// Elements a focus-trapping overlay (SDialog) cycles through with Tab.
export const overlayFocusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export const overlayCloseKey = 'Escape'
export const overlayFocusKey = 'Tab'
