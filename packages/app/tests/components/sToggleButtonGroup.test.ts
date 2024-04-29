import { SToggleButton, SToggleButtonGroup, SButton } from '@sui/app/components'
import { propsToggleButtonGroup } from '@sui/app/props'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { useMockProps } from '../_helpers'
import { type PropsToggleButtonGroup } from '@sui/app/definitions'

const argsToggleButtonGroup = useMockProps<PropsToggleButtonGroup>({
  bordered: false,
  dense: false,
  mandatory: false,
  modelValue: [],
  multiple: false,
  outlined: false,
  rounded: false,
  selectedColor: 'primary',
  shrink: false,
  tile: false,
  variant: null,
  nowrap: false,
})

describe('SToggleButtonGroup', () => {
  const getWrapper = () => {
    return mount(
      defineComponent({
        components: {
          SToggleButtonGroup,
          SToggleButton,
        },
        props: propsToggleButtonGroup(),
        setup: (props) => {
          const model = ref(props.modelValue)

          return {
            model,
          }
        },
        template: `
          <SToggleButtonGroup v-bind="$props" v-model="model">
            <SToggleButton name="1" :index="1">1</SToggleButton>
            <SToggleButton name="2" :index="2">2</SToggleButton>
            <SToggleButton name="3" :index="3">2</SToggleButton>
          </SToggleButtonGroup>
        `,
      }),
      {
        props: {
          ...argsToggleButtonGroup(),
          modelValue: [],
        },
      },
    )
  }

  it('dense property work ok', async () => {
    const wrapper = getWrapper()

    await wrapper.setProps(argsToggleButtonGroup({ dense: true }))
    expect(wrapper.find('.s_toggleButtonGroup--dense').exists()).toBe(true)
  })

  it('shrink property work ok', async () => {
    const wrapper = getWrapper()

    await wrapper.setProps(argsToggleButtonGroup({ shrink: true }))
    expect(wrapper.find('.s_toggleButtonGroup--shrink').exists()).toBe(true)
  })

  it('rounded property work ok', async () => {
    const wrapper = getWrapper()

    await wrapper.setProps(argsToggleButtonGroup({ rounded: true }))
    expect(wrapper.find('.s_rounded').exists()).toBe(true)
  })

  it('tile property work ok', async () => {
    const wrapper = getWrapper()

    await wrapper.setProps(argsToggleButtonGroup({ tile: true }))
    expect(wrapper.find('.s_tile').exists()).toBe(true)
  })

  it('bordered property work ok', async () => {
    const wrapper = getWrapper()

    await wrapper.setProps(argsToggleButtonGroup({ bordered: true }))
    expect(wrapper.find('.s_toggleButtonGroup--bordered').exists()).toBe(true)

    await wrapper.setProps(argsToggleButtonGroup({ variant: 'inset', bordered: true }))
    expect(wrapper.find('.s_toggleButtonGroup--bordered').exists()).toBe(false)
  })

  it('multiple prop works ok', async () => {
    const wrapper = getWrapper()

    await wrapper.setProps({ multiple: true })

    const toggleButtons = wrapper.findAllComponents(SButton)

    await toggleButtons.at(0)?.trigger('click')
    expect(wrapper.vm.model).toStrictEqual([1])

    await toggleButtons.at(1)?.trigger('click')
    expect(wrapper.vm.model).toStrictEqual([1, 2])

    await toggleButtons.at(2)?.trigger('click')
    expect(wrapper.vm.model).toStrictEqual([1, 2, 3])

    await toggleButtons.at(1)?.trigger('click')
    expect(wrapper.vm.model).toStrictEqual([1, 3])
  })

  it('mandatory props works ok', async () => {
    const wrapper = getWrapper()

    expect(wrapper.vm.model).toStrictEqual([])

    await wrapper.setProps({ mandatory: true })

    expect(wrapper.vm.model).toStrictEqual([1])
  })
})
