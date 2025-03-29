import { type Mutable } from '@vueuse/core'
import { reactive } from 'vue'
import { type PropsBorder } from '~/definitions'
import { useBorderService } from '~/services'

describe('positionService', () => {
  const props = reactive<Mutable<PropsBorder>>({
    outlined: null,
    underlined: null,
    tile: null,
    rounded: null,
  })

  beforeEach(() => {
    props.outlined = null
    props.underlined = null
    props.tile = null
    props.rounded = null
  })

  it('can set outlined', () => {
    const service = useBorderService(props)

    expect(service.classListBorder.value).not.toHaveProperty('s_outlined')

    props.outlined = false
    expect(service.classListBorder.value).not.toHaveProperty('s_outlined')

    props.outlined = true
    expect(service.classListBorder.value.s_outlined).toBe(true)
  })

  it('can set underlined', () => {
    const service = useBorderService(props)

    expect(service.classListBorder.value).not.toHaveProperty('s_underlined')

    props.underlined = false
    expect(service.classListBorder.value).not.toHaveProperty('s_underlined')

    props.underlined = true
    expect(service.classListBorder.value.s_underlined).toBe(true)
  })

  it('can set tile', () => {
    const service = useBorderService(props)

    expect(service.classListBorder.value).not.toHaveProperty('s_tile')

    props.tile = false
    expect(service.classListBorder.value).not.toHaveProperty('s_tile')

    props.tile = true
    expect(service.classListBorder.value.s_tile).toBe(true)
  })

  it('can set rounded', () => {
    const service = useBorderService(props)

    expect(service.classListBorder.value).not.toHaveProperty('s_rounded')

    props.rounded = false
    expect(service.classListBorder.value).not.toHaveProperty('s_rounded')

    props.rounded = true
    expect(service.classListBorder.value.s_rounded).toBe(true)
  })

  it('can set custom class', () => {
    const service = useBorderService(props, { block: 'test' })

    expect(service.classListBorder.value).not.toHaveProperty('s_test--rounded')

    props.rounded = false
    expect(service.classListBorder.value).not.toHaveProperty('s_test--rounded')

    props.rounded = true
    expect(service.classListBorder.value['s_test--rounded']).toBe(true)
  })
})
