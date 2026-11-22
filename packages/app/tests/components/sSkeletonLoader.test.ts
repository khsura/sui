import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { SApp, SSkeletonLoader } from '@/app/components'
import { type PropsSkeletonLoader } from '@/app/definitions'
import { mountWithApp, readComponentStyle } from '@/app/tests/_helpers'

describe('SSkeletonLoader', () => {
  const getSSkeletonLoader = (props?: Partial<PropsSkeletonLoader>) => {
    return mountWithApp(SSkeletonLoader, { props: { ...props } })
  }

  // mountWithApp does not forward slots, so content tests mount their own SApp wrapper.
  const getSSkeletonLoaderWithContent = (props: Pick<PropsSkeletonLoader, 'loading'>) => {
    const wrapper = mount(
      defineComponent({
        components: { SApp, SSkeletonLoader },
        props: { loading: { type: Boolean, default: false } },
        template: `<SApp><SSkeletonLoader :loading="loading"><p class="content">Loaded</p></SSkeletonLoader></SApp>`,
      }),
      { props },
    )

    return { root: wrapper, skeleton: wrapper.findComponent(SSkeletonLoader) }
  }

  test('renders the root class and a text bone by default', () => {
    const wrapper = getSSkeletonLoader()

    expect(wrapper.classes('s_skeletonLoader')).toBe(true)
    expect(wrapper.findAll('.s_skeletonLoader__bone')).toHaveLength(1)
    expect(wrapper.find('.s_skeletonLoader__text').exists()).toBe(true)
  })

  test('draws the presets of the type string, with repeats', () => {
    const wrapper = getSSkeletonLoader({ type: 'avatar, text@3' })

    expect(wrapper.findAll('.s_skeletonLoader__avatar')).toHaveLength(1)
    expect(wrapper.findAll('.s_skeletonLoader__text')).toHaveLength(3)
  })

  test('nests group presets three levels deep', () => {
    const wrapper = getSSkeletonLoader({ type: 'table' })

    expect(wrapper.find('.s_skeletonLoader__table .s_skeletonLoader__tableRow .s_skeletonLoader__text').exists()).toBe(
      true,
    )
    expect(wrapper.find('.s_skeletonLoader__table').classes('s_skeletonLoader__bone')).toBe(false)
  })

  test('ignores unknown presets', () => {
    const wrapper = getSSkeletonLoader({ type: 'paragraph, button' })

    expect(wrapper.findAll('.s_skeletonLoader__bone')).toHaveLength(1)
    expect(wrapper.find('.s_skeletonLoader__button').exists()).toBe(true)
  })

  test('shows the skeleton while loading and the default slot once loaded', async () => {
    const { root, skeleton } = getSSkeletonLoaderWithContent({ loading: true })

    expect(skeleton.find('.s_skeletonLoader__bones').exists()).toBe(true)
    expect(skeleton.find('.content').exists()).toBe(false)

    await root.setProps({ loading: false })

    expect(skeleton.find('.s_skeletonLoader__bones').exists()).toBe(false)
    expect(skeleton.find('.content').text()).toBe('Loaded')
    expect(skeleton.classes('s_skeletonLoader--loading')).toBe(false)
  })

  test('shows the skeleton without a default slot even when not loading', () => {
    const wrapper = getSSkeletonLoader({ loading: false })

    expect(wrapper.find('.s_skeletonLoader__bones').exists()).toBe(true)
  })

  test('announces one busy status and hides the bones from screen readers', () => {
    const { skeleton: wrapper } = getSSkeletonLoaderWithContent({ loading: true })

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('aria-label')).toBe('Loading…')
    expect(wrapper.find('.s_skeletonLoader__bones').attributes('aria-hidden')).toBe('true')
  })

  test('drops the status attributes once loaded', () => {
    const { skeleton: wrapper } = getSSkeletonLoaderWithContent({ loading: false })

    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
    expect(wrapper.attributes('aria-label')).toBeUndefined()
  })

  test('uses loadingText as the accessible name', () => {
    const wrapper = getSSkeletonLoader({ loadingText: 'Loading orders' })

    expect(wrapper.attributes('aria-label')).toBe('Loading orders')
  })

  test('boilerplate adds the still modifier', () => {
    const wrapper = getSSkeletonLoader({ boilerplate: true })

    expect(wrapper.classes('s_skeletonLoader--boilerplate')).toBe(true)
  })

  test('the theme prop adds the theme class', () => {
    const wrapper = getSSkeletonLoader({ theme: 'dark' })

    expect(wrapper.classes('s_dark')).toBe(true)
  })

  test('measurable props size the root', () => {
    const wrapper = getSSkeletonLoader({ width: 320, maxWidth: '100%', height: 200 })
    const style = wrapper.attributes('style')

    expect(style).toContain('width: 320px')
    expect(style).toContain('max-width: 100%')
    expect(style).toContain('height: 200px')
  })

  test('stops the shimmer for prefers-reduced-motion and for boilerplate', () => {
    const style = readComponentStyle('sSkeletonLoader.vue')

    expect(style).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*&__bone::after \{\s*content: none;/)
    expect(style).toMatch(/&--boilerplate &__bone::after \{\s*content: none;/)
  })

  test('tints the bones from the text colour, so dark mode needs no extra colour', () => {
    expect(readComponentStyle('sSkeletonLoader.vue')).toContain('color-mix(in srgb, currentcolor')
  })
})
