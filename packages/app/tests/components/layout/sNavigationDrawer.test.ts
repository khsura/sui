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
    const hasChat = ref(true)

    return { isNavOpen, isChatOpen, hasChat, layoutName, navWidth, chatWidth }
  },
  template: `
    <SApp>
    <SLayout :name="layoutName">
      <SNavigationDrawer :for="layoutName" v-model="isNavOpen" :width="navWidth" />
      <SNavigationDrawer v-if="hasChat" :for="layoutName" v-model="isChatOpen" location="right" persistent :width="chatWidth" />
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
