import { homedir } from 'node:os'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CONFIG_SUBCOMMAND, EXIT_CODE_FAILURE } from './constants'
import { runConfigCommand } from './handlers'
import { createSuiMcpServer } from './server'

const [subcommand, ...subcommandArgs] = process.argv.slice(2)

// stdout carries the MCP protocol, so failures go to stderr only.
const startServer = async () => {
  await createSuiMcpServer().connect(new StdioServerTransport())
}

if (subcommand === CONFIG_SUBCOMMAND) {
  process.exitCode = runConfigCommand(subcommandArgs, {
    stdout: (text) => process.stdout.write(text),
    stderr: (text) => process.stderr.write(text),
    cwd: process.cwd(),
    homeDir: homedir(),
  })
} else {
  startServer().catch((error: unknown) => {
    process.stderr.write(`sui-mcp failed to start: ${String(error)}\n`)
    process.exit(EXIT_CODE_FAILURE)
  })
}
