import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RecipeSourceOptions } from '../types'
import { GET_RECIPE_TOOL_NAME } from '../constants'
import { getRecipeInputSchema } from '../schemas'
import { useRecipeCatalogService } from '../services'
import { formatRecipe, formatUnknownRecipe } from '../utils'
import { textResult } from './toolResult'

export const registerGetRecipeTool = (server: McpServer, recipeSourceOptions: RecipeSourceOptions): void => {
  server.registerTool(
    GET_RECIPE_TOOL_NAME,
    {
      description:
        'Returns one tested @khsura/sui recipe: its notes (the rules it relies on) and the full copy-ready Vue SFC, plus a link to the live Storybook example. Names: app-shell, validated-form, activator-overlays, data-table, responsive-grid, theme-setup, filter-bar, centered-page. Unknown names return the name list.',
      inputSchema: getRecipeInputSchema,
    },
    ({ name }) => {
      try {
        const lookup = useRecipeCatalogService(recipeSourceOptions).getRecipe(name)

        return lookup.found
          ? textResult(formatRecipe(lookup.recipe))
          : textResult(formatUnknownRecipe(name, lookup.names), true)
      } catch (error) {
        return textResult(error instanceof Error ? error.message : String(error), true)
      }
    },
  )
}
