import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import type * as VueUseCore from '@vueuse/core'
import { defineComponent, ref } from 'vue'
import { SApp, SDialog } from '@/app/components'
import { overlayScrollBlockedClassName, overlaysContainerId } from '@/app/constants'

/**
 * On iOS Safari a tap on an element that listens for no click produces no click event at all, so the window-level
 * click-outside handler never hears a tap on the scrim. The handler is switched off here to stand for that: the scrim
 * must close the dialog on its own, and a persistent dialog must still stay open.
 */
vi.mock('@vueuse/core', async (importOriginal) => {
  const original = await importOriginal<typeof VueUseCore>()

  return { ...original, onClickOutside: () => () => undefined }
})

enableAutoUnmount(afterEach)

const DialogPage = defineComponent({
  components: { SApp, SDialog },
  props: { persistent: { type: Boolean, default: false } },
  setup() {
    return { isOpen: ref(false) }
  },
  template: `
    <SApp>
      <SDialog v-model="isOpen" :persistent="persistent">
        <div class="dialogBody">body</div>
      </SDialog>
    </SApp>
  `,
})

describe('SDialog - a tap on the scrim', () => {
  beforeEach(() => {
    const overlaysContainer = document.createElement('div')

    overlaysContainer.id = overlaysContainerId
    document.body.appendChild(overlaysContainer)
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  })

  afterEach(() => {
    document.body.replaceChildren()
    document.documentElement.removeAttribute('style')
    document.documentElement.classList.remove(overlayScrollBlockedClassName)
    vi.restoreAllMocks()
  })

  test.each([
    { name: 'closes a dialog', persistent: false, isOpenAfterTap: false },
    { name: 'leaves a persistent dialog open', persistent: true, isOpenAfterTap: true },
  ])('$name', async ({ persistent, isOpenAfterTap }) => {
    const wrapper = mount(DialogPage, { props: { persistent }, attachTo: document.body })

    await flushPromises()
    wrapper.vm.isOpen = true
    await flushPromises()

    const scrim = document.querySelector<HTMLElement>('.s_overlay__scrim')

    expect(scrim).not.toBeNull()
    scrim?.click()
    await flushPromises()

    expect(wrapper.vm.isOpen).toBe(isOpenAfterTap)
  })
})
