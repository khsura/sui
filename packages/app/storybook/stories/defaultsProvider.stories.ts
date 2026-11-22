import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { expect, waitFor } from 'storybook/test'
import { SButton, SChip, SDefaultsProvider, SFormRow, SInput } from '@/app/index'
import { createStoryObj } from '@/app/storybook/helpers'

const defaultsProvider: Meta<typeof SDefaultsProvider> = {
  title: 'UI Components/DefaultsProvider',
  component: SDefaultsProvider,
  argTypes: {
    defaults: { control: 'object' },
  },
}

export default defaultsProvider

export const DefaultsProvider = createStoryObj<typeof SDefaultsProvider>({
  args: {
    defaults: { SButton: { size: 'small', variant: 'text' }, global: { size: 'small' } },
  },
  render: (args) =>
    defineComponent({
      components: { SButton, SChip, SDefaultsProvider },
      setup() {
        return { args }
      },
      template: /* html */ `
        <SDefaultsProvider v-bind="args">
          <div style="display: flex; gap: 8px; align-items: center">
            <SButton>Edit</SButton>
            <SButton>Duplicate</SButton>
            <SChip>Draft</SChip>
          </div>
        </SDefaultsProvider>
      `,
    }),
})

// Sub-pixel rounding allowed in the geometry checks.
const pixelTolerance = 1
const smallButtonClass = 's_button--size__small'

// The same filter bar markup, once inside a provider (dense) and once outside (default sizes).
const filterBar = /* html */ `
  <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 8px">
    <SChip>Status: open</SChip>
    <SChip>Owner: me</SChip>
  </div>
  <SFormRow>
    <SInput label="Search" placeholder="Search orders" hide-details />
    <SButton color="primary">Apply</SButton>
    <SButton>Reset</SButton>
  </SFormRow>
`

// A plain object literal, so Storybook's static indexer reads the `visual` tag.
export const DefaultsProviderStress = {
  tags: ['visual'],
  render: () => ({
    components: { SButton, SChip, SDefaultsProvider, SFormRow, SInput },
    template: /* html */ `
      <div class="s_pa__4" style="display: flex; flex-direction: column; gap: 24px">
        <section data-testid="dense">
          <p>Inside SDefaultsProvider (global size small, dense SInput)</p>
          <SDefaultsProvider :defaults="{ global: { size: 'small' }, SInput: { dense: true } }">${filterBar}</SDefaultsProvider>
        </section>
        <section data-testid="nested">
          <p>Nested provider: inner SButton variant text, size inherited</p>
          <SDefaultsProvider :defaults="{ global: { size: 'small' }, SInput: { dense: true } }">
            <SDefaultsProvider :defaults="{ SButton: { variant: 'text' } }">${filterBar}</SDefaultsProvider>
          </SDefaultsProvider>
        </section>
        <section data-testid="regular">
          <p>Outside (default sizes)</p>
          ${filterBar}
        </section>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.ownerDocument.documentElement
    const buttonsIn = (testId: string) => [...canvasElement.querySelectorAll(`[data-testid="${testId}"] .s_button`)]

    await waitFor(() => expect(buttonsIn('regular').length).toBe(2))

    for (const button of [...buttonsIn('dense'), ...buttonsIn('nested')]) {
      await expect(button.classList.contains(smallButtonClass)).toBe(true)
    }

    for (const button of buttonsIn('nested')) {
      await expect(button.classList.contains('s_button--text')).toBe(true)
    }

    for (const button of buttonsIn('regular')) {
      await expect(button.classList.contains(smallButtonClass)).toBe(false)
    }

    const [denseButton] = buttonsIn('dense')
    const [regularButton] = buttonsIn('regular')

    await expect(denseButton?.getBoundingClientRect().height).toBeLessThan(
      regularButton?.getBoundingClientRect().height ?? 0,
    )
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + pixelTolerance)
  },
} satisfies StoryObj<typeof SDefaultsProvider>
