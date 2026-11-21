import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { Component } from 'vue'
import { waitFor, within } from 'storybook/test'
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
// Sub-pixel rounding allowed in the geometry check.
const pixelTolerance = 1
const sortOptionCount = 3

const recipeStory = (recipe: Component): StoryObj => ({
  render: () => ({
    components: { recipe },
    template: '<recipe />',
  }),
})

// Right edge of the rendered text itself (not of the boxes around it, which stretch to the item's padding).
const getTextRight = (element: Element) => {
  const ownerDocument = element.ownerDocument
  const walker = ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  const range = ownerDocument.createRange()
  let textRight = 0

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.textContent?.trim()) {
      range.selectNodeContents(node)
      textRight = Math.max(textRight, range.getBoundingClientRect().right)
    }
  }

  return textRight
}

export const AppShell = recipeStory(AppShellRecipe)
export const ValidatedForm = recipeStory(ValidatedFormRecipe)

// The sort menu is opened, so the screenshot covers the menu items: "Last modified" must not touch the menu edge.
export const ActivatorOverlays: StoryObj = {
  ...recipeStory(ActivatorOverlaysRecipe),
  play: async ({ canvasElement, userEvent }) => {
    const ownerDocument = canvasElement.ownerDocument

    await userEvent.click(await within(canvasElement).findByRole('button', { name: /sort by/i }))

    await waitFor(() => {
      const menu = ownerDocument.querySelector('.s_menu__content')
      const items = [...ownerDocument.querySelectorAll('.s_menu__content .s_listItem')]

      // Plain throws: `waitFor` retries until the callback stops throwing.
      if (!menu || items.length !== sortOptionCount) {
        throw new Error('the sort menu did not open')
      }

      const menuRight = menu.getBoundingClientRect().right

      for (const item of items) {
        const gap = menuRight - getTextRight(item)

        if (gap < menuItemEndPadding - pixelTolerance) {
          throw new Error(`"${item.textContent?.trim() ?? ''}" ends ${gap}px from the menu edge`)
        }
      }
    })
  },
}

export const DataTable = recipeStory(DataTableRecipe)
export const ResponsiveGrid = recipeStory(ResponsiveGridRecipe)
export const ThemeSetup = recipeStory(ThemeSetupRecipe)
