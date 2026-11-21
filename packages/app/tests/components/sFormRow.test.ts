import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { SApp, SAutocomplete, SButton, SDatePickerInput, SFormRow, SInput, SSelect, STextarea } from '@/app/components'

const mountRow = (fields: string) =>
  mount(
    defineComponent({
      components: { SApp, SAutocomplete, SButton, SDatePickerInput, SFormRow, SInput, SSelect, STextarea },
      template: `<SApp><SFormRow>${fields}<SButton>Go</SButton></SFormRow></SApp>`,
    }),
  )

const fieldClasses = (fields: string) =>
  mountRow(fields)
    .findAll('.s_formRow > .s_field')
    .map((field) => field.classes().filter((name) => name.startsWith('s_field')))

describe('SFormRow', () => {
  test('renders its fields and buttons in one row', () => {
    const row = mountRow('<SInput label="Search" />').find('.s_formRow')

    expect(row.find('.s_input').exists()).toBe(true)
    expect(row.find('.s_button').exists()).toBe(true)
  })

  test.each([
    ['SInput', '<SInput label="Search" />'],
    ['SSelect', '<SSelect label="Status" :items="[]" />'],
    ['SDatePickerInput', '<SDatePickerInput label="From" type="date" />'],
    ['STextarea', '<STextarea label="Note" />'],
  ])('marks a labelled %s with a details line', (_, field) => {
    expect(fieldClasses(field)).toEqual([['s_field', 's_field--labelled', 's_field--details']])
  })

  test('marks SAutocomplete as labelled without a details line (it runs no rules)', () => {
    expect(fieldClasses('<SAutocomplete label="Fruit" :items="[]" />')).toEqual([['s_field', 's_field--labelled']])
  })

  test.each([
    ['no label', '<SInput placeholder="Search" />', ['s_field', 's_field--details']],
    ['hide-details', '<SInput label="Search" hide-details />', ['s_field']],
    ['hide-error', '<SInput label="Search" hide-error />', ['s_field', 's_field--labelled']],
    ['a textarea counter with hide-error', '<STextarea hide-error counter />', ['s_field', 's_field--details']],
  ])('follows the rendered label and details line: %s', (_, field, classes) => {
    expect(fieldClasses(field)).toEqual([classes])
  })
})
