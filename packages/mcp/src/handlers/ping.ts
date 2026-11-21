import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { serverInfo } from '../configs'
import { PING_RESPONSE, PING_TOOL_NAME } from '../constants'

export const registerPingTool = (server: McpServer): void => {
  server.registerTool(PING_TOOL_NAME, { description: 'Health check. Returns "pong" and the sui-mcp version.' }, () => ({
    content: [{ type: 'text', text: `${PING_RESPONSE} ${serverInfo.version}` }],
  }))
}
