export interface Display extends DisplayPreset {
  height: number
  lg: boolean
  lgAndDown: boolean
  lgAndUp: boolean
  lgOnly: boolean
  md: boolean
  mdAndDown: boolean
  mdAndUp: boolean
  mdOnly: boolean
  name: DisplayBreakpointName
  sm: boolean
  smAndDown: boolean
  smAndUp: boolean
  smOnly: boolean
  width: number
  xl: boolean
  xlOnly: boolean
  xs: boolean
  xsOnly: boolean
  mobile: boolean
}

export type DisplayBreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface DisplayBreakpointThresholds {
  xs: number
  sm: number
  md: number
  lg: number
}

export interface DisplayOptions {
  mobileBreakpoint?: number | DisplayBreakpointName
  scrollBarWidth?: number
  thresholds?: Partial<DisplayBreakpointThresholds>
}

export interface DisplayPreset extends Required<DisplayOptions> {
  thresholds: DisplayBreakpointThresholds
}
