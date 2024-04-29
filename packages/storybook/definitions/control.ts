export type InputControl =
  | {
      type: InputControlType
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: 'select'; labels?: Record<string, any>; mapping?: Record<string, any> }
  | { type: 'range' | 'number'; min?: number; max?: number; step?: number }
  | { type: 'file'; accept?: string }
  | InputControlType

export type InputControlType =
  | 'boolean'
  | 'text'
  | 'object'
  | 'radio'
  | 'inline-radio'
  | 'check'
  | 'inline-check'
  | 'multi-select'
  | 'color'
  | 'date'
  | 'select'
  | null
