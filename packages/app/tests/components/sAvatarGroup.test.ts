import { defineComponent } from 'vue'
import { SAvatar, SAvatarGroup } from '@/app/components'
import { type PropsAvatarGroup } from '@/app/definitions'
import { mountWithApp } from '@/app/tests/_helpers'

const initials = ['AA', 'BB', 'CC', 'DD', 'EE']

describe('SAvatarGroup', () => {
  const getSAvatarGroup = (props?: Partial<PropsAvatarGroup>, moreSlot?: string) => {
    const host = defineComponent({
      components: { SAvatar, SAvatarGroup },
      setup() {
        return { props, initials }
      },
      template: `
        <SAvatarGroup v-bind="props">
          <SAvatar v-for="text in initials" :key="text" :text="text"></SAvatar>
          ${moreSlot ? `<template #more="{ count }">${moreSlot}</template>` : ''}
        </SAvatarGroup>
      `,
    })

    return mountWithApp(host)
  }

  test('renders every avatar in a group', () => {
    const wrapper = getSAvatarGroup()
    const group = wrapper.find('.s_avatarGroup')

    expect(group.attributes('role')).toBe('group')
    expect(group.findAll('.s_avatar')).toHaveLength(initials.length)
    expect(group.find('.s_avatarGroup__more').exists()).toBe(false)
  })

  test('max collapses the rest into a "+N" avatar', () => {
    const wrapper = getSAvatarGroup({ max: 2 })
    const avatars = wrapper.findAll('.s_avatar')
    const more = wrapper.find('.s_avatarGroup__more')

    expect(avatars).toHaveLength(3)
    expect(avatars[1].text()).toBe('BB')
    expect(more.text()).toBe('+3')
    expect(more.attributes('aria-label')).toBe('3 more')
  })

  test('max larger than the avatar count shows every avatar', () => {
    const wrapper = getSAvatarGroup({ max: 10 })

    expect(wrapper.findAll('.s_avatar')).toHaveLength(initials.length)
    expect(wrapper.find('.s_avatarGroup__more').exists()).toBe(false)
  })

  test('moreLabel changes the accessible name of the "+N" avatar', () => {
    const wrapper = getSAvatarGroup({ max: 1, moreLabel: '{count} more people' })

    expect(wrapper.find('.s_avatarGroup__more').attributes('aria-label')).toBe('4 more people')
  })

  test('the color applies to the "+N" avatar', () => {
    const wrapper = getSAvatarGroup({ max: 1, color: 'primary' })

    expect(wrapper.find('.s_avatarGroup__more').classes('s_backgroundColor__primary')).toBe(true)
  })

  test('the more slot replaces the "+N" avatar and gets the count', () => {
    const wrapper = getSAvatarGroup({ max: 3 }, '<span class="custom-more">and {{ count }} others</span>')

    expect(wrapper.find('.s_avatarGroup__more').exists()).toBe(false)
    expect(wrapper.find('.custom-more').text()).toBe('and 2 others')
  })

  test('the group size applies to avatars without their own size', () => {
    const wrapper = getSAvatarGroup({ size: 'small' })

    expect(wrapper.findAll('.s_avatar--size__small')).toHaveLength(initials.length)
  })

  test('the group size sets the overlap size on the group', () => {
    expect(getSAvatarGroup({ size: 'large' }).find('.s_avatarGroup').classes('s_avatarGroup--size__large')).toBe(true)
    expect(getSAvatarGroup({ size: 64 }).find('.s_avatarGroup').attributes('style')).toContain('--s-avatar-size: 64px')
  })
})
