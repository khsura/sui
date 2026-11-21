import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { GuideSourceOptions } from '../types'
import { GET_GUIDE_TOOL_NAME } from '../constants'
import { getGuideInputSchema } from '../schemas'
import { useGuideCatalogService } from '../services'
import { formatUnknownGuide } from '../utils'
import { textResult } from './toolResult'

export const registerGetGuideTool = (server: McpServer, guideSourceOptions: GuideSourceOptions): void => {
  server.registerTool(
    GET_GUIDE_TOOL_NAME,
    {
      description:
        'Returns one @khsura/sui setup guide as markdown, taken from the current SUI docs: installation (Vue and Nuxt, styles, @mdi/font), theming (theme colors and dark mode), component-defaults, display (useDisplay breakpoints), i18n, common-mistakes. Unknown topics return the topic list.',
      inputSchema: getGuideInputSchema,
    },
    ({ topic }) => {
      try {
        const lookup = useGuideCatalogService(guideSourceOptions).getGuide(topic)

        return lookup.found ? textResult(lookup.markdown) : textResult(formatUnknownGuide(topic, lookup.topics), true)
      } catch (error) {
        return textResult(error instanceof Error ? error.message : String(error), true)
      }
    },
  )
}
