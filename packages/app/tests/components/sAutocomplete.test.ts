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
