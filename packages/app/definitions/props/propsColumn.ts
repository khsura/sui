import type { PropsContent } from './core'

export type ColumnNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto'

export type PropsColumn = PropsContent & {
  cols?: ColumnNumber | `${ColumnNumber}` | null
  sm?: ColumnNumber | `${ColumnNumber}` | null
  md?: ColumnNumber | `${ColumnNumber}` | null
  lg?: ColumnNumber | `${ColumnNumber}` | null
  order?: number | null
  alignSelf?:
    | 'auto'
    | 'normal'
    | 'center'
    | 'start'
    | 'end'
    | 'self-start'
    | 'self-end'
    | 'flex-start'
    | 'flex-end'
    | 'baseline'
    | 'first baseline'
    | 'last baseline'
    | 'stretch'
    | 'safe center'
    | 'unsafe center'
    | 'inherit'
    | 'initial'
    | null
}
