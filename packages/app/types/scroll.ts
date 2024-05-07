import { type DirectiveBinding } from 'vue'

export interface ScrollDirectiveBinding<V extends ScrollDirectiveBindingValue = ScrollDirectiveBindingValue>
  extends Omit<DirectiveBinding<V>, 'modifiers'> {
  value: V
  modifiers?: {
    self?: boolean
  }
}

export type ScrollDirectiveBindingValue =
  | EventListener
  | ScrollDirectiveBindingValueObject
  | (EventListenerObject & { options?: AddEventListenerOptions })

export interface ScrollDirectiveBindingValueObject {
  handler: EventListener | EventListenerObject
  options?: AddEventListenerOptions
  target?: Element | Window | undefined
}

export interface ThresholdMetParams {
  currentScroll: number
  currentThreshold: number
  isActive: boolean
  isScrollingUp: boolean
  previousScroll: number
  savedScroll: number
  target: HTMLElement | Document | null
  canScroll: boolean
  computedScrollThreshold: number
}
