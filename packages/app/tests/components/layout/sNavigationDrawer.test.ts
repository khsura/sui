import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { SApp, SLayout, SMain, SNavigationDrawer } from '@/app/components'
import { overlayScrollBlockedClassName, overlaysContainerId } from '@/app/constants'

// A drawer left mounted keeps reacting to the window (and can hold the page scroll lock) in a later test.
enableAutoUnmount(afterEach)

const layoutName = 'drawerTest'
const desktopWidth = 1280
const navWidth = 240
const chatWidth = 400

const TwoDrawerLayout = defineComponent({
  components: { SApp, SLayout, SMain, SNavigationDrawer },
  setup() {
    const isNavOpen = ref(true)
    const isChatOpen = ref(true)
    const hasNav = ref(true)
    const hasChat = ref(true)
    const chatLocation = ref<'left' | 'right'>('right')

    return { isNavOpen, isChatOpen, hasNav, hasChat, chatLocation, layoutName, navWidth, chatWidth }
  },
  template: `
    <SApp>
    <SLayout :name="layoutName">
      <SNavigationDrawer v-if="hasNav" :for="layoutName" v-model="isNavOpen" :width="navWidth" />
      <SNavigationDrawer v-if="hasChat" :for="layoutName" v-model="isChatOpen" :location="chatLocation" persistent :width="chatWidth" />
      <SMain :for="layoutName">content</SMain>
    </SLayout>
    </SApp>
  `,
})

describe('SNavigationDrawer', () => {
  beforeEach(() => {
    const overlaysContainer = document.createElement('div')

    overlaysContainer.id = overlaysContainerId
    document.body.appendChild(overlaysContainer)
    window.innerWidth = desktopWidth
    // A drawer that closes itself on mobile at mount restores background scrolling from the stored scroll
    // offset; happy-dom reports none, which reads back as NaN.
    Object.defineProperty(window, 'scrollX', { value: 0, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.documentElement.removeAttribute('style')
  })

  test('a left and a right drawer both offset SMain', async () => {
    const wrapper = mount(TwoDrawerLayout, { attachTo: document.body })

    await nextTick()

    const mainStyle = wrapper.find('.s_main').attributes('style')

    expect(mainStyle).toContain(`margin-left: ${navWidth}px`)
    expect(mainStyle).toContain(`margin-right: ${chatWidth}px`)
  })

  test('closing one drawer keeps the other drawer offset', async () => {
    const wrapper = mount(TwoDrawerLayout, { attachTo: document.body })

    wrapper.vm.isNavOpen = false
    await nextTick()

    const mainStyle = wrapper.find('.s_main').attributes('style')

    expect(mainStyle).toContain('margin-left: 0px')
    expect(mainStyle).toContain(`margin-right: ${chatWidth}px`)
  })

  test('unmounting one drawer only resets its own side', async () => {
    const wrapper = mount(TwoDrawerLayout, { attachTo: document.body })

    wrapper.vm.hasChat = false
    await nextTick()

    const mainStyle = wrapper.find('.s_main').attributes('style')

    expect(mainStyle).toContain(`margin-left: ${navWidth}px`)
    expect(mainStyle).toContain('margin-right: 0px')
  })

  test('a drawer added by v-if after mount offsets SMain', async () => {
    const wrapper = mount(TwoDrawerLayout, { attachTo: document.body })

    wrapper.vm.hasChat = false
    await nextTick()
    wrapper.vm.hasChat = true
    await nextTick()

    const mainStyle = wrapper.find('.s_main').attributes('style')

    expect(mainStyle).toContain(`margin-left: ${navWidth}px`)
    expect(mainStyle).toContain(`margin-right: ${chatWidth}px`)
    expect(mainStyle).toContain(`width: calc(100% - ${navWidth + chatWidth}px)`)
  })

  test('toggling both drawers with v-if many times leaves no stale offset', async () => {
    const wrapper = mount(TwoDrawerLayout, { attachTo: document.body })
    const toggleCount = 3

    for (let toggle = 0; toggle < toggleCount; toggle++) {
      wrapper.vm.hasNav = false
      wrapper.vm.hasChat = false
      await nextTick()

      const emptyStyle = wrapper.find('.s_main').attributes('style')

      expect(emptyStyle).toContain('margin-left: 0px')
      expect(emptyStyle).toContain('margin-right: 0px')

      wrapper.vm.hasNav = true
      wrapper.vm.hasChat = true
      await nextTick()

      const fullStyle = wrapper.find('.s_main').attributes('style')

      expect(fullStyle).toContain(`margin-left: ${navWidth}px`)
      expect(fullStyle).toContain(`margin-right: ${chatWidth}px`)
    }
  })

  test('removing a drawer while it is closed keeps the layout at zero', async () => {
    const wrapper = mount(TwoDrawerLayout, { attachTo: document.body })

    wrapper.vm.isChatOpen = false
    await nextTick()
    wrapper.vm.hasChat = false
    await nextTick()
    wrapper.vm.hasChat = true
    await nextTick()

    expect(wrapper.vm.isChatOpen).toBe(false)
    expect(wrapper.find('.s_main').attributes('style')).toContain('margin-right: 0px')
  })

  test('moving a drawer to the other side clears the side it left', async () => {
    const wrapper = mount(TwoDrawerLayout, { attachTo: document.body })

    wrapper.vm.hasNav = false
    await nextTick()
    wrapper.vm.chatLocation = 'left'
    await nextTick()

    const mainStyle = wrapper.find('.s_main').attributes('style')

    expect(mainStyle).toContain(`margin-left: ${chatWidth}px`)
    expect(mainStyle).toContain('margin-right: 0px')
  })

  test('an outside click closes a normal drawer but not a persistent one on desktop', async () => {
    const wrapper = mount(TwoDrawerLayout, { attachTo: document.body })
    const mainElement = wrapper.find('.s_main').element

    await nextTick()
    mainElement.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    mainElement.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(wrapper.vm.isNavOpen).toBe(false)
    expect(wrapper.vm.isChatOpen).toBe(true)
  })

  test('a persistent drawer stays closed on window resize', async () => {
    const wrapper = mount(TwoDrawerLayout, { attachTo: document.body })

    wrapper.vm.isChatOpen = false
    await nextTick()
    window.dispatchEvent(new Event('resize'))
    await nextTick()

    expect(wrapper.vm.isChatOpen).toBe(false)
  })

  test('a drawer whose model starts false opens itself on desktop at mount', async () => {
    const wrapper = mount(SNavigationDrawer, { props: { modelValue: false }, attachTo: document.body })

    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual([true])
  })

  test('a drawer whose model starts true closes itself on mobile at mount', async () => {
    const wrapper = mount(SNavigationDrawer, {
      props: { modelValue: true, forceMobile: true },
      attachTo: document.body,
    })

    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual([false])
  })

  test('a persistent drawer keeps its starting state at mount', async () => {
    const wrapper = mount(SNavigationDrawer, {
      props: { modelValue: false, persistent: true },
      attachTo: document.body,
    })

    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  test('a resizable drawer renders a separator handle', async () => {
    const wrapper = mount(SNavigationDrawer, {
      props: { modelValue: true, resizable: true, width: chatWidth },
      attachTo: document.body,
    })

    await nextTick()

    const handle = wrapper.find('.s_navigationDrawer__resizeHandle')

    expect(handle.exists()).toBe(true)
    expect(handle.attributes('role')).toBe('separator')
    expect(handle.attributes('aria-valuenow')).toBe(String(chatWidth))
  })

  test('the keyboard resize emits update:width', async () => {
    const wrapper = mount(SNavigationDrawer, {
      props: { modelValue: true, resizable: true, width: chatWidth },
      attachTo: document.body,
    })

    await nextTick()
    await wrapper.find('.s_navigationDrawer__resizeHandle').trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:width')?.[0]?.[0]).toBeGreaterThan(chatWidth)
  })
})

/**
 * A mobile drawer pins the page (the html scroll-blocked class) while it is open. Crossing the md breakpoint turns
 * the drawer mobile and closes it in the same tick; the lock and the unlock used to race, leaving the page pinned
 * for good, so nothing on it could scroll after a window resize.
 */
describe('SNavigationDrawer - background scroll lock', () => {
  const ScrollLockLayout = defineComponent({
    components: { SApp, SLayout, SMain, SNavigationDrawer },
    props: { forceMobile: { type: Boolean, default: false }, hasNav: { type: Boolean, default: true } },
    setup() {
      return { isOpen: ref(true), layoutName, navWidth }
    },
    template: `
      <SApp>
      <SLayout :name="layoutName">
        <SNavigationDrawer v-if="hasNav" :for="layoutName" v-model="isOpen" :width="navWidth" :force-mobile="forceMobile" />
        <SMain :for="layoutName">content</SMain>
      </SLayout>
      </SApp>
    `,
  })

  const isPageLocked = () => document.documentElement.classList.contains(overlayScrollBlockedClassName)

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

  test('an open desktop drawer that turns mobile closes and leaves the page scrollable', async () => {
    const wrapper = mount(ScrollLockLayout, { attachTo: document.body })

    await flushPromises()
    await wrapper.setProps({ forceMobile: true })
    await flushPromises()

    expect(wrapper.vm.isOpen).toBe(false)
    expect(isPageLocked()).toBe(false)

    await wrapper.setProps({ forceMobile: false })
    await flushPromises()

    expect(isPageLocked()).toBe(false)
  })

  test('opening a mobile drawer locks the page and closing it unlocks', async () => {
    const wrapper = mount(ScrollLockLayout, { props: { forceMobile: true }, attachTo: document.body })

    await flushPromises()
    wrapper.vm.isOpen = true
    await flushPromises()

    expect(isPageLocked()).toBe(true)

    wrapper.vm.isOpen = false
    await flushPromises()

    expect(isPageLocked()).toBe(false)
  })

  test('unmounting an open mobile drawer releases the page', async () => {
    const wrapper = mount(ScrollLockLayout, { props: { forceMobile: true }, attachTo: document.body })

    await flushPromises()
    wrapper.vm.isOpen = true
    await flushPromises()
    await wrapper.setProps({ hasNav: false })
    await flushPromises()

    expect(isPageLocked()).toBe(false)
  })
})

/**
 * A closed mobile drawer opens on a swipe in from its own edge. The drawer's
 * own listeners can't see it — it is off screen while closed — so the
 * document listens until it opens.
 */
describe('SNavigationDrawer - edge swipe', () => {
  const phoneWidth = 390

  const EdgeLayout = defineComponent({
    components: { SApp, SLayout, SMain, SNavigationDrawer },
    props: { touchless: { type: Boolean, default: false }, forceMobile: { type: Boolean, default: true } },
    setup() {
      return { isOpen: ref(false), layoutName, navWidth }
    },
    template: `
      <SApp>
      <SLayout :name="layoutName">
        <SNavigationDrawer :for="layoutName" v-model="isOpen" location="right" :width="navWidth" :force-mobile="forceMobile" :touchless="touchless" />
        <SMain :for="layoutName">content</SMain>
      </SLayout>
      </SApp>
    `,
  })

  const touch = (type: 'touchstart' | 'touchend', clientX: number) => {
    const event = new Event(type, { bubbles: true })

    Object.defineProperty(event, 'changedTouches', { value: [{ clientX, clientY: 300 }] })
    document.body.dispatchEvent(event)
  }

  const swipe = async (fromX: number, toX: number) => {
    touch('touchstart', fromX)
    touch('touchend', toX)
    await nextTick()
  }

  beforeEach(() => {
    const overlaysContainer = document.createElement('div')

    overlaysContainer.id = overlaysContainerId
    document.body.appendChild(overlaysContainer)
    Object.defineProperty(document.documentElement, 'clientWidth', { value: phoneWidth, configurable: true })
    // A mobile drawer that opens blocks background scrolling and stores the
    // scroll offset; happy-dom reports none, which reads back as NaN.
    Object.defineProperty(window, 'scrollX', { value: 0, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.documentElement.removeAttribute('style')
  })

  test('a swipe left from the right edge opens a closed right drawer', async () => {
    const wrapper = mount(EdgeLayout, { attachTo: document.body })

    await nextTick()
    await swipe(phoneWidth - 8, 200)

    expect(wrapper.vm.isOpen).toBe(true)
  })

  test('a swipe that starts away from the edge leaves it closed, so a sideways scroll keeps its swipe', async () => {
    const wrapper = mount(EdgeLayout, { attachTo: document.body })

    await nextTick()
    await swipe(200, 20)

    expect(wrapper.vm.isOpen).toBe(false)
  })

  test('a short swipe from the edge leaves it closed', async () => {
    const wrapper = mount(EdgeLayout, { attachTo: document.body })

    await nextTick()
    await swipe(phoneWidth - 8, phoneWidth - 60)

    expect(wrapper.vm.isOpen).toBe(false)
  })

  test('a touchless drawer does not open on a swipe', async () => {
    const wrapper = mount(EdgeLayout, { attachTo: document.body, props: { touchless: true } })

    await nextTick()
    await swipe(phoneWidth - 8, 200)

    expect(wrapper.vm.isOpen).toBe(false)
  })

  test('a desktop drawer does not listen for the swipe', async () => {
    window.innerWidth = 1280

    const wrapper = mount(EdgeLayout, { attachTo: document.body, props: { forceMobile: false } })

    await nextTick()
    wrapper.vm.isOpen = false
    await nextTick()
    await swipe(phoneWidth - 8, 200)

    expect(wrapper.vm.isOpen).toBe(false)
  })
})

describe('SNavigationDrawer - scrim', () => {
  // The app's own drawer, as onetab mounts it: no `for`, so it is the app layout's.
  const AppDrawer = defineComponent({
    components: { SApp, SMain, SNavigationDrawer },
    props: { forceMobile: { type: Boolean, default: true }, hideOverlay: { type: Boolean, default: false } },
    setup() {
      return { isOpen: ref(false), navWidth }
    },
    template: `
      <SApp>
        <SNavigationDrawer v-model="isOpen" app :width="navWidth" :force-mobile="forceMobile" :hide-overlay="hideOverlay" />
        <SMain app>content</SMain>
      </SApp>
    `,
  })

  const openDrawer = async (props: Record<string, boolean> = {}) => {
    const wrapper = mount(AppDrawer, { attachTo: document.body, props })

    await nextTick()
    wrapper.vm.isOpen = true
    await nextTick()

    return wrapper
  }

  beforeEach(() => {
    const overlaysContainer = document.createElement('div')

    overlaysContainer.id = overlaysContainerId
    document.body.appendChild(overlaysContainer)
    Object.defineProperty(window, 'scrollX', { value: 0, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.documentElement.removeAttribute('style')
  })

  test('an open mobile app drawer dims the page behind it, and a tap there closes it', async () => {
    const wrapper = await openDrawer()
    const scrim = document.querySelector<HTMLElement>('.s_overlay__scrim')

    expect(scrim).not.toBeNull()

    scrim?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    scrim?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(wrapper.vm.isOpen).toBe(false)
  })

  test('hideOverlay keeps the page undimmed', async () => {
    await openDrawer({ hideOverlay: true })

    expect(document.querySelector('.s_overlay__scrim')).toBeNull()
  })

  test('a desktop drawer draws no scrim', async () => {
    window.innerWidth = desktopWidth

    await openDrawer({ forceMobile: false })

    expect(document.querySelector('.s_overlay__scrim')).toBeNull()
  })

  // The app-shell recipe's drawer: a named layout, so the drawer stays inside it and dims only that layout.
  const NamedLayoutDrawer = defineComponent({
    components: { SApp, SLayout, SMain, SNavigationDrawer },
    // persistent by default, so the drawer keeps its starting open state at mount (a mobile one closes itself otherwise)
    props: {
      forceMobile: { type: Boolean, default: true },
      hideOverlay: { type: Boolean, default: false },
      persistent: { type: Boolean, default: true },
    },
    setup() {
      return { isOpen: ref(true), layoutName, navWidth }
    },
    template: `
      <SApp>
        <SLayout :name="layoutName">
          <SNavigationDrawer
            v-model="isOpen"
            :for="layoutName"
            :width="navWidth"
            :force-mobile="forceMobile"
            :hide-overlay="hideOverlay"
            :persistent="persistent"
          />
          <SMain :for="layoutName">content</SMain>
        </SLayout>
      </SApp>
    `,
  })

  const mountNamedLayoutDrawer = async (props: Record<string, boolean> = {}) => {
    const wrapper = mount(NamedLayoutDrawer, { attachTo: document.body, props })

    await nextTick()

    return wrapper
  }

  test('an open mobile drawer in a named layout dims the layout, and a tap there closes it', async () => {
    const wrapper = await mountNamedLayoutDrawer({ persistent: false })

    wrapper.vm.isOpen = true
    await nextTick()
    const scrim = wrapper.find('.s_layout .s_navigationDrawer__scrim')

    expect(scrim.exists()).toBe(true)

    scrim.element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    scrim.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(wrapper.vm.isOpen).toBe(false)
    expect(wrapper.find('.s_navigationDrawer__scrim').exists()).toBe(false)
  })

  test('a tap on the scrim leaves a persistent mobile drawer in a named layout open', async () => {
    const wrapper = await mountNamedLayoutDrawer()
    const scrim = wrapper.find('.s_layout .s_navigationDrawer__scrim')

    expect(scrim.exists()).toBe(true)

    scrim.element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    scrim.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(wrapper.vm.isOpen).toBe(true)
  })

  test('hideOverlay keeps a named layout undimmed', async () => {
    const wrapper = await mountNamedLayoutDrawer({ hideOverlay: true })

    expect(wrapper.find('.s_navigationDrawer__scrim').exists()).toBe(false)
  })

  test('a desktop drawer in a named layout draws no scrim', async () => {
    window.innerWidth = desktopWidth

    const wrapper = await mountNamedLayoutDrawer({ forceMobile: false })

    expect(wrapper.find('.s_navigationDrawer__scrim').exists()).toBe(false)
  })
})
