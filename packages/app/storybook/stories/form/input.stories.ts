import type { Meta } from '@storybook/vue3-vite'
import { action } from 'storybook/actions'
import { expect } from 'storybook/test'
import type { ComponentPublicInstance } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import { SButton, SCard, SCardTitle, SColumn, SForm, SInput, SRow, SSwitch } from '@/app/index'
import { argsInput } from '@/app/storybook/args'
import { formInputModelValueRules } from '@/app/storybook/configs'
import { createStoryObj } from '@/app/storybook/helpers'

const input = {
  title: 'UI Components/Form/Input',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: SInput as ComponentPublicInstance<any>,
} satisfies Meta<typeof SInput>

export default input

export const Input = createStoryObj<Meta>({
  args: argsInput,
  render: (args) =>
    defineComponent({
      components: {
        SInput,
      },
      setup: () => {
        const modelValue = ref<string | null>(null)

        return {
          args,
          modelValue,
        }
      },
      template: `
        <SInput v-bind="args" v-model="modelValue"></SInput>
      `,
    }),
})

const renderNumberInput = (args: Record<string, unknown>) =>
  defineComponent({
    components: {
      SInput,
    },
    setup: () => {
      const modelValue = ref<number | null>(null)

      return {
        args,
        modelValue,
      }
    },
    template: `
      <SInput v-bind="args" v-model="modelValue"></SInput>
      <div class="s_pa__4">v-model: <span data-testid="model">{{ JSON.stringify(modelValue) }}</span></div>
    `,
  })

const getNumberInputElements = (canvasElement: HTMLElement) => {
  const input = canvasElement.querySelector<HTMLInputElement>('.s_input__input')
  const model = canvasElement.querySelector('[data-testid="model"]')

  if (!input || !model) {
    throw new Error('NumberInput story did not render')
  }

  return { input, model }
}

export const NumberInput = createStoryObj<Meta>({
  args: {
    ...argsInput,
    id: 'numberInput',
    type: 'number',
    label: 'Number (min 1, max 100)',
    placeholder: 'Number',
    min: 1,
    max: 100,
    positive: false,
    allowDecimal: false,
    usePreviousValueWhenExceeded: false,
  },
  render: renderNumberInput,
  play: async ({ canvasElement, userEvent }) => {
    const { input, model } = getNumberInputElements(canvasElement)

    // a value equal to `min` must stay visible
    await userEvent.type(input, '1')
    await expect(input).toHaveValue(1)
    await expect(model.textContent).toBe('1')

    // decimals are blocked by default: `.` is ignored, so `1.5` becomes `15`
    await userEvent.clear(input)
    await userEvent.type(input, '1.5')
    await expect(model.textContent).toBe('15')

    // values above `max` are clamped while typing
    await userEvent.clear(input)
    await userEvent.type(input, '500')
    await expect(model.textContent).toBe('100')
  },
})

export const DecimalInput = createStoryObj<Meta>({
  args: {
    ...argsInput,
    id: 'decimalInput',
    type: 'number',
    inputmode: 'decimal',
    label: 'Decimal (min 0.5, max 10)',
    placeholder: 'Decimal',
    min: 0.5,
    max: 10,
    positive: false,
    allowDecimal: true,
    usePreviousValueWhenExceeded: false,
  },
  render: renderNumberInput,
  play: async ({ canvasElement, userEvent }) => {
    const { input, model } = getNumberInputElements(canvasElement)

    // the `0` of `1.05` must not be dropped while typing
    await userEvent.type(input, '1.05')
    await expect(input).toHaveValue(1.05)
    await expect(model.textContent).toBe('1.05')

    // values below `min` are allowed while typing and clamped on blur
    await userEvent.clear(input)
    await userEvent.type(input, '0.2')
    await expect(model.textContent).toBe('0.2')
    await userEvent.tab()
    await expect(model.textContent).toBe('0.5')

    // values above `max` are clamped while typing
    await userEvent.clear(input)
    await userEvent.type(input, '12.5')
    await expect(model.textContent).toBe('10')
  },
})

export const Inputs = createStoryObj<Meta>({
  args: {
    inputBackground: '',
    hideDetails: false,
    hideError: false,
    disabled: false,
    suffix: '',
    appendOuter: '',
    simple: false,
    dense: false,
    tile: false,
    textRight: false,
    readonly: false,
    placeholderBackground: '',
    onInput: action('onInput'),
    onChange: action('onChange'),
  },
  parameters: {
    controls: {
      exclude: ['color', 'location'],
    },
  },
  render: (args) =>
    defineComponent({
      components: {
        SCard,
        SCardTitle,
        SForm,
        SRow,
        SColumn,
        SInput,
        SButton,
        SSwitch,
      },
      setup() {
        const form = ref<(ComponentPublicInstance & { validate: () => void; resetValidation: () => void }) | null>(null)
        const name = ref('')
        const email = ref('')
        const amount = ref<number | null>(null)
        const maxAmount = ref<number>(9000)
        const errors = ref<string[]>([])
        const error = ref(false)
        const valid = ref(true)
        const bank = ref<string | null>(null)
        const mandatoryRadio = ref<boolean>(false)
        const growRadio = ref<boolean>(false)

        const inputMetas = ref({
          name: {
            dirty: false,
            error: false,
            rules: [
              formInputModelValueRules.required({ target: 'name' }),
              formInputModelValueRules.maxLength({ target: 'name', maxLength: 10 }),
            ],
          },
          email: {
            dirty: false,
            error: false,
            rules: [formInputModelValueRules.required({ target: 'email' })],
          },
          amount: {
            dirty: false,
            error: false,
            rules: [
              formInputModelValueRules.required({ target: 'amount' }),
              formInputModelValueRules.maxLength({ target: 'amount', maxLength: 4 }),
              formInputModelValueRules.max({ target: 'amount', max: maxAmount.value }),
            ],
          },
        })

        const remainingInputCount = computed(() => {
          return Object.values(inputMetas.value).filter(({ dirty, error }) => {
            return !dirty || error
          }).length
        })

        const validate = () => {
          form.value?.validate()
        }

        const resetValidation = () => {
          form.value?.resetValidation()
        }

        return {
          name,
          email,
          amount,
          errors,
          error,
          valid,
          bank,
          mandatoryRadio,
          growRadio,
          maxAmount,
          remainingInputCount,
          inputMetas,
          form,
          validate,
          resetValidation,
          args,
        }
      },
      template: `
        <SCard max-width="800" class="s_mx__auto">
          <SForm ref="form" v-model="valid" v-model:errors="errors" v-model:error="error" @submit.prevent>
            <SRow align="center" dense justify="center">
              <SColumn cols="12">
                <SInput
                  id="name"
                  v-model="name"
                  autocomplete="off"
                  placeholder="name"
                  label="name"

                  :rules="inputMetas.name.rules"
                  :error="inputMetas.name.error"
                  :dirty="inputMetas.name.dirty"
                  @update:error="inputMetas.name.error = $event"
                  @update:dirty="inputMetas.name.dirty = $event"
                  @input="args.onInput"
                  @change="args.onChange"

                  :input-background="args.inputBackground"
                  :placeholder-background="args.placeholderBackground"
                  :hide-details="args.hideDetails"
                  :hide-error="args.hideError"
                  :disabled="args.disabled"
                  :suffix="args.suffix"
                  :append-outer="args.appendOuter"
                  :simple="args.simple"
                  :textRight="args.textRight"
                  :readonly="args.readonly"
                  :dense="args.dense"
                  :tile="args.tile"
                ></SInput>
              </SColumn>
              <SColumn cols="12">
                <SInput
                  id="email"
                  v-model="email"
                  autocomplete="off"
                  type="email"
                  placeholder="email"
                  label="email"

                  :rules="inputMetas.email.rules"
                  :error="inputMetas.email.error"
                  :dirty="inputMetas.email.dirty"
                  @update:error="inputMetas.email.error = $event"
                  @update:dirty="inputMetas.email.dirty = $event"

                  :input-background="args.inputBackground"
                  :placeholder-background="args.placeholderBackground"
                  :hide-details="args.hideDetails"
                  :hide-error="args.hideError"
                  :disabled="args.disabled"
                  :suffix="args.suffix"
                  :append-outer="args.appendOuter"
                  :simple="args.simple"
                  :textRight="args.textRight"
                  :readonly="args.readonly"
                  :dense="args.dense"
                  :tile="args.tile"
                ></SInput>
              </SColumn>
              <SColumn cols="12">
                <SInput
                    type="number"
                    id="amount"
                    v-model="amount"
                    :max="maxAmount"
                    placeholder="amount"
                    label="amount"

                    :rules="inputMetas.amount.rules"
                    :error="inputMetas.amount.error"
                    :dirty="inputMetas.amount.dirty"
                    @update:error="inputMetas.amount.error = $event"
                    @update:dirty="inputMetas.amount.dirty = $event"

                    :input-background="args.inputBackground"
                    :placeholder-background="args.placeholderBackground"
                    :hide-details="args.hideDetails"
                    :hide-error="args.hideError"
                    :disabled="args.disabled"
                    :suffix="args.suffix"
                    :append-outer="args.appendOuter"
                    :simple="args.simple"
                    :textRight="args.textRight"
                    :readonly="args.readonly"
                    :dense="args.dense"
                    :tile="args.tile"
                  >
                </SInput>
              </SColumn>
              <SColumn cols="12">
                <SInput
                    id="email2"
                    v-model="email"
                    autocomplete="off"
                    type="email"
                    placeholder="Sura Kh"
                    label="email(optional)"
                    :input-background="args.inputBackground"
                    :placeholder-background="args.placeholderBackground"
                    :hide-details="args.hideDetails"
                    :disabled="args.disabled"
                    :append-outer="args.appendOuter"
                    :simple="args.simple"
                    :readonly="args.readonly"
                    :textRight="args.textRight"
                  >
                  <template #suffix>@surakh.com</template>
                </SInput>
              </SColumn>
            </SRow>
            <SRow>
              <SButton @click="validate">Validate</SButton>
            </SRow>
            <SRow>
              <SButton @click="resetValidation">Reset Validation</SButton>
            </SRow>
            <SRow>
              <SCardTitle>Form errors</SCardTitle>
              <div>Number of fields, left to input: {{ remainingInputCount }}</div>
              <SColumn cols="12">
                <ul class="s_list--asterisk">
                  <li v-for="(error, id) in errors" :key="id">{{ error }}</li>
                </ul>
              </SColumn>
              <SColumn cols="12">
                isValid: {{ valid }}
              </SColumn>
              <SColumn cols="12">
                hasError: {{ error }}
              </SColumn>
            </SRow>
            <SRow>
              <SButton @click="validate">Validate</SButton>
            </SRow>
            <SRow>
              <SButton @click="resetValidation">Reset Validation</SButton>
            </SRow>
          </SForm>
        </SCard>
      `,
    }),
})
