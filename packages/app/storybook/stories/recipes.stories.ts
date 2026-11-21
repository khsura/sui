import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, waitFor } from 'storybook/test'
import type { Component } from 'vue'
import {
  ActivatorOverlaysRecipe,
  AppShellRecipe,
  DataTableRecipe,
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
export const ResponsiveGrid = recipeStory(ResponsiveGridRecipe)
export const ThemeSetup = recipeStory(ThemeSetupRecipe)

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
