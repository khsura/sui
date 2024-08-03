import { type CSSProperties } from 'vue'

export interface MenuContentStyle extends CSSProperties {
  top?: string
  left?: string
  minWidth?: string
}

export interface EmitMenu {
  (event: 'close'): void
}
