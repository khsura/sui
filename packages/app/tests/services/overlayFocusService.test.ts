import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref, useTemplateRef } from 'vue'
import { useOverlayFocusService } from '../../services/overlayFocusService'

const createOverlay = (options: { trapFocus: boolean; persistent?: boolean }) => {
  const model = ref(false)

  const component = defineComponent({
    setup() {
      const activator = useTemplateRef<HTMLElement>('activator')
      const content = useTemplateRef<HTMLElement>('content')

      useOverlayFocusService(
        model,
        { activator, content },
        { canCloseOnEscape: () => !options.persistent, trapFocus: options.trapFocus },
      )

      return { model }
    },
    template: `
      <div>
        <button ref="activator" class="activator">open</button>
        <div v-if="model" ref="content" tabindex="-1">
          <button class="first">first</button>
          <button class="last">last</button>
        </div>
      </div>
    `,
  })

  const wrapper = mount(component, { attachTo: document.body })

  return { model, wrapper }
}

const pressKey = (key: string, shiftKey = false) => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }))
}

describe('useOverlayFocusService', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  test('a trapping overlay moves focus to its first focusable element on open', async () => {
    const { model, wrapper } = createOverlay({ trapFocus: true })

    model.value = true
    await nextTick()
    await nextTick()

    expect(document.activeElement).toBe(wrapper.find('.first').element)
    wrapper.unmount()
  })

  test('Esc closes the overlay and focus returns to the activator', async () => {
    const { model, wrapper } = createOverlay({ trapFocus: true })

    model.value = true
    await nextTick()
    await nextTick()
    pressKey('Escape')
    await nextTick()

    expect(model.value).toBe(false)
    expect(document.activeElement).toBe(wrapper.find('.activator').element)
    wrapper.unmount()
  })

  test('Esc does not close a persistent overlay', async () => {
    const { model, wrapper } = createOverlay({ trapFocus: true, persistent: true })

    model.value = true
    await nextTick()
    pressKey('Escape')
    await nextTick()

    expect(model.value).toBe(true)
    wrapper.unmount()
  })

  test('Tab from the last element wraps to the first, Shift+Tab from the first wraps to the last', async () => {
    const { model, wrapper } = createOverlay({ trapFocus: true })

    model.value = true
    await nextTick()
    await nextTick()

    const first = wrapper.find<HTMLElement>('.first').element
    const last = wrapper.find<HTMLElement>('.last').element

    last.focus()
    pressKey('Tab')
    expect(document.activeElement).toBe(first)

    pressKey('Tab', true)
    expect(document.activeElement).toBe(last)
    wrapper.unmount()
  })

  test('Esc closes only the innermost of two open overlays', async () => {
    const outer = createOverlay({ trapFocus: true })
    const inner = createOverlay({ trapFocus: false })

    outer.model.value = true
    await nextTick()
    inner.model.value = true
    await nextTick()

    pressKey('Escape')
    await nextTick()

    expect(inner.model.value).toBe(false)
    expect(outer.model.value).toBe(true)

    pressKey('Escape')
    await nextTick()

    expect(outer.model.value).toBe(false)
    outer.wrapper.unmount()
    inner.wrapper.unmount()
  })
})
