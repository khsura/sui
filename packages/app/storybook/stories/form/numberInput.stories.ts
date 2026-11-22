import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import { expect, userEvent, waitFor } from 'storybook/test'
import { SButton, SForm, SFormRow, SNumberInput } from '@/app/index'
import { argTypesNumberInput } from '@/app/storybook/argTypes'
import { createStoryObj } from '@/app/storybook/helpers'

const numberInput: Meta<typeof SNumberInput> = {
  title: 'UI Components/Form/NumberInput',
  component: SNumberInput,
  tags: ['a11y'],
  argTypes: argTypesNumberInput,
}

export default numberInput

export const NumberInput = createStoryObj<typeof SNumberInput>({
  args: {
    label: 'Quantity',
    placeholder: 'Enter a quantity',
    min: 0,
    max: 100,
    step: 1,
    precision: 0,
    controlVariant: 'stacked',
    hideControls: false,
    prefix: undefined,
    suffix: undefined,
    textRight: false,
    disabled: false,
    readonly: false,
    hideDetails: false,
    hideError: false,
    dense: false,
    tile: false,
    size: null,
  },
  render: (args) =>
    defineComponent({
      components: { SNumberInput },
      setup() {
        const quantity = ref<number | null>(1)

        return { args, quantity }
      },
      template: /* html */ `
        <SNumberInput v-bind="args" v-model="quantity"></SNumberInput>
        <div class="s_pa__4">v-model: <span data-testid="model">{{ JSON.stringify(quantity) }}</span></div>
      `,
    }),
})

// Sub-pixel rounding allowed in the geometry checks.
const pixelTolerance = 1
const longLabel = 'A very long label for a number field that keeps going to check how it wraps on a phone'
const minimumOneRule = (value?: unknown) => (typeof value === 'number' && value >= 1) || 'Enter at least 1'

const getRect = (element: Element | null | undefined) => {
  if (!element) {
    throw new Error('NumberInputStress: an expected element did not render')
  }

  return element.getBoundingClientRect()
}

const getElement = (parent: Element, selector: string) => {
  const element = parent.querySelector(selector)

  if (!element) {
    throw new Error(`NumberInputStress: ${selector} did not render`)
  }

  return element
}

// The cases AI code gets wrong with numeric fields, in one story so the visual harness stays fast: both control
// layouts, no controls, money with a prefix and two decimals, a percentage suffix, a value below `min`, every size,
// disabled and read-only, a validation error, a long label, and a row of fields with a button at 375 px.
// A plain object literal, so Storybook's static indexer reads the `visual` tag.
export const NumberInputStress = {
  tags: ['visual'],
  render: () => ({
    components: { SButton, SForm, SFormRow, SNumberInput },
    setup() {
      const stacked = ref<number | null>(3)
      const split = ref<number | null>(2)
      const price = ref<number | null>(12500)
      const percent = ref<number | null>(10)
      const zero = ref<number | null>(0)
      const atMax = ref<number | null>(10)
      const empty = ref<number | null>(null)
      const rowQuantity = ref<number | null>(1)
      const rowPrice = ref<number | null>(null)

      return {
        stacked,
        split,
        price,
        percent,
        zero,
        atMax,
        empty,
        rowQuantity,
        rowPrice,
        longLabel,
        rules: [minimumOneRule],
        sizes: ['mini', 'small', 'default', 'large', 'extra'],
      }
    },
    template: /* html */ `
      <div class="s_pa__4" style="display: flex; flex-direction: column; gap: 8px; max-width: 375px">
        <SNumberInput v-model="stacked" data-testid="stacked" label="Stacked (default)" :min="0" :max="10" />
        <SNumberInput v-model="split" data-testid="split" label="Split" control-variant="split" :min="0" :max="10" />
        <SNumberInput v-model="empty" label="No controls" hide-controls placeholder="Type a number" />
        <SNumberInput v-model="price" label="Price" prefix="₮" :precision="2" :min="0" text-right />
        <SNumberInput v-model="percent" label="VAT rate" suffix="%" :min="0" :max="100" :precision="1" />
        <SNumberInput v-model="zero" data-testid="belowMin" label="Below min (shown, clamped on blur)" :min="1" :rules="rules" />
        <SNumberInput v-model="atMax" label="At max: increment disabled" :min="0" :max="10" />
        <SNumberInput :model-value="4" label="Disabled" disabled />
        <SNumberInput :model-value="4" label="Read-only" readonly control-variant="split" />
        <SNumberInput :model-value="7" :label="longLabel" />
        <SNumberInput
          v-for="size in sizes"
          :key="size"
          :model-value="5"
          :size="size"
          :label="'Size ' + size"
          hide-error
        />
        <SForm>
          <SFormRow data-testid="row">
            <SNumberInput v-model="rowQuantity" label="Qty" :min="1" control-variant="split" />
            <SButton>Add</SButton>
          </SFormRow>
          <SFormRow>
            <SNumberInput v-model="rowPrice" placeholder="Unit price" :precision="2" :min="0" />
            <SNumberInput v-model="rowQuantity" label="Wraps to its own line" :min="1" />
            <SButton>Add</SButton>
          </SFormRow>
        </SForm>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.ownerDocument.documentElement

    await waitFor(() => expect(canvasElement.querySelectorAll('.s_numberInput').length).toBeGreaterThan(0))

    // The buttons are steps of the value, not clipped by the field box.
    for (const field of canvasElement.querySelectorAll('.s_numberInput__field')) {
      const fieldRect = getRect(field)

      for (const control of field.querySelectorAll('.s_numberInput__control')) {
        const controlRect = getRect(control)

        await expect(controlRect.right).toBeLessThanOrEqual(fieldRect.right + pixelTolerance)
        await expect(controlRect.left).toBeGreaterThanOrEqual(fieldRect.left - pixelTolerance)
        await expect(controlRect.height).toBeGreaterThan(0)
      }
    }

    // Increment, ArrowDown and the bound: stacked 3 → 4 → 3, split stops at max.
    const stacked = canvasElement.querySelector('[data-testid="stacked"]')
    const stackedInput = stacked?.querySelector('input')

    if (!stacked || !stackedInput) {
      throw new Error('NumberInputStress: the stacked field did not render')
    }

    await userEvent.click(getElement(stacked, '.s_numberInput__control--increment'))
    await waitFor(() => expect(stackedInput.value).toBe('4'))
    stackedInput.focus()
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(stackedInput.value).toBe('3'))
    await expect(stackedInput.getAttribute('aria-valuenow')).toBe('3')
    stackedInput.blur()

    // A value below `min` is shown, then clamped on blur, and the rule's message clears.
    const belowMinInput = canvasElement.querySelector<HTMLInputElement>('[data-testid="belowMin"] input')

    if (!belowMinInput) {
      throw new Error('NumberInputStress: the below-min field did not render')
    }

    await expect(belowMinInput.value).toBe('0')
    belowMinInput.focus()
    belowMinInput.blur()
    await waitFor(() => expect(belowMinInput.value).toBe('1'))

    // In SFormRow the button lines up with the field box, not with the label.
    const row = canvasElement.querySelector('[data-testid="row"]')
    const rowFieldRect = getRect(row?.querySelector('.s_numberInput__field'))
    const rowButtonRect = getRect(row?.querySelector('.s_button'))

    await expect(Math.abs(rowButtonRect.top - rowFieldRect.top)).toBeLessThanOrEqual(pixelTolerance)

    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + pixelTolerance)
  },
} satisfies StoryObj<typeof SNumberInput>
