#!/usr/bin/env node
// A one-shot MCP client for the AI eval's "with MCP" condition. Each call spawns the built
// @khsura/sui-mcp server over stdio, runs `initialize`, and prints either the server
// `instructions` (tool name `instructions`) or the text of one tool result. Every call is
// appended as a JSON line to the log file, so tool use can be counted per generator.
//
// Usage (from the repo root, after `yarn build` in packages/app and packages/mcp):
//   node docs/ai-eval/tools/mcpCall.mjs instructions
//   node docs/ai-eval/tools/mcpCall.mjs list_components '{}'
//   node docs/ai-eval/tools/mcpCall.mjs get_component_api '{"name":"SButton"}'
//   node docs/ai-eval/tools/mcpCall.mjs validate_sui_template --file path/to/Page.vue
//
// Environment:
//   SUI_PROJECT_ROOT  passed through to the server (defaults to packages/app, whose
//                     dist/sui-api.json is the local build)
//   SUI_EVAL_LOG      JSONL log of calls (default: none)
//   SUI_EVAL_PAGE     page id written into each log line (e.g. 01-settings)
import { appendFile, readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const serverEntry = join(repoRoot, 'packages/mcp/dist/index.js')
const INSTRUCTIONS_COMMAND = 'instructions'
const LIST_TOOLS_COMMAND = 'tools'
const FILE_FLAG = '--file'

const usage = () => {
  process.stderr.write(
    "Usage: mcpCall.mjs instructions | tools | <tool> ['<json-args>'] | validate_sui_template --file <path.vue>\n",
  )
  process.exit(2)
}

const parseArgs = async (tool, rest) => {
  if (rest[0] === FILE_FLAG) {
    if (!rest[1]) usage()

    return { code: await readFile(resolve(rest[1]), 'utf8') }
  }

  return rest[0] ? JSON.parse(rest[0]) : {}
}

const logCall = async (entry) => {
  const logFile = process.env.SUI_EVAL_LOG

  if (!logFile) return
  const line = { time: new Date().toISOString(), page: process.env.SUI_EVAL_PAGE ?? null, ...entry }

  await appendFile(logFile, `${JSON.stringify(line)}\n`)
}

const main = async () => {
  const [tool, ...rest] = process.argv.slice(2)

  if (!tool) usage()

  const projectRoot = process.env.SUI_PROJECT_ROOT ?? join(repoRoot, 'packages/app')

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverEntry],
    env: { ...process.env, SUI_PROJECT_ROOT: projectRoot },
    stderr: 'ignore',
  })

  const client = new Client({ name: 'sui-ai-eval-generator', version: '1.0.0' })

  await client.connect(transport)

  try {
    if (tool === INSTRUCTIONS_COMMAND) {
      process.stdout.write(`${client.getInstructions() ?? '(no instructions)'}\n`)
      await logCall({ tool })

      return
    }

    if (tool === LIST_TOOLS_COMMAND) {
      const { tools } = await client.listTools()

      process.stdout.write(`${tools.map((entry) => `${entry.name}: ${entry.description ?? ''}`).join('\n')}\n`)
      await logCall({ tool })

      return
    }

    const args = await parseArgs(tool, rest)
    const response = await client.callTool({ name: tool, arguments: args })
    const text = response.content.map((part) => part.text ?? '').join('\n')

    process.stdout.write(`${text}\n`)
    const loggedArgs = 'code' in args ? { ...args, code: `<${args.code.length} chars>` } : args

    await logCall({ tool, args: loggedArgs, isError: Boolean(response.isError) })
    if (response.isError) process.exitCode = 1
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  process.stderr.write(`${error?.message ?? error}\n`)
  process.exit(1)
})
