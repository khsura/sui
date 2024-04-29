import { wait } from '@sui/app/lib/wait'
import { useModelService } from '@sui/app/services'

const defaultEmit = () => {}

describe('useModelService', () => {
  test('Output model matches prop modelValue', () => {
    const props = {
      modelValue: true,
    }

    const model = useModelService(props, defaultEmit)

    expect(model.value).toBe(true)
  })

  test('Updating model should emit the appropriate event', () => {
    const props = {
      modelValue: true,
    }

    let eventEmitted = false

    const emit = () => {
      eventEmitted = true
    }

    const model = useModelService(props, emit)

    model.value = false
    expect(eventEmitted).toBe(true)
  })

  test('Parsing is correct when value is an object', () => {
    const props = {
      modelValue: { myProperty: '01' },
    }

    const newValue = { myProperty: '02' }
    const model = useModelService(props, defaultEmit, 'modelValue')

    expect(model.value.myProperty).toBe('01')
    model.value = newValue
    expect(model.value.myProperty).toBe('02')
  })

  test('No Parsing Option when value is an array', () => {
    const props = {
      modelValue: [1, 2, 3, 4],
    }

    const options = {
      noParsing: true,
    }

    const newValue = [5, 6, 7, 8, 9]
    const model = useModelService(props, defaultEmit, 'modelValue', options)

    expect(model.value).toEqual([1, 2, 3, 4])
    model.value = newValue
    expect(model.value).toEqual([5, 6, 7, 8, 9])
  })

  test('No Parsing Option when value is an object', () => {
    const props = {
      modelValue: { myProperty: 'hello' },
    }

    const options = {
      noParsing: true,
    }

    const newValue = { myProperty: 'goodbye' }
    const model = useModelService(props, defaultEmit, 'modelValue', options)

    expect(model.value.myProperty).toBe('hello')
    model.value = newValue
    expect(model.value.myProperty).toBe('goodbye')
  })

  test('custom model value key', () => {
    const props = {
      customKey: { myProperty: 'hello' },
    }

    const options = {
      noParsing: true,
    }

    const newValue = { myProperty: 'goodbye' }
    const model = useModelService(props, defaultEmit, 'customKey', options)

    expect(model.value.myProperty).toBe('hello')
    model.value = newValue
    expect(model.value.myProperty).toBe('goodbye')
  })

  test('onChange option', async () => {
    const props = {
      modelValue: 'bar',
    }

    const onChange = vi.fn()

    const options: Parameters<typeof useModelService>[3] = {
      onChange,
    }

    const newValue = 'foo'
    const model = useModelService(props, defaultEmit, 'modelValue', options)

    expect(model.value).toEqual('bar')
    model.value = newValue

    expect(model.value).toEqual('foo')
    await wait(100)
    expect(onChange.mock.calls[0]).toStrictEqual(['foo', 'bar'])
  })
})
