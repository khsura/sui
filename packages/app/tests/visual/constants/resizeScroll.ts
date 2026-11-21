// Window-resize scroll regression: an app shell drawer crosses the md breakpoint, then a long page must still scroll.
export const resizeScrollShellStoryId = 'recipes--app-shell'
export const resizeScrollPageStoryId = 'recipes--responsive-grid'
export const resizeScrollBrowser = 'chromium'
// A drag-resize fires many resize events; stepping the viewport reproduces the drawer's lock/unlock race.
export const resizeScrollSteps = 10
export const resizeScrollStepDelayMs = 16
// The display store debounces resize by 100ms; wait past it so the breakpoint change has landed.
export const resizeScrollSettleMs = 400
export const resizeScrollDistance = 200
export const resizeScrollPageHeight = 500
export const resizeScrollBlockedClassName = 's_overlay__scrollBlocked'
export const resizeObserverLoopMessage = 'ResizeObserver loop'
