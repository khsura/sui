import type vue from 'vue'
import { type VNode } from 'vue'

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Element extends VNode {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ElementClass extends vue {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type IntrinsicElements = Record<string, any>
  }
}
