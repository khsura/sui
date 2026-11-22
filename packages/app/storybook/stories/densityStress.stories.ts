import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
import { defineComponent, ref } from 'vue'
import {
  type DensityType,
  type SelectItem,
  SAutocomplete,
  SButton,
  SChip,
  SFileInput,
  SForm,
  SFormRow,
  SInput,
  SList,
  SListItem,
  SListItemContent,
  SListItemTitle,
  SNumberInput,
  SSelect,
  STable,
  STextarea,
  SToolbar,
  SToolbarTitle,
} from '@/app/index'

/**
 * Global density (`createSUI({ defaults: { global: { density } } })`), screenshotted by the visual harness
 * (docs/visual-testing.md). Each story renders the same block twice: once at `default` (the reference, today's
 * look) and once at the story's density, set through the `density` prop. The play checks that every density
 * component got shorter than its default twin, and that fields and buttons still line up in SFormRow.
 */
const densityStress: Meta = {
  title: 'UI Components/Density/Stress',
}

export default densityStress

// One density step removes this many px of height (`$s_density__step`).
const DENSITY_STEP_PX = 4
const DENSITY_STEPS: Record<DensityType, number> = { default: 0, comfortable: 1, compact: 2 }
const ALIGN_TOLERANCE_PX = 1

const statuses: SelectItem[] = [
  { text: 'Open', value: 'open' },
  { text: 'Closed', value: 'closed' },
]

const fruits = ['Apple', 'Banana', 'Cherry']

const tableHeaders = [
  { text: 'Order', value: 'id' },
  { text: 'Customer', value: 'customer' },
  { text: 'Total', value: 'total', align: 'end' as const },
]

const tableItems = [
  { id: 1001, customer: 'Ada Lovelace', total: '120.00' },
  { id: 1002, customer: 'Grace Hopper', total: '89.50' },
]

/** The block rendered once per density: fields next to buttons, a list, table rows, a toolbar and chips. */
const DensityBlock = defineComponent({
  components: {
    SAutocomplete,
    SButton,
    SChip,
    SFileInput,
    SForm,
    SFormRow,
    SInput,
    SList,
    SListItem,
    SListItemContent,
    SListItemTitle,
    SNumberInput,
    SSelect,
    STable,
    STextarea,
    SToolbar,
    SToolbarTitle,
  },
  props: {
    density: { type: String as () => DensityType, required: true },
  },
  setup: () => ({
    statuses,
    fruits,
    tableHeaders,
    tableItems,
    form: ref({ search: '', status: null, amount: 3, fruit: null, files: [], note: '' }),
  }),
  template: `
    <div class="density-block" :data-density="density">
      <h3>density: {{ density }}</h3>
      <SForm @submit.prevent>
        <SFormRow data-testid="row-input">
          <SInput v-model="form.search" label="Search" :density="density" />
          <SButton color="primary" :density="density">Search</SButton>
        </SFormRow>
        <SFormRow data-testid="row-select">
          <SSelect v-model="form.status" label="Status" :items="statuses" :density="density" />
          <SButton color="primary" :density="density">Apply</SButton>
        </SFormRow>
        <SFormRow data-testid="row-number">
          <SNumberInput v-model="form.amount" label="Amount" :density="density" />
          <SButton :density="density">Add</SButton>
        </SFormRow>
        <SFormRow data-testid="row-autocomplete">
          <SAutocomplete v-model="form.fruit" label="Fruit" :items="fruits" :density="density" />
          <SButton :density="density">Pick</SButton>
        </SFormRow>
        <SFormRow data-testid="row-file">
          <SFileInput v-model="form.files" label="Attachment" :density="density" />
          <SButton :density="density">Upload</SButton>
        </SFormRow>
        <STextarea v-model="form.note" label="Note" :rows="2" :density="density" />
      </SForm>
      <SToolbar :density="density" color="primary">
        <SToolbarTitle>Orders</SToolbarTitle>
      </SToolbar>
      <SList :density="density" outlined>
        <SListItem><SListItemContent><SListItemTitle>First item</SListItemTitle></SListItemContent></SListItem>
        <SListItem><SListItemContent><SListItemTitle>Second item</SListItemTitle></SListItemContent></SListItem>
      </SList>
      <STable :headers="tableHeaders" :items="tableItems" :density="density" outlined hide-pagination />
      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <SChip :density="density">Chip</SChip>
        <SChip :density="density" size="small">Small chip</SChip>
      </div>
    </div>
  `,
})

const FIELD_BOX_SELECTOR = [
  '.s_input__field',
  '.s_select__activator',
  '.s_numberInput__field',
  '.s_autocomplete__inputFieldContent',
  '.s_fileInput__field',
].join(', ')

const getHeight = (block: Element, selector: string) => block.querySelector(selector)?.getBoundingClientRect().height

// Parts measured in both blocks, with how many density steps each loses (the toolbar steps are 8px).
// `stepScale: null` only checks that the part got shorter: the stacked SNumberInput arrows and the SFileInput
// icon make those default fields taller than the others; at a non-default density they take the shared height.
const MEASURED_PARTS: Array<{ selector: string; stepScale: number | null }> = [
  { selector: '[data-testid="row-input"] .s_input__field', stepScale: 1 },
  { selector: '[data-testid="row-input"] > .s_button', stepScale: 1 },
  { selector: '[data-testid="row-select"] .s_select__activator', stepScale: 1 },
  { selector: '[data-testid="row-number"] .s_numberInput__field', stepScale: null },
  { selector: '[data-testid="row-autocomplete"] .s_autocomplete__inputFieldContent', stepScale: 1 },
  { selector: '[data-testid="row-file"] .s_fileInput__field', stepScale: null },
  { selector: '.s_textarea__input', stepScale: 1 },
  { selector: '.s_listItem', stepScale: 1 },
  { selector: '.s_tableBodyCell', stepScale: 1 },
  { selector: '.s_chip', stepScale: 1 },
  { selector: '.s_toolbar__content', stepScale: 2 },
]

const expectShorterThanDefault = async (canvasElement: HTMLElement, density: DensityType) => {
  const reference = canvasElement.querySelector('[data-density="default"]')
  const variant = canvasElement.querySelector(`[data-density="${density}"]`)

  await expect(reference && variant, 'both density blocks render').toBeTruthy()
  if (!reference || !variant) {
    return
  }

  for (const { selector, stepScale } of MEASURED_PARTS) {
    const defaultHeight = getHeight(reference, selector) ?? 0
    const densityHeight = getHeight(variant, selector) ?? 0

    await expect(defaultHeight, `${selector} renders`).toBeGreaterThan(0)
    if (stepScale === null) {
      await expect(densityHeight, `${selector} at ${density}`).toBeLessThan(defaultHeight)
      continue
    }

    const expectedLoss = DENSITY_STEP_PX * DENSITY_STEPS[density] * stepScale

    await expect(
      Math.abs(defaultHeight - densityHeight - expectedLoss),
      `${selector} at ${density} (${defaultHeight} → ${densityHeight})`,
    ).toBeLessThanOrEqual(ALIGN_TOLERANCE_PX)
  }
}

// In every SFormRow the button sits level with the field box beside it and is as tall, or (on a narrow screen)
// wraps onto its own line with the same height.
// Only the density block is checked: the default block is today's look, covered by the form stress stories.
const expectRowsAligned = async (canvasElement: HTMLElement, density: DensityType) => {
  const rows = canvasElement.querySelectorAll(`[data-density="${density}"] .s_formRow`)

  await expect(rows.length, 'form rows').toBeGreaterThan(0)
  for (const row of Array.from(rows)) {
    const rowLabel = `${density} ${row.getAttribute('data-testid')}`
    const button = row.querySelector(':scope > .s_button')
    const field = button?.previousElementSibling
    const boxRect = field?.querySelector(FIELD_BOX_SELECTOR)?.getBoundingClientRect()
    const fieldRect = field?.getBoundingClientRect()
    const buttonRect = button?.getBoundingClientRect()

    await expect(boxRect && fieldRect && buttonRect, `${rowLabel}: field box and button`).toBeTruthy()
    if (!boxRect || !fieldRect || !buttonRect || !button) {
      continue
    }

    await expect(Math.abs(buttonRect.height - boxRect.height), `${rowLabel}: button height`).toBeLessThanOrEqual(
      ALIGN_TOLERANCE_PX,
    )
    if (buttonRect.top < fieldRect.bottom) {
      await expect(Math.abs(buttonRect.top - boxRect.top), `${rowLabel}: button top`).toBeLessThanOrEqual(
        ALIGN_TOLERANCE_PX,
      )
    }
  }
}

const renderDensityPair = (density: DensityType) => () =>
  defineComponent({
    components: { DensityBlock },
    setup: () => ({ density }),
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start;">
        <div style="flex: 1 1 320px; min-width: 0;"><DensityBlock density="default" /></div>
        <div style="flex: 1 1 320px; min-width: 0;"><DensityBlock :density="density" /></div>
      </div>
    `,
  })

export const Compact = {
  tags: ['visual'],
  render: renderDensityPair('compact'),
  play: async ({ canvasElement }) => {
    await expectShorterThanDefault(canvasElement, 'compact')
    await expectRowsAligned(canvasElement, 'compact')
  },
} satisfies StoryObj

export const Comfortable = {
  tags: ['visual'],
  render: renderDensityPair('comfortable'),
  play: async ({ canvasElement }) => {
    await expectShorterThanDefault(canvasElement, 'comfortable')
    await expectRowsAligned(canvasElement, 'comfortable')
  },
} satisfies StoryObj
