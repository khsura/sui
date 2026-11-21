export const CONFIG_SUBCOMMAND = 'config'

export const CLIENT_CLAUDE_CODE = 'claude-code'
export const CLIENT_CURSOR = 'cursor'
export const CLIENT_VSCODE = 'vscode'
export const CLIENT_WINDSURF = 'windsurf'
export const MCP_CLIENT_IDS = [CLIENT_CLAUDE_CODE, CLIENT_CURSOR, CLIENT_VSCODE, CLIENT_WINDSURF] as const

/** Name of the server entry written into every client config. */
export const SUI_SERVER_ENTRY_NAME = 'sui'
export const SUI_SERVER_COMMAND = 'npx'
export const SUI_SERVER_ARGS = ['-y', '@khsura/sui-mcp'] as const
export const STDIO_TRANSPORT_TYPE = 'stdio'

export const MCP_SERVERS_KEY = 'mcpServers'
export const VSCODE_SERVERS_KEY = 'servers'

export const CLAUDE_CODE_CONFIG_FILE = '.mcp.json'
export const CURSOR_CONFIG_FILE = '.cursor/mcp.json'
export const VSCODE_CONFIG_FILE = '.vscode/mcp.json'
export const WINDSURF_CONFIG_FILE = '.codeium/windsurf/mcp_config.json'

/** Project paths whose presence means the client is in use. */
export const CLAUDE_CODE_MARKERS = ['.mcp.json', '.claude', 'CLAUDE.md'] as const
export const CURSOR_MARKERS = ['.cursor'] as const
export const VSCODE_MARKERS = ['.vscode'] as const
export const WINDSURF_PROJECT_MARKERS = ['.windsurf', '.windsurfrules'] as const
/** Home-relative path whose presence means Windsurf is installed. */
export const WINDSURF_HOME_MARKER = '.codeium/windsurf'

export const JSON_INDENT = 2
export const CONFIG_FILE_ENCODING = 'utf8'

export const CONFIG_STATUS_CREATED = 'created'
export const CONFIG_STATUS_ADDED = 'added'
export const CONFIG_STATUS_UPDATED = 'updated'
export const CONFIG_STATUS_UNCHANGED = 'unchanged'

export const CONFIG_ACTION_WRITE = 'write'
export const CONFIG_ACTION_PRINT = 'print'

export const EXIT_CODE_SUCCESS = 0
