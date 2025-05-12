import { type PropsContent, type PropsGroup } from './core'

/**
 * Props for Slide Group component
 * Extends group functionality for managing items and content display
 */
export type PropsSlideGroup = {
  centerActive?: boolean
  activeClass?: string | null | undefined
  slideStep?: number | null | undefined
  scrollable?: boolean | null | undefined
} & PropsGroup &
  PropsContent
