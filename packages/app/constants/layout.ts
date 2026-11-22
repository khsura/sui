import { type Position } from './position'

export const defaultLayoutSizes: {
  left: number
  right: number
  offsetTop: number
  bottomNavigationHeight: number
  appBarPosition: Position
  appBarHeight: number
  footerHeight: number
  // a permanent drawer on that side pads itself by the side's safe-area inset, so the layout shifts by it too
  hasLeftSafeArea: boolean
  hasRightSafeArea: boolean
} = {
  left: 0,
  right: 0,
  offsetTop: 0,
  bottomNavigationHeight: 0,
  appBarPosition: null,
  appBarHeight: 0,
  footerHeight: 0,
  hasLeftSafeArea: false,
  hasRightSafeArea: false,
}
