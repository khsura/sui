import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, waitFor } from 'storybook/test'
import { defineComponent, onMounted, ref } from 'vue'
import {
  type SelectItem,
  SAutocomplete,
  SButton,
  SCheckbox,
  SDatePickerInput,
  SForm,
  SIcon,
  SInput,
  SRadio,
  SRadioGroup,
  SSelect,
  SSwitch,
  STextarea,
} from '@/app/index'

/**
 * Stress cases for the form inputs, screenshotted by the visual harness (docs/visual-testing.md).
 * Every story renders the components with the library defaults: no app-level component defaults are relied on.
 */
const formStress: Meta = {
  title: 'UI Components/Form/Stress',
}

export default formStress

const LONG_LABEL = 'A very long label that keeps going so it has to wrap onto a second line on a phone'
const LONG_VALUE = 'A long value that is wider than the field, so the text must be clipped inside the input'
const LONG_PLACEHOLDER = 'A long placeholder that is wider than the field and must not stretch it'
const LONG_ERROR = 'This error message is long on purpose, so it wraps onto a second line below the field'
const TEXTAREA_MAX_LENGTH = 200

const roles: SelectItem[] = [
  { text: 'Admin', value: 'admin' },
  { text: 'Editor with a very long role name that is wider than the select field', value: 'editor' },
  { text: 'Viewer', value: 'viewer' },
]

const fruits = ['Apple', 'Banana', 'Cherry', 'Grape', 'Kiwi', 'Lemon', 'Mango', 'Orange', 'Peach', 'Pear']
const sizes = ['mini', 'small', 'default', 'large', 'extra'] as const
const longError = () => LONG_ERROR
const required = (value: unknown) => Boolean(value) || 'This field is required'

const stressComponents = {
  SAutocomplete,
  SButton,
  SCheckbox,
  SDatePickerInput,
  SForm,
  SIcon,
  SInput,
  SRadio,
  SRadioGroup,
  SSelect,
  SSwitch,
  STextarea,
}

interface ValidatableForm {
  validate: () => boolean
}

/** Validates the form once it is mounted, so the error state is part of the screenshot. */
const useValidatedForm = () => {
  const formRef = ref<ValidatableForm | null>(null)

  onMounted(() => {
    formRef.value?.validate()
  })

  return formRef
}

const gridStyle = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 0 16px;'

export const TextFieldStates = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: stressComponents,
      setup: () => ({
        formRef: useValidatedForm(),
        roles,
        fruits,
        longError,
        LONG_LABEL,
        LONG_VALUE,
        LONG_PLACEHOLDER,
        TEXTAREA_MAX_LENGTH,
        filled: ref({ input: LONG_VALUE, select: 'editor', date: '2026-01-15', textarea: LONG_VALUE, fruit: 'Mango' }),
        empty: ref({ input: '', select: null, date: '', textarea: '', fruit: null }),
        invalid: ref({ input: '', select: null, date: null, textarea: '' }),
      }),
      template: `
        <SForm ref="formRef" @submit.prevent>
          <h3>Long labels and values</h3>
          <div style="${gridStyle}">
            <SInput v-model="filled.input" :label="LONG_LABEL" />
            <SSelect v-model="filled.select" :label="LONG_LABEL" :items="roles" />
            <SDatePickerInput v-model="filled.date" :label="LONG_LABEL" />
            <SAutocomplete v-model="filled.fruit" :label="LONG_LABEL" :items="fruits" />
            <STextarea v-model="filled.textarea" :label="LONG_LABEL" :maxlength="TEXTAREA_MAX_LENGTH" counter />
            <SInput v-model="empty.input" label="Long placeholder" :placeholder="LONG_PLACEHOLDER" />
          </div>

          <h3>Empty</h3>
          <div style="${gridStyle}">
            <SInput v-model="empty.input" label="Input" />
            <SSelect v-model="empty.select" label="Select" :items="roles" />
            <SSelect v-model="empty.select" label="Select with placeholder" placeholder="Choose a role" :items="roles" />
            <SDatePickerInput v-model="empty.date" label="Date from an empty string" />
            <SAutocomplete v-model="empty.fruit" label="Autocomplete" :items="fruits" placeholder="Search fruit" />
            <STextarea v-model="empty.textarea" label="Textarea with counter" :maxlength="TEXTAREA_MAX_LENGTH" counter />
          </div>

          <h3>Errors that wrap</h3>
          <div style="${gridStyle}">
            <SInput v-model="invalid.input" label="Input" :rules="[longError]" />
            <SSelect v-model="invalid.select" label="Select" :items="roles" :rules="[longError]" />
            <SDatePickerInput v-model="invalid.date" label="Date" :rules="[longError]" />
            <STextarea v-model="invalid.textarea" label="Textarea" :rules="[longError]" counter />
          </div>

          <h3>Disabled, readonly and loading</h3>
          <div style="${gridStyle}">
            <SInput v-model="filled.input" label="Disabled input" disabled />
            <SInput v-model="filled.input" label="Readonly input" readonly />
            <SSelect v-model="filled.select" label="Disabled select" :items="roles" disabled />
            <SDatePickerInput v-model="filled.date" label="Disabled date" disabled />
            <SDatePickerInput v-model="filled.date" label="Readonly date" readonly />
            <SAutocomplete v-model="empty.fruit" label="Loading autocomplete" :items="[]" loading placeholder="Loading" />
            <STextarea v-model="filled.textarea" label="Disabled textarea" disabled />
          </div>
        </SForm>
      `,
    }),
} satisfies StoryObj

export const TextFieldSizes = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: stressComponents,
      setup: () => ({
        sizes,
        fruits,
        values: ref({ input: 'Value', date: '2026-01-15', fruit: 'Kiwi', textarea: 'Value' }),
      }),
      template: `
        <div v-for="size in sizes" :key="size" style="${gridStyle}">
          <SInput v-model="values.input" :label="'Input ' + size" :size="size" hide-error>
            <template #suffix><SIcon icon="mdi-magnify" /></template>
          </SInput>
          <SInput v-model="values.input" :label="'Suffix text ' + size" :size="size" suffix="kg" hide-error />
          <SDatePickerInput v-model="values.date" :label="'Date ' + size" :size="size" block hide-error />
          <SAutocomplete v-model="values.fruit" :label="'Autocomplete ' + size" :size="size" :items="fruits" />
        </div>
      `,
    }),
} satisfies StoryObj

export const FormLayout = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: stressComponents,
      setup: () => ({
        roles,
        required,
        TEXTAREA_MAX_LENGTH,
        form: ref({
          name: '',
          email: '',
          role: null,
          startDate: '',
          bio: '',
          plan: null,
          notify: true,
          accept: false,
          search: '',
          from: '',
        }),
      }),
      template: `
        <div style="display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start;">
          <div style="width: 100%; max-width: 375px;">
            <h3>Mixed fields in a 375px column</h3>
            <SForm @submit.prevent>
              <SInput v-model="form.name" label="Full name" :rules="[required]" />
              <SInput v-model="form.email" label="Email" type="email" :rules="[required]" />
              <SSelect v-model="form.role" label="Role" :items="roles" grow :rules="[required]" />
              <SDatePickerInput v-model="form.startDate" label="Start date" block :rules="[required]" />
              <STextarea v-model="form.bio" label="Bio" :rows="3" :maxlength="TEXTAREA_MAX_LENGTH" counter />
              <SRadioGroup v-model="form.plan" :rules="[required]">
                <SRadio value="free" label="Free" />
                <SRadio value="pro" label="Pro" />
              </SRadioGroup>
              <SSwitch v-model="form.notify" label="Email me about new features" />
              <SCheckbox v-model="form.accept" label="I accept the terms" :rules="[required]" />
              <SButton type="submit" color="primary" block>Create account</SButton>
            </SForm>
          </div>
          <div style="flex: 1 1 320px; min-width: 0;">
            <h3>Fields next to a button</h3>
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <SInput v-model="form.search" label="Search" />
              <SButton color="primary">Search</SButton>
            </div>
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <SInput v-model="form.search" label="Search without details" hide-details placeholder="Search" />
              <SButton color="primary">Search</SButton>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-start;">
              <SDatePickerInput v-model="form.from" label="From" />
              <SSelect v-model="form.role" label="Role" :items="roles" />
              <SButton color="primary">Apply</SButton>
            </div>
          </div>
        </div>
      `,
    }),
} satisfies StoryObj

export const ChoiceControls = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: stressComponents,
      setup: () => ({
        formRef: useValidatedForm(),
        longError,
        LONG_LABEL,
        values: ref({ unchecked: false, checked: true, plan: null, picked: 'pro', on: true, off: false }),
      }),
      template: `
        <SForm ref="formRef" @submit.prevent style="max-width: 375px;">
          <SCheckbox v-model="values.checked" :label="LONG_LABEL" />
          <SCheckbox v-model="values.unchecked" label="Checkbox with an error that wraps" :rules="[longError]" />
          <SCheckbox v-model="values.checked" label="Hidden details keep the label" hide-details />
          <SCheckbox v-model="values.checked" label="Disabled" disabled />
          <SCheckbox v-model="values.checked" label="Readonly" readonly />
          <SCheckbox v-model="values.checked" label="Large" size="large" />
          <SRadioGroup v-model="values.plan" :rules="[longError]">
            <SRadio value="free" :label="LONG_LABEL" />
            <SRadio value="pro" label="Pro" />
          </SRadioGroup>
          <SRadioGroup v-model="values.picked" hide-details>
            <SRadio value="free" label="Hidden details keep the labels" />
            <SRadio value="pro" label="Pro" />
          </SRadioGroup>
          <SRadioGroup v-model="values.picked" disabled>
            <SRadio value="free" label="Disabled" />
            <SRadio value="pro" label="Pro" />
          </SRadioGroup>
          <SSwitch v-model="values.on" :label="LONG_LABEL" />
          <SSwitch v-model="values.off" label="Disabled" disabled />
          <SButton type="submit" color="primary" block>Submit</SButton>
        </SForm>
      `,
    }),
} satisfies StoryObj

// The field sits at the bottom of the viewport, so its dropdown must open upwards.
const bottomLayoutStyle = 'min-height: 760px; display: flex; flex-direction: column; justify-content: flex-end;'

export const SelectNearBottom = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: stressComponents,
      setup: () => ({ roles, role: ref('admin') }),
      template: `
        <div style="${bottomLayoutStyle}">
          <SSelect v-model="role" label="Role" :items="roles" grow hide-details />
        </div>
      `,
    }),
  play: async ({ canvasElement, userEvent }) => {
    const activator = canvasElement.querySelector('.s_select__activator')

    await expect(activator).toBeInTheDocument()
    if (activator) {
      await userEvent.click(activator)
    }

    await waitFor(() => expect(document.querySelector('.s_select__list')).toBeVisible())
  },
} satisfies StoryObj

export const AutocompleteNearBottom = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: stressComponents,
      setup: () => ({ fruits, fruit: ref(null) }),
      template: `
        <div style="${bottomLayoutStyle}">
          <SAutocomplete v-model="fruit" label="Fruit" :items="fruits" hide-details />
        </div>
      `,
    }),
  play: async ({ canvasElement, userEvent }) => {
    const input = canvasElement.querySelector('input')

    await expect(input).toBeInTheDocument()
    if (input) {
      await userEvent.click(input)
    }

    await waitFor(() => expect(document.querySelector('.s_autocomplete__list')).toBeVisible())
  },
} satisfies StoryObj

export const DatePickerNearBottom = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: stressComponents,
      setup: () => ({ date: ref('2026-01-15') }),
      template: `
        <div style="${bottomLayoutStyle}">
          <SDatePickerInput v-model="date" label="Date" hide-details />
        </div>
      `,
    }),
  play: async ({ canvasElement, userEvent }) => {
    const suffix = canvasElement.querySelector('.s_datePickerInput__suffix')

    await expect(suffix).toBeInTheDocument()
    if (suffix) {
      await userEvent.click(suffix)
    }

    await waitFor(() => expect(document.querySelector('.s_datePickerInput__picker')).toBeVisible())
  },
} satisfies StoryObj

// Distance (px) a dropdown must keep from the viewport edges, matching the library gutter (`overlayViewportGutter`).
const VIEWPORT_GUTTER = 8
// Sub-pixel rounding allowed in the geometry checks.
const PIXEL_TOLERANCE = 1
// Largest gap (px) between a dropdown and its field: anything more means the dropdown floated away.
const MAX_FIELD_GAP = 16
// Narrow enough that every dropdown below is wider than its field, so near the right edge it has to shift left.
const EDGE_FIELD_WIDTH = 160
const EDGE_FILTER_TEXT = 'an'
const edgeFruits = [...fruits, 'Dragon fruit with a very long name that is wider than the field']
const edgeCorners = ['top-right', 'bottom-right'] as const

type EdgeCorner = (typeof edgeCorners)[number]

// The fields sit against the right edge, one at the top and one in the bottom-right corner of the viewport.
const edgeStageTemplate = (field: string) => `
  <div style="position: fixed; inset: 0;">
    <div
      v-for="(corner, index) in corners"
      :key="corner"
      :class="'stress-edge--' + corner"
      style="position: absolute; right: 0; width: ${EDGE_FIELD_WIDTH}px;"
      :style="corner === 'top-right' ? { top: '0' } : { bottom: '0' }"
    >
      ${field}
    </div>
  </div>
`

const getRect = (element: Element | null) => {
  if (!element) {
    throw new Error('dropdown element not found')
  }

  return element.getBoundingClientRect()
}

// Plain throwing checks: they run inside `waitFor` callbacks, which retry until no error is thrown.
const assertThat = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const assertInsideViewport = (element: Element | null) => {
  const rect = getRect(element)
  const minimum = VIEWPORT_GUTTER - PIXEL_TOLERANCE

  const isInside =
    rect.left >= minimum &&
    rect.top >= minimum &&
    rect.right <= window.innerWidth - minimum &&
    rect.bottom <= window.innerHeight - minimum

  assertThat(isInside, `dropdown ${JSON.stringify(rect)} is not ${VIEWPORT_GUTTER}px inside the viewport`)
}

/** The dropdown sits right above or right below its field, without covering it. */
const assertAttachedToField = (dropdown: Element | null, field: Element | null) => {
  const dropdownRect = getRect(dropdown)
  const fieldRect = getRect(field)
  const gapAbove = fieldRect.top - dropdownRect.bottom
  const gapBelow = dropdownRect.top - fieldRect.bottom
  const isAbove = gapAbove >= -PIXEL_TOLERANCE && gapAbove <= MAX_FIELD_GAP
  const isBelow = gapBelow >= -PIXEL_TOLERANCE && gapBelow <= MAX_FIELD_GAP

  assertThat(isAbove || isBelow, `dropdown ${JSON.stringify(dropdownRect)} is not attached to its field`)
}

/** The only open dropdown matching `selector` (a closed one is removed or hidden). */
const getOpenDropdown = (selector: string) => {
  const openDropdowns = [...document.querySelectorAll<HTMLElement>(selector)].filter(
    (element) => element.offsetParent !== null,
  )

  assertThat(openDropdowns.length === 1, `expected one open ${selector}, found ${openDropdowns.length}`)

  return openDropdowns[0] ?? null
}

const getEdgeElement = (canvasElement: HTMLElement, corner: EdgeCorner, selector: string) =>
  canvasElement.querySelector(`.stress-edge--${corner} ${selector}`)

// A select against the right edge, at the top and in the bottom-right corner: the list stays inside the viewport.
export const SelectAtEdges = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: stressComponents,
      setup: () => ({ roles, roleValues: ref(['admin', 'admin']), corners: edgeCorners }),
      template: edgeStageTemplate(
        `<SSelect v-model="roleValues[index]" :items="roles" :aria-label="'Role ' + corner" grow hide-details />`,
      ),
    }),
  play: async ({ canvasElement, userEvent }) => {
    for (const corner of edgeCorners) {
      const activator = getEdgeElement(canvasElement, corner, '.s_select__activator')

      await expect(activator).toBeInTheDocument()
      if (activator) {
        await userEvent.click(activator)
      }

      await waitFor(() => assertInsideViewport(getOpenDropdown('.s_select__list')))
    }
  },
} satisfies StoryObj

// An autocomplete against the right edge: its list stays inside the viewport, and in the bottom-right corner the
// list opened above the field stays on the field while typing filters it.
export const AutocompleteAtEdges = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: stressComponents,
      setup: () => ({ edgeFruits, fruitValues: ref([null, null]), corners: edgeCorners }),
      template: edgeStageTemplate(
        `<SAutocomplete v-model="fruitValues[index]" :items="edgeFruits" :aria-label="'Fruit ' + corner" hide-details />`,
      ),
    }),
  play: async ({ canvasElement, userEvent }) => {
    const expectListOnField = (corner: EdgeCorner) =>
      waitFor(() => {
        const list = getOpenDropdown('.s_autocomplete__list')

        assertInsideViewport(list)
        assertAttachedToField(list, getEdgeElement(canvasElement, corner, '.s_autocomplete__inputField'))
      })

    for (const corner of edgeCorners) {
      const input = getEdgeElement(canvasElement, corner, 'input')

      await expect(input).toBeInTheDocument()
      if (input) {
        await userEvent.click(input)
      }

      await expectListOnField(corner)
    }

    const bottomInput = getEdgeElement(canvasElement, 'bottom-right', 'input')

    if (bottomInput) {
      await userEvent.type(bottomInput, EDGE_FILTER_TEXT)
    }

    await expectListOnField('bottom-right')
  },
} satisfies StoryObj

// A date picker against the right edge: the calendar stays inside the viewport, flipping above the field in the
// bottom-right corner instead of covering it.
export const DatePickerAtEdges = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: stressComponents,
      setup: () => ({ dateValues: ref(['2026-01-15', '2026-01-15']), corners: edgeCorners }),
      template: edgeStageTemplate(
        // With hide-details the label is not drawn, it names the input instead.
        `<SDatePickerInput v-model="dateValues[index]" :label="'Date ' + corner" hide-details />`,
      ),
    }),
  play: async ({ canvasElement, userEvent }) => {
    for (const corner of edgeCorners) {
      const suffix = getEdgeElement(canvasElement, corner, '.s_datePickerInput__suffix')

      await expect(suffix).toBeInTheDocument()
      if (suffix) {
        await userEvent.click(suffix)
      }

      await waitFor(() => {
        const picker = getOpenDropdown('.s_datePickerInput__picker')

        assertInsideViewport(picker)
        assertAttachedToField(picker, getEdgeElement(canvasElement, corner, '.s_datePickerInput__field'))
      })
    }
  },
} satisfies StoryObj
