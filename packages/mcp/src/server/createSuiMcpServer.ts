import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { ResolveSuiApiOptions } from '../types'
import { serverInfo } from '../configs'
import { registerGetComponentApiTool, registerListComponentsTool, registerPingTool } from '../handlers'
import { resolveSuiApi } from '../services'

/** `apiSourceOptions` overrides where sui-api.json is looked up (tests inject env, cwd and a bundled path). */
export const createSuiMcpServer = (apiSourceOptions: ResolveSuiApiOptions = {}): McpServer => {
  const server = new McpServer(serverInfo)
  const loadSuiApi = () => resolveSuiApi(apiSourceOptions)

  registerPingTool(server)
  registerListComponentsTool(server, loadSuiApi)
  registerGetComponentApiTool(server, loadSuiApi)

  return server
}
