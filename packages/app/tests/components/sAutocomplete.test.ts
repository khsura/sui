import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { SAutocomplete } from '@/app/components'
import { mountWithApp } from '@/app/tests/_helpers'

const items = ['Apple', 'Banana', 'Cherry']

const setup = (props: Record<string, unknown> = {}) => {
  const wrapper = mountWithApp(SAutocomplete, { props: { items, ...props } })
  const input = wrapper.find<HTMLInputElement>('.s_autocomplete__input')

  const lastModelUpdate = (): unknown => {
    const events = wrapper.emitted('update:modelValue') as unknown[][] | undefined

    return events?.[events.length - 1]?.[0]
  }

  const type = async (text: string) => {
    await input.setValue(text)
  }

  const enter = async () => {
    await input.trigger('keypress.enter')
    await nextTick()
  }

  return { wrapper, input, type, enter, lastModelUpdate }
}

describe('SAutocomplete - allowUnlisted', () => {
  describe('multiple mode', () => {
    test('typing an unlisted text + Enter adds it to the model', async () => {
      const { type, enter, lastModelUpdate } = setup({
        modelValue: [],
        multiple: true,
        allowUnlisted: true,
      })

      await type('newtag')
      await enter()

      expect(lastModelUpdate()).toEqual(['newtag'])
    })

    test('emits createItem event with the new SelectItem', async () => {
      const { wrapper, type, enter } = setup({
        modelValue: [],
        multiple: true,
        allowUnlisted: true,
      })

      await type('newtag')
      await enter()

      const events = wrapper.emitted('createItem')

      expect(events).toBeTruthy()
      expect(events?.[0]).toEqual([{ text: 'newtag', value: 'newtag' }])
    })

    test('typing a LISTED item still uses the listed item (no createItem)', async () => {
      const { wrapper, type, enter, lastModelUpdate } = setup({
        modelValue: [],
        multiple: true,
        allowUnlisted: true,
      })

      await type('Apple')
      await enter()

      expect(lastModelUpdate()).toEqual(['Apple'])
      expect(wrapper.emitted('createItem')).toBeFalsy()
    })

    test('mixed: listed + unlisted both end up in model', async () => {
      const { wrapper, type, enter, lastModelUpdate } = setup({
        modelValue: [],
        multiple: true,
        allowUnlisted: true,
      })

      await type('Apple')
      await enter()
      await type('newtag')
      await enter()

      expect(lastModelUpdate()).toEqual(['Apple', 'newtag'])
      expect(wrapper.emitted('createItem')).toHaveLength(1)
    })

    test('chip displays the unlisted text after creation', async () => {
      const { wrapper, type, enter } = setup({
        modelValue: [],
        multiple: true,
        chips: true,
        allowUnlisted: true,
      })

      await type('newtag')
      await enter()
      await nextTick()

      const chip = wrapper.find('.s_autocomplete__selectedItem')

      expect(chip.exists()).toBe(true)
      expect(chip.text()).toContain('newtag')
    })
  })

  describe('single mode', () => {
    test('typing an unlisted text + Enter sets model to the typed value', async () => {
      const { type, enter, lastModelUpdate } = setup({
        modelValue: null,
        allowUnlisted: true,
      })

      await type('custom')
      await enter()

      expect(lastModelUpdate()).toBe('custom')
    })

    test('emits createItem in single mode too', async () => {
      const { wrapper, type, enter } = setup({
        modelValue: null,
        allowUnlisted: true,
      })

      await type('custom')
      await enter()

      expect(wrapper.emitted('createItem')?.[0]).toEqual([{ text: 'custom', value: 'custom' }])
    })
  })

  describe('disabled (allowUnlisted=false)', () => {
    test('typing an unlisted text drops it (existing behavior preserved)', async () => {
      const { wrapper, type, enter, lastModelUpdate } = setup({
        modelValue: [],
        multiple: true,
      })

      await type('newtag')
      await enter()

      expect(lastModelUpdate() ?? []).toEqual([])
      expect(wrapper.emitted('createItem')).toBeFalsy()
    })
  })

  // Dropdown-rendered behavior (the "Add 'foo'" option, checkbox click semantics)
  // is verified in Storybook with the Playwright runner — happy-dom doesn't render
  // the SOverlay teleport target so dropdown DOM isn't queryable here.

  describe('edge cases', () => {
    test('empty / whitespace input does not create an item', async () => {
      const { wrapper, type, enter, lastModelUpdate } = setup({
        modelValue: [],
        multiple: true,
        allowUnlisted: true,
      })

      await type('   ')
      await enter()

      expect(lastModelUpdate() ?? []).toEqual([])
      expect(wrapper.emitted('createItem')).toBeFalsy()
    })

    test('trims surrounding whitespace from the created item', async () => {
      const { wrapper, type, enter, lastModelUpdate } = setup({
        modelValue: [],
        multiple: true,
        allowUnlisted: true,
      })

      await type('  spaced  ')
      await enter()

      expect(lastModelUpdate()).toEqual(['spaced'])
      expect(wrapper.emitted('createItem')?.[0]).toEqual([{ text: 'spaced', value: 'spaced' }])
    })
  })
})

describe('SAutocomplete - label', () => {
  test('draws the label above the field and ties it to the input', () => {
    const { wrapper, input } = setup({ label: 'Employee' })
    const label = wrapper.find('.s_autocomplete__label')

    expect(label.text()).toBe('Employee')
    expect(input.attributes('id')).toBeTruthy()
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  test('uses the given id for the input and the label', () => {
    const { wrapper, input } = setup({ label: 'Employee', id: 'employee-picker' })

    expect(input.attributes('id')).toBe('employee-picker')
    expect(wrapper.find('.s_autocomplete__label').attributes('for')).toBe('employee-picker')
  })

  test('draws no label when none is given', () => {
    const { wrapper } = setup()

    expect(wrapper.find('.s_autocomplete__label').exists()).toBe(false)
  })

  test('hides the label under hideDetails, as SSelect does', () => {
    const { wrapper } = setup({ label: 'Employee', hideDetails: true })

    expect(wrapper.find('.s_autocomplete__label').attributes('style')).toContain('display: none')
  })
})

describe('SAutocomplete - menu placed above the field', () => {
  const ROW_HEIGHT = 40
  const VIEWPORT_HEIGHT = 800
  const FIELD_TOP = 700
  const FIELD_HEIGHT = 40
  const manyItems = Array.from({ length: 12 }, (_, index) => `Fruit ${index}`)
  const restorers: (() => void)[] = []

  beforeEach(() => {
    vi.stubGlobal('innerHeight', VIEWPORT_HEIGHT)

    const offsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')

    // jsdom lays nothing out: the list is as tall as its rows.
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get(this: HTMLElement) {
        return this.classList.contains('s_autocomplete__list')
          ? this.querySelectorAll('.s_listItem').length * ROW_HEIGHT
          : 0
      },
    })
    restorers.push(() => {
      if (offsetHeight) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', offsetHeight)
    })

    const rect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: FIELD_TOP,
      bottom: FIELD_TOP + FIELD_HEIGHT,
      left: 0,
      right: 300,
      width: 300,
      height: FIELD_HEIGHT,
      x: 0,
      y: FIELD_TOP,
      toJSON: () => ({}),
    })

    restorers.push(() => rect.mockRestore())
  })

  afterEach(() => {
    restorers.splice(0).forEach((restore) => restore())
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  const menuBottom = () => {
    const list = document.querySelector<HTMLElement>('.s_autocomplete__list')

    if (!list) throw new Error('the menu is not open')

    return Number.parseFloat(list.style.top) + list.offsetHeight
  }

  test('stays on the field as typing shortens the list', async () => {
    const wrapper = mountWithApp(SAutocomplete, { props: { items: manyItems }, attachTo: document.body })
    const input = wrapper.find<HTMLInputElement>('.s_autocomplete__input')

    await input.trigger('focus')
    await flushPromises()

    expect(menuBottom()).toBe(FIELD_TOP)

    // Fruit 1, 10 and 11: still too tall for the room below, so still above.
    await input.setValue('fruit 1')
    await flushPromises()

    expect(document.querySelectorAll('.s_autocomplete__list .s_listItem')).toHaveLength(3)
    expect(menuBottom()).toBe(FIELD_TOP)
  })
})

describe('SAutocomplete - native autocomplete attribute', () => {
  test('turns the browser form history off by default, so only its menu opens', () => {
    const { input } = setup()

    expect(input.attributes('autocomplete')).toBe('off')
  })

  test('keeps an autocomplete value the caller passes', () => {
    const { input } = setup({ autocomplete: 'on' })

    expect(input.attributes('autocomplete')).toBe('on')
  })
})
