import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { Component } from 'vue'
import { waitFor } from 'storybook/test'
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
