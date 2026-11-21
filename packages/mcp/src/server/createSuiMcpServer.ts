import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { GuideSourceOptions, RecipeSourceOptions, ResolveSuiApiOptions } from '../types'
import { serverInfo } from '../configs'
import {
  registerGetComponentApiTool,
  registerGetGuideTool,
  registerGetRecipeTool,
  registerListComponentsTool,
  registerListGuidesTool,
  registerListRecipesTool,
  registerPingTool,
  registerValidateSuiTemplateTool,
} from '../handlers'
import { resolveSuiApi } from '../services'

/**
 * `apiSourceOptions` overrides where sui-api.json is looked up (tests inject env, cwd and a bundled path);
 * `guideSourceOptions` overrides where the guide markdown is read from;
 * `recipeSourceOptions` overrides where the recipe `.vue` / `.md` files are read from.
 */
export const createSuiMcpServer = (
  apiSourceOptions: ResolveSuiApiOptions = {},
  guideSourceOptions: GuideSourceOptions = {},
  recipeSourceOptions: RecipeSourceOptions = {},
): McpServer => {
  const server = new McpServer(serverInfo)
  const loadSuiApi = () => resolveSuiApi(apiSourceOptions)

  registerPingTool(server)
  registerListComponentsTool(server, loadSuiApi)
  registerGetComponentApiTool(server, loadSuiApi)
  registerListGuidesTool(server, guideSourceOptions)
  registerGetGuideTool(server, guideSourceOptions)
  registerValidateSuiTemplateTool(server, loadSuiApi)
  registerListRecipesTool(server, recipeSourceOptions)
  registerGetRecipeTool(server, recipeSourceOptions)

  return server
}
