import { SInput, SCard, SCardTitle, SForm, SRow, SColumn, SButton, SSwitch } from '@khsura/sui/index'
import { action } from '@storybook/addon-actions'
import type { Meta } from '@storybook/vue3'
import { defineComponent, ref, computed } from 'vue'
import { argsInput } from '@khsura/storybook/args'
import { formInputModelValueRules } from '@khsura/storybook/configs'
import { createStoryObj } from '@khsura/storybook/helpers'
import type { ComponentPublicInstance } from 'vue'

const input = {
  title: 'UI Components/Form/Input',
  component: SInput,
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

export const Inputs = createStoryObj<Meta>({
  args: {
    inputBackground: '',
    hideDetails: false,
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
