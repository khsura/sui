import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { LoadSuiApi } from '../types'
import { LIST_COMPONENTS_TOOL_NAME } from '../constants'
import { useComponentCatalogService } from '../services'
import { formatComponentList } from '../utils'
import { textResult, withSuiApi } from './toolResult'

export const registerListComponentsTool = (server: McpServer, loadSuiApi: LoadSuiApi): void => {
  server.registerTool(
    LIST_COMPONENTS_TOOL_NAME,
    {
      description:
        'Lists every @khsura/sui component with its family and a one-line purpose. States the SUI version and whether it came from the project install or the bundled copy.',
    },
    () =>
      withSuiApi(loadSuiApi, (resolved) =>
        textResult(formatComponentList(resolved, useComponentCatalogService(resolved.api).listComponents())),
      ),
  )
}
