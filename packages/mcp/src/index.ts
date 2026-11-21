import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { EXIT_CODE_FAILURE } from './constants'
import { createSuiMcpServer } from './server'

// stdout carries the MCP protocol, so failures go to stderr only.
const startServer = async () => {
  await createSuiMcpServer().connect(new StdioServerTransport())
}

startServer().catch((error: unknown) => {
  process.stderr.write(`sui-mcp failed to start: ${String(error)}\n`)
  process.exit(EXIT_CODE_FAILURE)
})
