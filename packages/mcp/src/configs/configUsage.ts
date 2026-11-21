import { MCP_CLIENT_IDS } from '../constants'

export const configUsage = [
  'Usage: npx @khsura/sui-mcp config [--client <id>] [--dry-run] [--project <dir>]',
  '',
  `  --client <id>     ${MCP_CLIENT_IDS.join(' | ')} (repeatable). Default: detect from the project.`,
  '  --dry-run         Print the planned changes without writing any file.',
  '  --project <dir>   Project folder to configure. Default: the current directory.',
].join('\n')
