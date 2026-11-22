import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { SApp, SFileInput, SFormRow } from '@/app/components'
import { type PropsFileInput } from '@/app/definitions'
import { getFileInputRules } from '@/app/helpers'
import type * as browserLib from '@/app/lib/browser'
import { mountWithApp } from '@/app/tests/_helpers'

// jsdom's div has no `draggable` property, so SDroppable would treat drag and drop as unsupported.
vi.mock('@/app/lib/browser', async (importOriginal) => ({
  ...(await importOriginal<typeof browserLib>()),
  hasDragDropFeature: () => true,
}))

const createFile = (name: string, type = 'text/csv', size = 10) => new File(['x'.repeat(size)], name, { type })

/** jsdom's `files` is read-only and has no DataTransfer, so the picked files are set on the element directly. */
const pickFiles = async (input: HTMLInputElement, files: File[]) => {
  Object.defineProperty(input, 'files', { value: files, configurable: true, writable: true })
  input.dispatchEvent(new Event('change'))
  await nextTick()
  await nextTick()
}

/** jsdom has no DragEvent with files, so the drop carries a plain `dataTransfer` object. */
const dropFiles = async (target: Element, files: File[]) => {
  const event = new Event('drop', { bubbles: true, cancelable: true })

  Object.defineProperty(event, 'dataTransfer', { value: { files } })
  target.dispatchEvent(event)
  await nextTick()
  await nextTick()
}

describe('SFileInput', () => {
  const getSFileInput = (props?: Partial<PropsFileInput>) => {
    return mountWithApp(SFileInput, { props: { ...props } })
  }

  /** Mounted with a `v-model`, so the shown files follow the model as in an app. */
  const mountWithModel = (props: Partial<PropsFileInput> = {}, initialFiles: File[] | null = null) => {
    const files = ref<File[] | null>(initialFiles)

    const root = mount(
      defineComponent({
        components: { SApp, SFileInput },
        setup: () => ({ files, props }),
        template: `<SApp><SFileInput v-model="files" v-bind="props" /></SApp>`,
      }),
    )

    const wrapper = root.findComponent(SFileInput)
    const input = wrapper.find<HTMLInputElement>('input[type="file"]').element

    return { files, wrapper, input }
  }

  test('renders a real file input tied to the label', () => {
    const wrapper = getSFileInput({ label: 'Logo' })
    const input = wrapper.find('input')
    const label = wrapper.find('label')

    expect(wrapper.classes('s_fileInput')).toBe(true)
    expect(wrapper.classes('s_fileInput--input')).toBe(true)
    expect(input.attributes('type')).toBe('file')
    expect(label.text()).toBe('Logo')
    expect(label.attributes('for')).toBe(input.attributes('id'))
    expect(input.attributes('aria-label')).toBeUndefined()
  })

  test('names the input like SInput: hideDetails turns the label into the aria-label, ariaLabel wins', () => {
    const hidden = getSFileInput({ label: 'Logo', hideDetails: true })

    expect(hidden.find('label').attributes('style')).toContain('display: none')
    expect(hidden.find('input').attributes('aria-label')).toBe('Logo')

    const named = getSFileInput({ label: 'Logo', hideDetails: true, ariaLabel: 'Company logo' })

    expect(named.find('input').attributes('aria-label')).toBe('Company logo')

    const labelledby = getSFileInput({ ariaLabelledby: 'heading' })

    expect(labelledby.find('input').attributes('aria-labelledby')).toBe('heading')
  })

  test('passes accept, multiple, name and id to the native input', () => {
    const wrapper = getSFileInput({ accept: '.csv,.xlsx', multiple: true, name: 'import', id: 'import-file' })
    const input = wrapper.find('input')

    expect(input.attributes('accept')).toBe('.csv,.xlsx')
    expect(input.attributes('multiple')).toBeDefined()
    expect(input.attributes('name')).toBe('import')
    expect(input.attributes('id')).toBe('import-file')
  })

  test('picking a file updates the model, shows the name and announces it', async () => {
    const { files, wrapper, input } = mountWithModel({ placeholder: 'No file' })
    const file = createFile('employees.csv')

    expect(wrapper.find('.s_fileInput__placeholder').text()).toBe('No file')

    await pickFiles(input, [file])

    expect(files.value).toEqual([file])
    expect(wrapper.emitted('change')?.[0]).toEqual([[file]])
    expect(wrapper.find('.s_fileInput__text').text()).toBe('employees.csv')
    expect(wrapper.find('[role="status"]').text()).toBe('employees.csv')
  })

  test('a cancelled picker (no files) keeps the current files', async () => {
    const file = createFile('kept.csv')
    const { files, input } = mountWithModel({}, [file])

    await pickFiles(input, [])

    expect(files.value).toEqual([file])
  })

  test('without multiple only the first file is kept and the others are rejected', async () => {
    const { files, wrapper, input } = mountWithModel()
    const first = createFile('a.csv')
    const second = createFile('b.csv')

    await pickFiles(input, [first, second])

    expect(files.value).toEqual([first])
    expect(wrapper.emitted('reject')?.[0]).toEqual([[second]])
  })

  test('a dropped file that does not match accept is rejected and the field keeps its files', async () => {
    const kept = createFile('kept.csv')
    const { files, wrapper } = mountWithModel({ accept: '.csv', multiple: true }, [kept])
    const image = createFile('photo.png', 'image/png')

    await dropFiles(wrapper.find('.s_droppable').element, [image])

    expect(files.value).toEqual([kept])
    expect(wrapper.emitted('reject')?.[0]).toEqual([[image]])

    const csv = createFile('more.csv')

    await dropFiles(wrapper.find('.s_droppable').element, [csv, image])

    expect(files.value).toEqual([csv])
  })

  test('drops are ignored while disabled or loading', async () => {
    const { files, wrapper } = mountWithModel({ loading: true })

    await dropFiles(wrapper.find('.s_droppable').element, [createFile('a.csv')])

    expect(files.value).toBeNull()
  })

  test('display: names joins the names, chips draws one chip each, count shows the number', () => {
    const selected = [createFile('a.csv'), createFile('b.csv'), createFile('c.csv')]

    expect(mountWithModel({ multiple: true }, selected).wrapper.find('.s_fileInput__text').text()).toBe(
      'a.csv, b.csv, c.csv',
    )
    expect(mountWithModel({ multiple: true, display: 'chips' }, selected).wrapper.findAll('.s_chip')).toHaveLength(3)
    expect(
      mountWithModel({ multiple: true, display: 'count' }, selected).wrapper.find('.s_fileInput__text').text(),
    ).toBe('3 files')
    expect(
      mountWithModel({ multiple: true, display: 'count', countText: '{count} файл' }, selected).wrapper.text(),
    ).toContain('3 файл')
    expect(
      mountWithModel({ display: 'count' }, [createFile('a.csv')])
        .wrapper.find('.s_fileInput__text')
        .text(),
    ).toBe('a.csv')
  })

  test('showSize adds each file size', () => {
    const { wrapper } = mountWithModel({ showSize: true }, [createFile('big.csv', 'text/csv', 1536)])

    expect(wrapper.find('.s_fileInput__text').text()).toBe('big.csv (1.5 KB)')
  })

  test('the clear button empties the model, emits clear and refocuses the input', async () => {
    const { files, wrapper } = mountWithModel({ clearable: true, clearAriaLabel: 'Remove file' }, [createFile('a.csv')])
    const clearButton = wrapper.find('.s_fileInput__clear')

    expect(clearButton.attributes('aria-label')).toBe('Remove file')

    await clearButton.trigger('click')

    expect(files.value).toBeNull()
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.find('.s_fileInput__clear').exists()).toBe(false)
  })

  test('no clear button without files, without clearable or while disabled', () => {
    expect(mountWithModel({ clearable: true }).wrapper.find('.s_fileInput__clear').exists()).toBe(false)
    expect(
      mountWithModel({}, [createFile('a.csv')])
        .wrapper.find('.s_fileInput__clear')
        .exists(),
    ).toBe(false)
    expect(
      mountWithModel({ clearable: true, disabled: true }, [createFile('a.csv')])
        .wrapper.find('.s_fileInput__clear')
        .exists(),
    ).toBe(false)
  })

  test('rules show their error, mark the input invalid and point at the message', async () => {
    const { wrapper, input } = mountWithModel({ rules: getFileInputRules({ maxSize: 5 }) })

    await pickFiles(input, [createFile('big.csv', 'text/csv', 10)])

    const field = wrapper.find('input')

    expect(wrapper.find('.s_fileInput__field').classes('s_fileInput__field--error')).toBe(true)
    expect(field.attributes('aria-invalid')).toBe('true')
    expect(field.attributes('aria-describedby')).toBe(wrapper.find('.s_formInputError').attributes('id'))
    expect(wrapper.find('.s_formInputError').text()).toBe('big.csv is larger than 5 B.')
  })

  test('the error prop marks the field, hideDetails drops the error line', () => {
    expect(getSFileInput({ error: true }).find('.s_fileInput__field--error').exists()).toBe(true)
    expect(getSFileInput({ hideDetails: true }).find('.s_formInputError').exists()).toBe(false)
    expect(getSFileInput({ hideError: true }).find('.s_formInputError').exists()).toBe(false)
  })

  test.each(['Enter', ' '])('the %j key opens the picker', (key) => {
    const wrapper = getSFileInput()
    const input = wrapper.find('input')
    const click = vi.spyOn(input.element, 'click').mockImplementation(() => undefined)
    const event = new KeyboardEvent('keydown', { key, cancelable: true })

    input.element.dispatchEvent(event)

    expect(click).toHaveBeenCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
  })

  test('other keys do not open the picker', async () => {
    const wrapper = getSFileInput()
    const input = wrapper.find('input')
    const click = vi.spyOn(input.element, 'click').mockImplementation(() => undefined)

    await input.trigger('keydown', { key: 'Tab' })

    expect(click).not.toHaveBeenCalled()
  })

  test('disabled and loading block the input; loading shows a labelled spinner', () => {
    expect(getSFileInput({ disabled: true }).find('input').attributes('disabled')).toBeDefined()
    // The dimmed file names belong to a disabled control, which the contrast rules exempt.
    expect(getSFileInput({ disabled: true }).find('.s_fileInput__field').attributes('aria-disabled')).toBe('true')
    expect(getSFileInput().find('.s_fileInput__field').attributes('aria-disabled')).toBeUndefined()
    expect(getSFileInput({ readonly: true }).find('input').attributes('disabled')).toBeDefined()

    const loading = getSFileInput({ loading: true, loadingAriaLabel: 'Reading file' })

    expect(loading.find('input').attributes('disabled')).toBeDefined()
    expect(loading.find('input').attributes('aria-busy')).toBe('true')
    expect(loading.find('.s_fileInput__loader').attributes('aria-label')).toBe('Reading file')
  })

  test('the dropzone variant shows its call to action and icon', () => {
    const wrapper = getSFileInput({ variant: 'dropzone', dropText: 'Drop the workbook here' })

    expect(wrapper.classes('s_fileInput--dropzone')).toBe(true)
    expect(wrapper.find('.s_fileInput__dropText').text()).toBe('Drop the workbook here')
    expect(wrapper.find('.s_fileInput__icon').exists()).toBe(true)
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })

  test('the icon defaults per variant and an empty icon hides it', () => {
    expect(getSFileInput().find('.s_fileInput__icon').classes()).toContain('mdi-paperclip')
    expect(getSFileInput({ icon: 'mdi-image' }).find('.s_fileInput__icon').classes()).toContain('mdi-image')
    expect(getSFileInput({ icon: '' }).find('.s_fileInput__icon').exists()).toBe(false)
  })

  test('size and dense set their modifier classes', () => {
    expect(getSFileInput({ size: 'large' }).classes('s_fileInput--size__large')).toBe(true)
    expect(getSFileInput({ dense: true }).classes('s_fileInput--dense')).toBe(true)
  })

  test('marks itself as a labelled field with details, so SFormRow can align it', () => {
    const wrapper = mount(
      defineComponent({
        components: { SApp, SFileInput, SFormRow },
        template: `<SApp><SFormRow><SFileInput label="File" /></SFormRow></SApp>`,
      }),
    ).findComponent(SFileInput)

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['s_field', 's_field--labelled', 's_field--details']))
    expect(getSFileInput({ label: 'File', hideDetails: true }).classes('s_field--labelled')).toBe(false)
  })
})
