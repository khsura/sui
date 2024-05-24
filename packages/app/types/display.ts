export type DisplayBreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export type DisplayBreakpointThresholds = Record<DisplayBreakpointName, number>

export interface DisplayOptions {
  scrollBarWidth?: number
  thresholds?: Partial<DisplayBreakpointThresholds>
}

export interface DisplayPreset extends Required<DisplayOptions> {
  thresholds: DisplayBreakpointThresholds
}
