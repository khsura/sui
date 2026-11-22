export const overlaysContainerId = 'sAppOverlayContainer'

// Class on <html> that pins the page in place while a modal overlay (SDialog, a mobile SNavigationDrawer) is open.
export const overlayScrollBlockedClassName = 's_overlay__scrollBlocked'

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
