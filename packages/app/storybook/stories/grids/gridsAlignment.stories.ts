import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { waitFor } from 'storybook/test'
import { SCard, SCardText, SColumn, SRow } from '@/app/index'

/**
 * A grid between a heading and a paragraph (the after-M2 eval: the fields and cards sat 8–16px inside the text
 * around them). `SRow` pads itself and each `SColumn` by half a gutter, so a default row starts a gutter inside
 * its siblings. `no-outer-gutters` drops the row's own padding and `:gap` replaces the columns' padding with a
 * gap between them, so the first column starts, and the last one ends, exactly where the text does.
 */
const gridsAlignment: Meta = {
  title: 'UI Components/Grids/Alignment',
}

export default gridsAlignment

const GRID_GAP = 16
const PIXEL_TOLERANCE = 1

const assertThat = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const getRect = (root: HTMLElement, selector: string) => {
  const element = root.querySelector(selector)

  if (!element) {
    throw new Error(`${selector} not found`)
  }

  return element.getBoundingClientRect()
}

export const GridAlignedWithText = {
  tags: ['visual'],
  render: () => ({
    components: { SCard, SCardText, SColumn, SRow },
    setup: () => ({ gridGap: GRID_GAP }),
    template: /* html */ `
      <SCard :max-width="720">
        <SCardText>
          <h2 class="s_text--h6 s_mb__3 grid-align-heading">Shipping details</h2>
          <SRow no-outer-gutters :gap="gridGap" class="grid-align-row">
            <SColumn :cols="12" :sm="6" class="grid-align-first">
              <SCard outlined class="s_pa__3">Billing address</SCard>
            </SColumn>
            <SColumn :cols="12" :sm="6" class="grid-align-last">
              <SCard outlined class="s_pa__3">Delivery address</SCard>
            </SColumn>
          </SRow>
          <p class="s_text--body__2 s_mt__3 grid-align-paragraph">
            Both addresses line up with this paragraph and with the heading above.
          </p>
        </SCardText>
      </SCard>
    `,
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const heading = getRect(canvasElement, '.grid-align-heading')
      const paragraph = getRect(canvasElement, '.grid-align-paragraph')
      const firstCard = getRect(canvasElement, '.grid-align-first .s_card')
      const lastCard = getRect(canvasElement, '.grid-align-last .s_card')

      assertThat(
        Math.abs(firstCard.left - heading.left) <= PIXEL_TOLERANCE,
        `the first column starts ${firstCard.left - heading.left}px from the heading`,
      )
      assertThat(
        Math.abs(firstCard.left - paragraph.left) <= PIXEL_TOLERANCE,
        `the first column starts ${firstCard.left - paragraph.left}px from the paragraph`,
      )
      assertThat(
        Math.abs(lastCard.right - paragraph.right) <= PIXEL_TOLERANCE,
        `the last column ends ${paragraph.right - lastCard.right}px before the paragraph`,
      )
    })
  },
} satisfies StoryObj
