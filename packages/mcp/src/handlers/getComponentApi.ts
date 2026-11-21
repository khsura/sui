import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { LoadSuiApi } from '../types'
import { GET_COMPONENT_API_TOOL_NAME } from '../constants'
import { getComponentApiInputSchema } from '../schemas'
import { useComponentCatalogService } from '../services'
import { formatComponentApi, formatUnknownComponent } from '../utils'
import { textResult, withSuiApi } from './toolResult'

export const registerGetComponentApiTool = (server: McpServer, loadSuiApi: LoadSuiApi): void => {
  server.registerTool(
    GET_COMPONENT_API_TOOL_NAME,
    {
      description:
        'Returns the props, slots and events of one @khsura/sui component as markdown, with usage notes for activator and layout-child components. Unknown names return the closest matches.',
      inputSchema: getComponentApiInputSchema,
    },
    ({ name }) =>
      withSuiApi(loadSuiApi, (resolved) => {
        const lookup = useComponentCatalogService(resolved.api).findComponent(name)

        return lookup.found
          ? textResult(formatComponentApi(resolved, lookup.component))
          : textResult(formatUnknownComponent(resolved, name, lookup.suggestions), true)
      }),
  )
}
