import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { SSlideGroup, SSlideItem } from '@khsura/sui/components'
import { type PropsSlideGroup } from '@khsura/sui/definitions'
import { propsSlideGroup } from '@khsura/sui/props'

describe('SSlideGroup', () => {
  const getWrapper = (props: Partial<PropsSlideGroup> = {}) => {
    return mount(
      defineComponent({
        components: { SSlideGroup, SSlideItem },
        props: propsSlideGroup(),
        setup: () => {
          const model = ref<string[]>([])

          return {
            model,
          }
        },
        template: `
        <SSlideGroup v-bind="$props" v-model="model">
          <SSlideItem index="first">1</SSlideItem>
          <SSlideItem index="second">1</SSlideItem>
          <SSlideItem index="third">1</SSlideItem>
        </SSlideGroup>
      `,
      }),
      {
        props,
      },
    )
  }

  test('scrollable props work ok', async () => {
    const wrapper = getWrapper()

    await wrapper.setProps({ scrollable: false })

    expect(wrapper.find('.s_slideGroup__navigator').exists()).toBe(true)
  })

  test('scrollable props work ok', async () => {
    const wrapper = getWrapper()

    await wrapper.setProps({ scrollable: true })

    expect(wrapper.find('.s_slideGroup__navigator').exists()).toBe(false)
  })

  test('mandatory prop sets modelValue to first item', () => {
    const wrapper = getWrapper({ mandatory: true })

    expect(wrapper.vm.model).toStrictEqual(['first'])
  })

  test('when mandatory changes to true, modelValue is set to first item', async () => {
    const wrapper = getWrapper()

    await wrapper.setProps({ mandatory: true })

    expect(wrapper.vm.model).toStrictEqual(['first'])
  })

  test('when mandatory props is true, can not deselect all items', async () => {
    const wrapper = getWrapper({ mandatory: true })

    await wrapper.findAllComponents(SSlideItem)[0].trigger('click')

    expect(wrapper.vm.model).toStrictEqual(['first'])
  })

  test('when mandatory props is false, can deselect all items', async () => {
    const wrapper = getWrapper({ mandatory: false })

    await wrapper.findAllComponents(SSlideItem)[0].trigger('click')

    expect(wrapper.vm.model).toStrictEqual(['first'])

    await wrapper.findAllComponents(SSlideItem)[0].trigger('click')

    expect(wrapper.vm.model).toStrictEqual([])
  })
})
