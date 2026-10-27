import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { SApp, SLayout, SMain, SNavigationDrawer } from '@/app/components'
import { overlaysContainerId } from '@/app/constants'

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
  })

  afterEach(() => {
    document.body.innerHTML = ''
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
