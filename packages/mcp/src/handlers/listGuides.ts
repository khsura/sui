import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { GuideSourceOptions } from '../types'
import { LIST_GUIDES_TOOL_NAME } from '../constants'
import { useGuideCatalogService } from '../services'
import { formatGuideList } from '../utils'
import { textResult } from './toolResult'

export const registerListGuidesTool = (server: McpServer, guideSourceOptions: GuideSourceOptions): void => {
  server.registerTool(
    LIST_GUIDES_TOOL_NAME,
    {
      description:
        'Lists the @khsura/sui setup guides (installation, theming, component defaults, display breakpoints, i18n, common mistakes) with the topic to pass to get_guide.',
    },
    () => textResult(formatGuideList(useGuideCatalogService(guideSourceOptions).listGuides())),
  )
}
