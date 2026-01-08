import { type DirectiveBinding } from 'vue'

export interface OnResizeObject {
  handler: ResizeDirectiveBindingValue
  options: AddEventListenerOptions
}

export interface ResizeDirectiveBinding<
  V extends ResizeDirectiveBindingValue = ResizeDirectiveBindingValue,
> extends Omit<DirectiveBinding<V>, 'modifiers'> {
  modifiers?: {
    active?: boolean
    quiet?: boolean
  }
}

export type ResizeDirectiveBindingValue = () => void
