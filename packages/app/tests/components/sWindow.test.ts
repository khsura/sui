import { defineComponent, nextTick, ref } from 'vue'
import * as sui from '@/app/index'
import { mountWithApp } from '@/app/tests/_helpers'

const mountWindow = (initial: string | null) => {
  const active = ref<string | null>(initial)

  const wrapper = mountWithApp(
    defineComponent({
      components: { SWindow: sui.SWindow, SWindowItem: sui.SWindowItem },
      setup: () => ({ active }),
      template: `
        <SWindow v-model="active" selected-class="is-active">
          <SWindowItem value="summary">Summary panel</SWindowItem>
          <SWindowItem value="details">Details panel</SWindowItem>
        </SWindow>
      `,
    }),
  )

  return { wrapper, active }
}

describe('SWindow', () => {
  test('is part of the public API', () => {
    expect(sui.SWindow).toBeDefined()
    expect(sui.SWindowItem).toBeDefined()
  })

  test('shows the item whose value matches v-model', async () => {
    const { wrapper, active } = mountWindow('details')

    await nextTick()

    expect(wrapper.find('.s_windowItem.is-active').text()).toBe('Details panel')
    expect(active.value).toBe('details')
  })

  test('applies a CSS color as an inline style on the root', () => {
    const wrapper = mountWithApp(sui.SWindow, { props: { color: '#1a2b49' } })

    expect(wrapper.find('.s_window').attributes('style')).toContain('background-color')
  })

  test('selects the first item when v-model names no item', async () => {
    const { wrapper, active } = mountWindow(null)

    await nextTick()

    expect(wrapper.find('.s_windowItem.is-active').text()).toBe('Summary panel')
    expect(active.value).toBe('summary')
  })
})
