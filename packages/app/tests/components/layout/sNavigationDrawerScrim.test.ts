import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import type * as VueUseCore from '@vueuse/core'
import { defineComponent, ref } from 'vue'
import { SApp, SLayout, SMain, SNavigationDrawer } from '@/app/components'
import { overlayScrollBlockedClassName, overlaysContainerId } from '@/app/constants'

/**
 * On iOS Safari a tap on an element that listens for no click (and has no clicking ancestor) produces no click event
 * at all, so the window-level click-outside handler never hears a tap on the scrim and an open mobile drawer stayed
 * open. The handler is switched off here to stand for that: the scrim must close the drawer on its own.
 */
vi.mock('@vueuse/core', async (importOriginal) => {
  const original = await importOriginal<typeof VueUseCore>()

  return { ...original, onClickOutside: () => () => undefined }
})

enableAutoUnmount(afterEach)

const layoutName = 'scrimTest'
const desktopWidth = 1280

const DrawerLayout = defineComponent({
  components: { SApp, SLayout, SMain, SNavigationDrawer },
  props: { inLayout: { type: Boolean, default: false } },
  setup() {
    return { isOpen: ref(false), layoutName }
  },
  template: `
    <SApp>
      <SLayout v-if="inLayout" :name="layoutName">
        <SNavigationDrawer :for="layoutName" v-model="isOpen" force-mobile />
        <SMain :for="layoutName">content</SMain>
      </SLayout>
      <template v-else>
        <SNavigationDrawer v-model="isOpen" force-mobile />
        <SMain>content</SMain>
      </template>
    </SApp>
  `,
})

describe('SNavigationDrawer - a tap on the scrim closes the mobile drawer', () => {
  beforeEach(() => {
    const overlaysContainer = document.createElement('div')

    overlaysContainer.id = overlaysContainerId
    document.body.appendChild(overlaysContainer)
    window.innerWidth = desktopWidth
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.documentElement.removeAttribute('style')
    document.documentElement.classList.remove(overlayScrollBlockedClassName)
    vi.restoreAllMocks()
  })

  test.each([
    { name: 'an app drawer (scrim in the overlay)', inLayout: false, scrim: '.s_overlay__scrim' },
    { name: 'a layout drawer (scrim in the layout)', inLayout: true, scrim: '.s_navigationDrawer__scrim' },
  ])('$name', async ({ inLayout, scrim }) => {
    const wrapper = mount(DrawerLayout, { props: { inLayout }, attachTo: document.body })

    await flushPromises()
    wrapper.vm.isOpen = true
    await flushPromises()

    const scrimElement = document.querySelector<HTMLElement>(scrim)

    expect(scrimElement).not.toBeNull()
    scrimElement?.click()
    await flushPromises()

    expect(wrapper.vm.isOpen).toBe(false)
  })
})
