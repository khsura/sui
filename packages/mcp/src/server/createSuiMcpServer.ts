import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { serverInfo } from '../configs'
import { registerPingTool } from '../handlers'

export const createSuiMcpServer = (): McpServer => {
  const server = new McpServer(serverInfo)

  registerPingTool(server)

  return server
}
