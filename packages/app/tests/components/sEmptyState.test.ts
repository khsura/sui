import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { SApp, SButton, SEmptyState, SIcon } from '@/app/components'
import { type PropsEmptyState } from '@/app/definitions'
import { mountWithApp, readComponentStyle } from '@/app/tests/_helpers'

describe('SEmptyState', () => {
  const getSEmptyState = (props?: Partial<PropsEmptyState>) => {
    return mountWithApp(SEmptyState, { props: { ...props } })
  }

  const mountWithSlots = (template: string) => {
    return mount(
      defineComponent({
        components: { SApp, SEmptyState },
        template: `<SApp>${template}</SApp>`,
      }),
    ).findComponent(SEmptyState)
  }

  test('renders the root class and nothing else when it has no content', () => {
    const wrapper = getSEmptyState()

    expect(wrapper.classes('s_emptyState')).toBe(true)
    expect(wrapper.find('.s_emptyState__media').exists()).toBe(false)
    expect(wrapper.find('.s_emptyState__title').exists()).toBe(false)
    expect(wrapper.find('.s_emptyState__text').exists()).toBe(false)
    expect(wrapper.find('.s_emptyState__actions').exists()).toBe(false)
  })

  test('shows the title and the text', () => {
    const wrapper = getSEmptyState({ title: 'No orders yet', text: 'Orders you create appear here.' })

    expect(wrapper.find('.s_emptyState__title').text()).toBe('No orders yet')
    expect(wrapper.find('.s_emptyState__text').text()).toBe('Orders you create appear here.')
  })

  test('renders the title as text, not as a heading element', () => {
    const wrapper = getSEmptyState({ title: 'No orders yet' })

    expect(wrapper.find('h1, h2, h3, h4, h5, h6').exists()).toBe(false)
  })

  test('shows the icon, hidden from screen readers, in the icon colour', () => {
    const wrapper = getSEmptyState({ icon: 'mdi-inbox-outline', color: 'primary' })
    const icon = wrapper.findComponent(SIcon)

    expect(icon.exists()).toBe(true)
    expect(icon.props('icon')).toBe('mdi-inbox-outline')
    expect(icon.props('color')).toBe('primary')
    expect(icon.attributes('aria-hidden')).toBe('true')
  })

  test('shows a decorative image instead of the icon when both are set', () => {
    const wrapper = getSEmptyState({ image: '/empty.svg', icon: 'mdi-inbox-outline' })
    const image = wrapper.find('img.s_emptyState__image')

    expect(image.attributes('src')).toBe('/empty.svg')
    expect(image.attributes('alt')).toBe('')
    expect(wrapper.findComponent(SIcon).exists()).toBe(false)
  })

  test('shows the action button only with actionText and emits action on click', async () => {
    expect(getSEmptyState().findComponent(SButton).exists()).toBe(false)

    const wrapper = getSEmptyState({ actionText: 'Create order' })
    const button = wrapper.findComponent(SButton)

    expect(button.text()).toBe('Create order')
    await button.trigger('click')

    expect(wrapper.emitted('action')).toHaveLength(1)
    expect(wrapper.emitted('action')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
  })

  test('the action button is a native button, so Tab, Enter and Space work', () => {
    const wrapper = getSEmptyState({ actionText: 'Create order' })

    expect(wrapper.find('.s_emptyState__actions button').exists()).toBe(true)
  })

  test('passes the size to the action button and sets the size class', () => {
    const wrapper = getSEmptyState({ size: 'large', actionText: 'Retry' })

    expect(wrapper.classes('s_emptyState--size__large')).toBe(true)
    expect(wrapper.findComponent(SButton).props('size')).toBe('large')
  })

  test('applies the per-component theme', () => {
    const wrapper = getSEmptyState({ theme: 'dark' })

    expect(wrapper.classes('s_dark')).toBe(true)
  })

  test('the slots replace the props', () => {
    const wrapper = mountWithSlots(`
      <SEmptyState icon="mdi-inbox" title="Prop title" text="Prop text" action-text="Prop action">
        <template #media><span class="custom-media"></span></template>
        <template #title>Slot title</template>
        <template #text>Slot text</template>
        <template #actions><a href="/new" class="custom-action">New</a></template>
        <span class="custom-default">Extra</span>
      </SEmptyState>
    `)

    expect(wrapper.find('.custom-media').exists()).toBe(true)
    expect(wrapper.findComponent(SIcon).exists()).toBe(false)
    expect(wrapper.find('.s_emptyState__title').text()).toBe('Slot title')
    expect(wrapper.find('.s_emptyState__text').text()).toBe('Slot text')
    expect(wrapper.find('.custom-action').exists()).toBe(true)
    expect(wrapper.findComponent(SButton).exists()).toBe(false)
    expect(wrapper.find('.custom-default').exists()).toBe(true)
  })

  test('the slots render without the matching props', () => {
    const wrapper = mountWithSlots(`
      <SEmptyState>
        <template #title>Only a slot title</template>
        <template #actions><button type="button">Retry</button></template>
      </SEmptyState>
    `)

    expect(wrapper.find('.s_emptyState__title').text()).toBe('Only a slot title')
    expect(wrapper.find('.s_emptyState__actions button').text()).toBe('Retry')
  })

  test('wraps long words and caps the media and text width, so it never overflows a phone', () => {
    const style = readComponentStyle('sEmptyState.vue')

    expect(style).toContain('overflow-wrap: anywhere')
    expect(style).toContain('max-width: 100%')
    expect(style).toMatch(/width: min\(map\.get\(\$s_emptyState__image--widths, \$name\), 100%\)/)
  })
})
