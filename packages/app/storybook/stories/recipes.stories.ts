import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, waitFor } from 'storybook/test'
import type { Component } from 'vue'
import {
  ActivatorOverlaysRecipe,
  AppShellRecipe,
  CenteredPageRecipe,
  DataTableRecipe,
  FilterBarRecipe,
  ResponsiveGridRecipe,
  ThemeSetupRecipe,
  ValidatedFormRecipe,
} from '@/app/storybook/recipes'

// Each story renders one copy-ready recipe from storybook/recipes; the sui-mcp get_recipe tool serves the same files.
const recipes: Meta = {
  title: 'Recipes',
  // `visual` stories are screenshotted by the visual regression harness.
  tags: ['visual'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default recipes

// Space a menu keeps between its longest item title and its right edge (the SListItem padding inside SMenu).
const menuItemEndPadding = 16
// Sub-pixel rounding allowed in the size checks.
const pixelTolerance = 1
const sortOptionCount = 3

const recipeStory = (recipe: Component): StoryObj => ({
  render: () => ({
    components: { recipe },
    template: '<recipe />',
  }),
})

export const AppShell = recipeStory(AppShellRecipe)
export const ValidatedForm = recipeStory(ValidatedFormRecipe)

// The sort menu is opened, so the screenshot covers the menu items: "Last modified" must not touch the menu edge.
export const ActivatorOverlays: StoryObj = {
  ...recipeStory(ActivatorOverlaysRecipe),
  play: async ({ canvasElement, userEvent }) => {
    const ownerDocument = canvasElement.ownerDocument

    const sortButton = [...canvasElement.querySelectorAll('button')].find((button) =>
      /sort by/i.test(button.textContent ?? ''),
    )

    if (!sortButton) {
      throw new Error('the "Sort by" button is missing')
    }

    await userEvent.click(sortButton)

    // Layout sizes (padding, scroll width), not bounding boxes, so the menu's open transition does not skew them.
    await waitFor(() => {
      const items = [...ownerDocument.querySelectorAll<HTMLElement>('.s_menu__content .s_listItem')]

      // Plain throws: `waitFor` retries until the callback stops throwing.
      if (items.length !== sortOptionCount) {
        throw new Error('the sort menu did not open')
      }

      for (const item of items) {
        const label = item.textContent?.trim() ?? ''
        const endPadding = parseFloat(getComputedStyle(item).paddingRight)

        if (endPadding < menuItemEndPadding - pixelTolerance) {
          throw new Error(`"${label}" has ${endPadding}px right padding, so it touches the menu edge`)
        }

        if (item.scrollWidth > item.clientWidth + pixelTolerance) {
          throw new Error(`"${label}" overflows into its right padding`)
        }
      }
    })
  },
}

export const DataTable = recipeStory(DataTableRecipe)
export const FilterBar = recipeStory(FilterBarRecipe)
// Allowed distance (px) between the grid's outer edges and the heading / paragraph edges.
const EDGE_TOLERANCE = 1

// Every row starts and ends where the heading and paragraph above it do (no-outer-gutters + gap), at every width.
export const ResponsiveGrid: StoryObj = {
  ...recipeStory(ResponsiveGridRecipe),
  play: async ({ canvasElement }) => {
    const heading = canvasElement.querySelector('h1')
    const paragraph = heading?.nextElementSibling
    const rows = [...canvasElement.querySelectorAll('.s_row')]

    await expect(heading).not.toBeNull()
    await expect(rows.length).toBeGreaterThan(0)
    await waitFor(async () => {
      const headingLeft = heading?.getBoundingClientRect().left ?? 0
      const paragraphRight = paragraph?.getBoundingClientRect().right ?? 0

      for (const row of rows) {
        const columns = [...row.querySelectorAll(':scope > .s_row__content > .s_column')]
        const lefts = columns.map((column) => column.getBoundingClientRect().left)
        const rights = columns.map((column) => column.getBoundingClientRect().right)

        await expect(Math.abs(Math.min(...lefts) - headingLeft)).toBeLessThanOrEqual(EDGE_TOLERANCE)
        await expect(Math.abs(Math.max(...rights) - paragraphRight)).toBeLessThanOrEqual(EDGE_TOLERANCE)
      }
    })
  },
}
export const ThemeSetup = recipeStory(ThemeSetupRecipe)

// Allowed distance (px) between the card's vertical centre and the viewport's.
const CENTRE_TOLERANCE = 2

// Rendered straight inside SApp (no Storybook SMain), as a routed page is. The harness runs the play function at
// every captured width (375, 768, 1280): the card must be vertically centred in the viewport at each.
export const CenteredPage: StoryObj = {
  ...recipeStory(CenteredPageRecipe),
  parameters: {
    appDecorator: { main: false },
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('.s_card')

    await expect(card).not.toBeNull()
    await waitFor(async () => {
      const cardBox = card?.getBoundingClientRect()
      const cardCentre = cardBox ? cardBox.top + cardBox.height / 2 : 0
      const viewportCentre = window.innerHeight / 2

      await expect(Math.abs(cardCentre - viewportCentre)).toBeLessThanOrEqual(CENTRE_TOLERANCE)
    })
  },
}

// Smallest gap (px) between the text box of a field's error message (line height included) and the next control.
// Without spacing it is about 7.5px (the text visibly touches the control); with it, about 15.5px.
const MIN_ERROR_GAP = 12

/** Bottom of the text itself (not of the error line's box, which reserves room below it). */
const getTextBottom = (element: Element | null) => {
  if (!element) {
    throw new Error('error message not found')
  }

  const textRange = document.createRange()

  textRange.selectNodeContents(element)

  return textRange.getBoundingClientRect().bottom
}

const getTop = (element: Element | null) => {
  if (!element) {
    throw new Error('control not found')
  }

  return element.getBoundingClientRect().top
}

// The validated form after an empty submit: every error shows, none touches the control below it, and the submit
// button is disabled until the errors are fixed.
export const ValidatedFormSubmitted: StoryObj = {
  ...recipeStory(ValidatedFormRecipe),
  play: async ({ canvasElement, userEvent }) => {
    const submitButton = canvasElement.querySelector<HTMLButtonElement>('button[type="submit"]')

    await expect(submitButton).toBeEnabled()
    if (submitButton) {
      await userEvent.click(submitButton)
    }

    await waitFor(() => expect(submitButton).toBeDisabled())

    const dateError = canvasElement.querySelector('.s_datePickerInput .s_formInputError.s_visible')
    const checkboxError = canvasElement.querySelector('.s_checkbox .s_formInputError.s_visible')
    const checkboxBox = canvasElement.querySelector('.s_checkbox__container')

    await expect(getTop(checkboxBox) - getTextBottom(dateError)).toBeGreaterThanOrEqual(MIN_ERROR_GAP)
    await expect(getTop(submitButton) - getTextBottom(checkboxError)).toBeGreaterThanOrEqual(MIN_ERROR_GAP)
  },
}
