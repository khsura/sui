import { defineComponent, nextTick, ref } from 'vue'
import { SAvatar } from '@/app/components'
import { type PropsAvatar } from '@/app/definitions'
import { mountWithApp } from '@/app/tests/_helpers'

describe('SAvatar', () => {
  const getSAvatar = (props?: Partial<PropsAvatar>) => {
    return mountWithApp(SAvatar, { props: { ...props } })
  }

  test('renders the root class and the default size', () => {
    const wrapper = getSAvatar()

    expect(wrapper.classes('s_avatar')).toBe(true)
    expect(wrapper.attributes('style') ?? '').not.toContain('--s_avatar--size')
  })

  test('shows the image when it is set', () => {
    const wrapper = getSAvatar({ image: '/jane.png', text: 'JD' })
    const image = wrapper.find('img')

    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe('/jane.png')
    expect(image.classes('s_avatar__image')).toBe(true)
    expect(wrapper.text()).toBe('')
  })

  test('falls back to the text when the image fails to load', async () => {
    const wrapper = getSAvatar({ image: '/missing.png', text: 'JD' })

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.s_avatar__text').text()).toBe('JD')
  })

  test('falls back to the icon when the image fails and there is no text', async () => {
    const wrapper = getSAvatar({ image: '/missing.png', icon: 'mdi-domain' })

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('.s_avatar__icon').classes('mdi-domain')).toBe(true)
  })

  test('tries the image again when the image prop changes', async () => {
    const image = ref('/missing.png')

    const wrapper = mountWithApp(
      defineComponent({
        components: { SAvatar },
        setup: () => ({ image }),
        template: '<SAvatar :image="image" text="JD" />',
      }),
    )

    await wrapper.find('img').trigger('error')
    image.value = '/jane.png'
    await nextTick()

    expect(wrapper.find('img').attributes('src')).toBe('/jane.png')
  })

  test('shows the text when there is no image', () => {
    const wrapper = getSAvatar({ text: 'JD' })

    expect(wrapper.find('.s_avatar__text').text()).toBe('JD')
    expect(wrapper.find('.s_avatar__icon').exists()).toBe(false)
  })

  test('shows the default account icon when there is nothing else', () => {
    const wrapper = getSAvatar()

    expect(wrapper.find('.s_avatar__icon').classes('mdi-account')).toBe(true)
  })

  test('the default slot replaces the fallbacks', () => {
    const wrapper = mountWithApp(
      defineComponent({
        components: { SAvatar },
        template: '<SAvatar text="JD"><b class="custom">C</b></SAvatar>',
      }),
    )

    expect(wrapper.find('.custom').exists()).toBe(true)
    expect(wrapper.find('.s_avatar__text').exists()).toBe(false)
  })

  test('alt gives the avatar an accessible name and hides the image from screen readers', () => {
    const wrapper = getSAvatar({ image: '/jane.png', alt: 'Jane Doe' })

    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Jane Doe')
    expect(wrapper.find('img').attributes('alt')).toBe('')
  })

  test('without alt the avatar has no role', () => {
    const wrapper = getSAvatar({ text: 'JD' })

    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('aria-label')).toBeUndefined()
  })

  test('can change the background colour', () => {
    const wrapper = getSAvatar({ color: 'primary' })

    expect(wrapper.classes('s_backgroundColor__primary')).toBe(true)
  })

  test('outlined uses the colour for the text and border', () => {
    const wrapper = getSAvatar({ color: 'primary', outlined: true })

    expect(wrapper.classes('s_avatar--outlined')).toBe(true)
    expect(wrapper.classes('s_backgroundColor__primary')).toBe(false)
  })

  test('can change the size with a preset', () => {
    const wrapper = getSAvatar({ size: 'large' })

    expect(wrapper.classes('s_avatar--size__large')).toBe(true)
  })

  test('can change the size with a number', () => {
    const wrapper = getSAvatar({ size: 64 })

    expect(wrapper.attributes('style')).toContain('--s_avatar--size: 64px')
  })

  test('can change the shape', () => {
    expect(getSAvatar({ borderRadius: 'tile' }).classes('s_avatar--tile')).toBe(true)
    expect(getSAvatar({ borderRadius: 'rounded' }).classes('s_avatar--rounded')).toBe(true)
  })
})
