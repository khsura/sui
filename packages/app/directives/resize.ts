import { type Directive } from 'vue'
import { getWindow } from '@khsura/sui/lib/browser'
import { type OnResizeObject, type ResizeDirectiveBinding } from '@khsura/sui/types'

function mounted(el: HTMLElement & { _onResize?: OnResizeObject }, binding: ResizeDirectiveBinding) {
  const handler = binding.value

  const options: AddEventListenerOptions = {
    passive: !binding.modifiers?.active,
  }

  getWindow()?.addEventListener('resize', handler, options)

  el._onResize = {
    ...el._onResize,
    handler,
    options,
  }

  if (!binding.modifiers?.quiet) {
    handler()
  }
}

function unmounted(el: HTMLElement & { _onResize?: OnResizeObject }) {
  if (!el._onResize) {
    return
  }

  const { handler, options } = el._onResize

  getWindow()?.removeEventListener('resize', handler, options)
  delete el._onResize
}

const updated = (el: HTMLElement, binding: ResizeDirectiveBinding) => {
  if (binding.value === binding.oldValue) {
    return
  }

  unmounted(el)
  mounted(el, binding)
}

export const resize: Directive = {
  mounted,
  unmounted,
  updated,
}
