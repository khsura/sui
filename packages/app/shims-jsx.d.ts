import type vue, { type VNode } from 'vue'

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends vue {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type IntrinsicElements = Record<string, any>
  }
}
