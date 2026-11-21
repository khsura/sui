import type { Meta, StoryObj } from '@storybook/vue3-vite'
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

const recipeStory = (recipe: Component): StoryObj => ({
  render: () => ({
    components: { recipe },
    template: '<recipe />',
  }),
})

export const AppShell = recipeStory(AppShellRecipe)
export const ValidatedForm = recipeStory(ValidatedFormRecipe)
export const ActivatorOverlays = recipeStory(ActivatorOverlaysRecipe)
export const DataTable = recipeStory(DataTableRecipe)
export const ResponsiveGrid = recipeStory(ResponsiveGridRecipe)
export const ThemeSetup = recipeStory(ThemeSetupRecipe)
