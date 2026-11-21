import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RecipeSourceOptions } from '../types'
import { LIST_RECIPES_TOOL_NAME } from '../constants'
import { useRecipeCatalogService } from '../services'
import { formatRecipeList } from '../utils'
import { textResult } from './toolResult'

export const registerListRecipesTool = (server: McpServer, recipeSourceOptions: RecipeSourceOptions): void => {
  server.registerTool(
    LIST_RECIPES_TOOL_NAME,
    {
      description:
        'Lists the tested, copy-ready @khsura/sui recipes (app shell, validated form, dialog/menu/tooltip/snackbar activators, data table, responsive grid, theme and dark mode) with when to use each and the name to pass to get_recipe. Start a page from a recipe instead of composing SUI components from scratch.',
    },
    () => {
      try {
        return textResult(formatRecipeList(useRecipeCatalogService(recipeSourceOptions).listRecipes()))
      } catch (error) {
        return textResult(error instanceof Error ? error.message : String(error), true)
      }
    },
  )
}
