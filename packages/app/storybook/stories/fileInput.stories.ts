import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import { expect, userEvent, waitFor } from 'storybook/test'
import { SButton, SFileInput, SForm, SFormRow, getFileInputRules } from '@/app/index'
import { argTypesDisabled, argTypesFileInput, argTypesSizePreset } from '@/app/storybook/argTypes'
import { createStoryObj } from '@/app/storybook/helpers'

const fileInput: Meta<typeof SFileInput> = {
  title: 'UI Components/FileInput',
  component: SFileInput,
  tags: ['a11y'],
  argTypes: {
    ...argTypesFileInput,
    ...argTypesSizePreset,
    ...argTypesDisabled,
    accept: { control: { type: 'text' }, description: 'Allowed types: `.csv,.xlsx`, `image/*`' },
    icon: { control: { type: 'text' }, description: "Material Design icon; `''` hides it" },
  },
}

export default fileInput

const megabyte = 1024 * 1024
const importMaxSize = 5 * megabyte

export const FileInput = createStoryObj<typeof SFileInput>({
  args: {
    label: 'Attachments',
    placeholder: 'No file chosen',
    ariaLabel: undefined,
    ariaLabelledby: undefined,
    name: 'attachments',
    multiple: true,
    accept: undefined,
    display: 'names',
    variant: 'input',
    clearable: true,
    clearAriaLabel: 'Clear',
    showSize: false,
    loading: false,
    loadingAriaLabel: 'Loading',
    countText: '{count} files',
    dropText: 'Drop files here or click to browse',
    icon: undefined,
    dense: false,
    size: null,
    hideDetails: false,
    hideError: false,
    error: false,
    disabled: false,
  },
  render: (args) =>
    defineComponent({
      components: { SFileInput },
      setup() {
        const files = ref<File[] | null>(null)
        const rejected = ref<string[]>([])

        return { args, files, rejected }
      },
      template: /* html */ `
        <div>
          <SFileInput v-bind="args" v-model="files" @reject="rejected = $event.map((file) => file.name)"></SFileInput>
          <p class="s_mt__2">Model: {{ files ? files.map((file) => file.name).join(', ') : 'null' }}</p>
          <p v-if="rejected.length">Rejected: {{ rejected.join(', ') }}</p>
        </div>
      `,
    }),
})

// The real cases in a consumer app: a spreadsheet import with a type and size rule, and a single image.
export const ImportAndImage = createStoryObj<typeof SFileInput>({
  render: () =>
    defineComponent({
      components: { SButton, SFileInput, SForm, SFormRow },
      setup() {
        const workbook = ref<File[] | null>(null)
        const logo = ref<File[] | null>(null)
        const accept = '.csv,.xlsx'
        const workbookRules = getFileInputRules({ required: true, accept, maxSize: importMaxSize })
        const logoRules = getFileInputRules({ accept: 'image/png,image/jpeg', maxSize: 2 * megabyte })

        return { workbook, logo, accept, workbookRules, logoRules }
      },
      template: /* html */ `
        <SForm>
          <SFileInput v-model="workbook" variant="dropzone" label="Employee workbook" :accept="accept"
            drop-text="Drop a .csv or .xlsx file (max 5 MB), or click to browse" show-size clearable
            :rules="workbookRules"></SFileInput>
          <SFormRow>
            <SFileInput v-model="logo" label="Company logo" accept="image/png,image/jpeg" icon="mdi-image"
              placeholder="PNG or JPEG, up to 2 MB" clearable :rules="logoRules"></SFileInput>
            <SButton color="primary" type="submit">Upload</SButton>
          </SFormRow>
        </SForm>
      `,
    }),
})

// Sub-pixel rounding allowed in the geometry checks.
const pixelTolerance = 1
const phoneWidth = 375
const longName = 'Quarterly_attendance_export_for_all_branches_and_departments_final_v12_reviewed.xlsx'
const createFile = (name: string, size: number) => new File(['x'.repeat(size)], name)

// The cases AI code gets wrong: long file names in every display, many files, every size, the drop zone, a field
// next to a button in SFormRow, an error, disabled and loading, a dark theme, all inside a 375px frame.
// A plain object literal, so Storybook's static indexer reads the `visual` tag.
export const FileInputStress = {
  tags: ['visual'],
  render: () => ({
    components: { SButton, SFileInput, SFormRow },
    setup() {
      const single = ref<File[] | null>([createFile(longName, 2048)])

      const many = ref<File[] | null>([
        createFile(longName, 1536),
        createFile('payroll.csv', 512),
        createFile('a-second-very-long-file-name-without-any-spaces-at-all.pdf', 4096),
      ])

      return { phoneWidth, single, many, sizes: ['mini', 'small', 'default', 'large', 'extra'] }
    },
    template: /* html */ `
      <div class="s_pa__4" style="display: flex; flex-direction: column; gap: 16px">
        <div class="stress-phone" :style="{ width: phoneWidth + 'px', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '4px', outline: '1px dashed currentColor' }">
          <SFileInput label="Empty" placeholder="No file chosen"></SFileInput>
          <SFileInput label="Long name" :model-value="single" show-size clearable></SFileInput>
          <SFileInput label="Names" :model-value="many" multiple clearable></SFileInput>
          <SFileInput label="Chips" :model-value="many" multiple display="chips" show-size clearable></SFileInput>
          <SFileInput label="Count" :model-value="many" multiple display="count"></SFileInput>
          <SFileInput label="Drop zone" variant="dropzone" :model-value="many" multiple display="chips" clearable></SFileInput>
          <SFormRow class="stress-row">
            <SFileInput label="In a form row" :model-value="single"></SFileInput>
            <SButton color="primary">Import</SButton>
          </SFormRow>
          <SFileInput label="Error" error :model-value="single"></SFileInput>
          <SFileInput label="Disabled" disabled :model-value="single"></SFileInput>
          <SFileInput label="Loading" loading :model-value="single"></SFileInput>
          <SFileInput label="Hidden details" hide-details :model-value="single"></SFileInput>
          <div style="display: flex; align-items: center; gap: 8px">
            <span>Flex row</span>
            <SFileInput hide-details aria-label="Flex row file" :model-value="single"></SFileInput>
          </div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px">
          <SFileInput v-for="size in sizes" :key="size" :size="size" :label="size" :model-value="single" style="width: 180px"></SFileInput>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.ownerDocument.documentElement
    const phone = canvasElement.querySelector('.stress-phone')

    const getRect = (element: Element | null | undefined) => {
      if (!element) {
        throw new Error('element not found')
      }

      return element.getBoundingClientRect()
    }

    await waitFor(() => expect(phone?.querySelectorAll('.s_fileInput').length).toBe(12))

    const frame = getRect(phone)

    for (const [index, field] of [...(phone?.querySelectorAll('.s_fileInput__field') ?? [])].entries()) {
      const rect = getRect(field)

      await expect(rect.left, `field ${index} starts outside the ${phoneWidth}px frame`).toBeGreaterThanOrEqual(
        frame.left - pixelTolerance,
      )
      await expect(rect.right, `field ${index} overflows the ${phoneWidth}px frame`).toBeLessThanOrEqual(
        frame.right + pixelTolerance,
      )

      // A long name truncates with an ellipsis inside the field instead of widening it.
      for (const part of field.querySelectorAll('.s_fileInput__text, .s_fileInput__chip, .s_fileInput__clear')) {
        const partRect = getRect(part)

        await expect(partRect.right, `field ${index}: ${part.className} sticks out`).toBeLessThanOrEqual(
          rect.right + pixelTolerance,
        )
      }
    }

    // A long name must not push the field onto its own line in SFormRow: the button stays beside the field box.
    const rowField = getRect(phone?.querySelector('.stress-row .s_fileInput__field'))
    const rowButton = getRect(phone?.querySelector('.stress-row .s_button'))

    await expect(
      Math.abs(rowButton.top - rowField.top),
      'the SFormRow button is not beside the field',
    ).toBeLessThanOrEqual(pixelTolerance)

    const longText = phone?.querySelector('.s_fileInput__text')

    await expect(getComputedStyle(longText ?? document.body).textOverflow).toBe('ellipsis')

    // The first field's real file input is reachable with Tab and named by its label.
    await userEvent.tab()
    const focused = canvasElement.ownerDocument.activeElement

    await expect(focused?.getAttribute('type')).toBe('file')
    await expect(canvasElement.querySelector(`label[for="${focused?.id}"]`)?.textContent).toBe('Empty')

    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + pixelTolerance)
  },
} satisfies StoryObj<typeof SFileInput>
