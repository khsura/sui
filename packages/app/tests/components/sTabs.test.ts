import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { SApp, STab, STabs } from '@/app/components'

const mountTabs = () => {
  const selected = ref<number | string>(0)

  const wrapper = mount(
    defineComponent({
      components: { SApp, STab, STabs },
      setup: () => ({ selected }),
      template: `
        <SApp>
          <STabs v-model="selected">
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
  const scrollStepRatio = 0.8

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

  const mountWithMetrics = async (scrollWidth: number) => {
    const { wrapper } = mountTabs()
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

  test('shows no fade and no arrows when every tab fits', async () => {
    const { wrapper } = await mountWithMetrics(visibleWidth)

    expect(wrapper.find('.s_tabs').classes()).not.toContain('s_tabs--endHidden')
    expect(wrapper.find('.s_tabs__scrollButton').exists()).toBe(false)
    wrapper.unmount()
  })

  test('shows the end arrow when tabs hide past the right edge, and the arrow scrolls the row', async () => {
    const { wrapper, scroller } = await mountWithMetrics(contentWidth)
    const endButton = wrapper.find('.s_tabs__scrollButton--end')

    expect(wrapper.find('.s_tabs').classes()).toContain('s_tabs--endHidden')
    expect(wrapper.find('.s_tabs__scrollButton--start').exists()).toBe(false)
    expect(endButton.attributes('aria-hidden')).toBe('true')
    expect(endButton.attributes('tabindex')).toBe('-1')

    // Reduced motion makes the arrow jump, so the new position can be read straight away.
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }))
    await endButton.trigger('click')
    expect(scroller.scrollLeft).toBe(visibleWidth * scrollStepRatio)

    scroller.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.find('.s_tabs__scrollButton--start').exists()).toBe(true)
    expect(wrapper.find('.s_tabs__scrollButton--end').exists()).toBe(true)
    wrapper.unmount()
  })
})
