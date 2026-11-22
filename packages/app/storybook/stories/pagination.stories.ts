import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import { expect, waitFor } from 'storybook/test'
import { SPagination } from '@/app/index'
import { argTypesColor, argTypesSizePreset } from '@/app/storybook/argTypes'
import { createStoryObj } from '@/app/storybook/helpers'

const pagination: Meta<typeof SPagination> = {
  title: 'UI Components/Pagination',
  component: SPagination,
  tags: ['a11y'],
  argTypes: {
    ...argTypesColor,
    ...argTypesSizePreset,
    modelValue: { control: { type: 'number', min: 1 } },
    length: { control: { type: 'number', min: 0 } },
    totalVisible: { control: { type: 'number', min: 1 } },
    compact: { control: { type: 'select' }, options: [undefined, true, false] },
  },
}

export default pagination

export const Pagination = createStoryObj<typeof SPagination>({
  args: {
    modelValue: 5,
    length: 20,
    totalVisible: 7,
    showFirstLastPage: true,
    compact: undefined,
    disabled: false,
    color: 'primary',
    size: null,
    ariaLabel: 'Pagination',
    pageAriaLabel: 'Page',
    firstAriaLabel: 'First page',
    prevAriaLabel: 'Previous page',
    nextAriaLabel: 'Next page',
    lastAriaLabel: 'Last page',
  },
  render: (args) =>
    defineComponent({
      components: { SPagination },
      setup() {
        const page = ref(args.modelValue ?? 1)

        return { args, page }
      },
      template: /* html */ `
        <div>
          <SPagination v-bind="args" v-model="page"></SPagination>
          <p class="s_mt__4">Page {{ page }} of {{ args.length }}</p>
        </div>
      `,
    }),
})

// Sub-pixel rounding allowed in the geometry checks.
const pixelTolerance = 1
// The phone width every pagination in the frame must fit without scrolling sideways.
const phoneWidth = 375

const assertThat = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const getRect = (element: Element | null | undefined) => {
  if (!element) {
    throw new Error('element not found')
  }

  return element.getBoundingClientRect()
}

// The cases AI code gets wrong: many pages on a phone, every size, first/last buttons that do not fit,
// four-digit page numbers, a pagination in a flex row beside a label, colours, disabled, and dark theme.
// A plain object literal, so Storybook's static indexer reads the `visual` tag.
export const PaginationStress = {
  tags: ['visual'],
  render: () => ({
    components: { SPagination },
    setup() {
      return { phoneWidth, page: ref(10), lastPage: ref(1000) }
    },
    template: /* html */ `
      <div class="s_pa__4" style="display: flex; flex-direction: column; gap: 16px">
        <SPagination v-model="page" :length="20" show-first-last-page></SPagination>
        <SPagination :model-value="1" :length="3" color="success"></SPagination>
        <SPagination :model-value="4" :length="8" disabled></SPagination>
        <SPagination :model-value="5" :length="10" theme="dark" color="secondary"></SPagination>
        <div class="stress-phone" :style="{ width: phoneWidth + 'px', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '12px', outline: '1px dashed currentColor' }">
          <SPagination v-model="page" :length="20" show-first-last-page class="stress-auto-compact"></SPagination>
          <SPagination v-model="page" :length="20" size="mini"></SPagination>
          <SPagination v-model="page" :length="20" size="small"></SPagination>
          <SPagination v-model="page" :length="20" size="large" show-first-last-page></SPagination>
          <SPagination v-model="page" :length="20" size="extra" show-first-last-page></SPagination>
          <SPagination v-model="lastPage" :length="1000" :total-visible="9" show-first-last-page></SPagination>
          <div style="display: flex; align-items: center; gap: 8px">
            <span>Results</span>
            <SPagination v-model="page" :length="50" show-first-last-page></SPagination>
          </div>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.ownerDocument.documentElement
    const phone = canvasElement.querySelector('.stress-phone')

    await waitFor(() => {
      const frame = getRect(phone)
      const paginations = [...(phone?.querySelectorAll('.s_pagination') ?? [])]

      assertThat(paginations.length === 7, `expected 7 paginations in the frame, found ${paginations.length}`)

      for (const [index, nav] of paginations.entries()) {
        const buttons = [...nav.querySelectorAll('button')]
        const rows = new Set(buttons.map((button) => Math.round(getRect(button).top)))

        assertThat(
          nav.querySelectorAll('[aria-current="page"]').length === 1,
          `pagination ${index} has no current page`,
        )
        assertThat(rows.size === 1, `pagination ${index} wraps onto ${rows.size} rows`)
        // Every button stays inside the 375px frame.
        for (const button of buttons) {
          const rect = getRect(button)

          assertThat(
            rect.left >= frame.left - pixelTolerance && rect.right <= frame.right + pixelTolerance,
            `pagination ${index}: button "${button.textContent?.trim()}" overflows the ${phoneWidth}px frame`,
          )
        }
      }

      // Seven page slots plus four arrow buttons do not fit in 375px, so it switched to compact mode by itself.
      assertThat(
        !!phone?.querySelector('.stress-auto-compact.s_pagination--compact'),
        'the pagination with first/last buttons did not switch to compact mode',
      )
    })

    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + pixelTolerance)
  },
} satisfies StoryObj<typeof SPagination>
