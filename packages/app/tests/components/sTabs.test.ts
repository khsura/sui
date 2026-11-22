import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { SApp, STab, STabs } from '@/app/components'
import { tabsScrollStepRatio } from '@/app/constants'

const mountTabs = (wrap = false, showArrows = false) => {
  const selected = ref<number | string>(0)

  const wrapper = mount(
    defineComponent({
      components: { SApp, STab, STabs },
      setup: () => ({ selected, wrap, showArrows }),
      template: `
        <SApp>
          <STabs v-model="selected" :wrap="wrap" :show-arrows="showArrows">
            <STab :tab="0">One</STab>
            <STab :tab="1">Two</STab>
            <STab :tab="2">Three</STab>
          </STabs>
        </SApp>
      `,
    }),
    { attachTo: document.body },
  )

  return { wrapper, selected }
}

describe('STabs', () => {
  test('renders a tablist of tabs with one Tab stop: the selected tab', () => {
    const { wrapper } = mountTabs()
    const tabs = wrapper.findAll('[role="tab"]')

    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    expect(tabs.map((tab) => tab.attributes('aria-selected'))).toEqual(['true', 'false', 'false'])
    expect(tabs.map((tab) => tab.attributes('tabindex'))).toEqual(['0', '-1', '-1'])
    wrapper.unmount()
  })

  test('arrow keys, Home and End move focus and select, wrapping around', async () => {
    const { wrapper, selected } = mountTabs()
    const getTab = (index: number) => wrapper.findAll<HTMLElement>('[role="tab"]')[index]

    await getTab(0)?.trigger('keydown', { key: 'ArrowRight' })
    expect(selected.value).toBe(1)
    expect(document.activeElement).toBe(getTab(1)?.element)

    await getTab(1)?.trigger('keydown', { key: 'End' })
    expect(selected.value).toBe(2)

    await getTab(2)?.trigger('keydown', { key: 'ArrowRight' })
    expect(selected.value).toBe(0)

    await getTab(0)?.trigger('keydown', { key: 'ArrowLeft' })
    expect(selected.value).toBe(2)

    await getTab(2)?.trigger('keydown', { key: 'Home' })
    await nextTick()
    expect(selected.value).toBe(0)
    expect(getTab(0)?.attributes('tabindex')).toBe('0')
    wrapper.unmount()
  })
})

describe('STabs overflow affordance', () => {
  const visibleWidth = 300
  const contentWidth = 900

  // jsdom has no layout: give the row of tabs fixed metrics and a writable scroll position.
  const fakeScroller = (scroller: HTMLElement, scrollWidth: number) => {
    let scrollLeft = 0

    Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: visibleWidth })
    Object.defineProperty(scroller, 'scrollWidth', { configurable: true, value: scrollWidth })
    Object.defineProperty(scroller, 'scrollLeft', {
      configurable: true,
      get: () => scrollLeft,
      set: (value: number) => {
        scrollLeft = value
      },
    })
  }

  const mountWithMetrics = async (scrollWidth: number, wrap = false, showArrows = false) => {
    const { wrapper } = mountTabs(wrap, showArrows)
    const scroller = wrapper.find<HTMLElement>('.s_toggleButtonGroup__content').element

    fakeScroller(scroller, scrollWidth)
    // The scroll listener attaches once the template ref settles after mount.
    await flushPromises()
    scroller.dispatchEvent(new Event('scroll'))
    await nextTick()

    return { wrapper, scroller }
  }

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('shows no fade when every tab fits', async () => {
    const { wrapper } = await mountWithMetrics(visibleWidth)

    expect(wrapper.find('.s_tabs').classes()).not.toContain('s_tabs--endHidden')
    wrapper.unmount()
  })

  test('fades the ends that hide tabs, with no scroll buttons: the row is swiped', async () => {
    const { wrapper, scroller } = await mountWithMetrics(contentWidth)

    expect(wrapper.find('.s_tabs').classes()).toContain('s_tabs--endHidden')
    expect(wrapper.find('.s_tabs').classes()).not.toContain('s_tabs--startHidden')
    expect(wrapper.find('.s_tabs button[aria-hidden="true"]').exists()).toBe(false)

    scroller.scrollLeft = visibleWidth
    scroller.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.find('.s_tabs').classes()).toEqual(
      expect.arrayContaining(['s_tabs--startHidden', 's_tabs--endHidden']),
    )
    wrapper.unmount()
  })

  test('wrap lays the tabs out on several rows: no fade even when they overflow', async () => {
    const { wrapper } = await mountWithMetrics(contentWidth, true)
    const classes = wrapper.find('.s_tabs').classes()

    expect(classes).toContain('s_tabs--wrap')
    expect(classes).not.toContain('s_tabs--endHidden')
    wrapper.unmount()
  })

  test('showArrows adds a pointer-only arrow at each end that hides tabs, and the arrow scrolls the row', async () => {
    const { wrapper, scroller } = await mountWithMetrics(contentWidth, false, true)
    const endButton = wrapper.find('.s_tabs__scrollButton--end')

    expect(wrapper.find('.s_tabs__scrollButton--start').exists()).toBe(false)
    expect(endButton.attributes('aria-hidden')).toBe('true')
    expect(endButton.attributes('tabindex')).toBe('-1')

    // Reduced motion makes the arrow jump, so the new position can be read straight away.
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }))
    await endButton.trigger('click')
    expect(scroller.scrollLeft).toBe(visibleWidth * tabsScrollStepRatio)

    scroller.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.find('.s_tabs__scrollButton--start').exists()).toBe(true)
    wrapper.unmount()
  })

  test('shows no arrows without showArrows, nor with wrap', async () => {
    const plain = await mountWithMetrics(contentWidth)
    const wrapped = await mountWithMetrics(contentWidth, true, true)

    expect(plain.wrapper.find('.s_tabs__scrollButton').exists()).toBe(false)
    expect(wrapped.wrapper.find('.s_tabs__scrollButton').exists()).toBe(false)
    plain.wrapper.unmount()
    wrapped.wrapper.unmount()
  })
})
