import { type ScrollDirectiveBinding, type ScrollDirectiveBindingValueObject } from '@khsura/sui/types'
import { type Directive } from 'vue'

const mounted = (
  el: HTMLElement & { _onScroll?: ScrollDirectiveBindingValueObject },
  binding: ScrollDirectiveBinding,
) => {
  const { self = false } = binding.modifiers ?? {}
  const value = binding.value
  const options = (typeof value === 'object' ? value.options : undefined) ?? { passive: true }
  const handler = typeof value === 'function' || 'handleEvent' in value ? value : value.handler
  const target = self ? el : binding.arg ? document.querySelector(binding.arg) : window

  if (!target) {
    return
  }

  target.addEventListener('scroll', handler, options)

  const onScroll: ScrollDirectiveBindingValueObject = {
    ...el._onScroll,
    handler,
    options,
    target: self ? undefined : target,
  }

  el._onScroll = onScroll
}

function unmounted(el: HTMLElement & { _onScroll?: ScrollDirectiveBindingValueObject }) {
  if (!el._onScroll) {
    return
  }

  const { handler, options, target = el } = el._onScroll

  target.removeEventListener('scroll', handler, options)
  delete el._onScroll
}

const updated = (el: HTMLElement, binding: ScrollDirectiveBinding) => {
  if (binding.value === binding.oldValue) {
    return
  }

  unmounted(el)
  mounted(el, binding)
}

export const scroll: Directive = {
  mounted,
  updated,
  unmounted,
}
