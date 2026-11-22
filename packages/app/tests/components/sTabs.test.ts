import { mount } from '@vue/test-utils'
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
