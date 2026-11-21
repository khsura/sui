import type { JsonObject, McpClientId, McpClientTarget } from '../types'
import {
  CLAUDE_CODE_CONFIG_FILE,
  CLAUDE_CODE_MARKERS,
  CLIENT_CLAUDE_CODE,
  CLIENT_CURSOR,
  CLIENT_VSCODE,
  CLIENT_WINDSURF,
  CONFIG_ACTION_PRINT,
  CONFIG_ACTION_WRITE,
  CURSOR_CONFIG_FILE,
  CURSOR_MARKERS,
  MCP_SERVERS_KEY,
  STDIO_TRANSPORT_TYPE,
  SUI_SERVER_ARGS,
  SUI_SERVER_COMMAND,
  VSCODE_CONFIG_FILE,
  VSCODE_MARKERS,
  VSCODE_SERVERS_KEY,
  WINDSURF_CONFIG_FILE,
  WINDSURF_HOME_MARKER,
  WINDSURF_PROJECT_MARKERS,
} from '../constants'

const stdioEntry: JsonObject = { command: SUI_SERVER_COMMAND, args: [...SUI_SERVER_ARGS] }

/** Where and how each MCP client reads its server list. */
export const mcpClientTargets: Record<McpClientId, McpClientTarget> = {
  [CLIENT_CLAUDE_CODE]: {
    client: CLIENT_CLAUDE_CODE,
    label: 'Claude Code',
    action: CONFIG_ACTION_WRITE,
    configFile: CLAUDE_CODE_CONFIG_FILE,
    serversKey: MCP_SERVERS_KEY,
    entry: stdioEntry,
    projectMarkers: CLAUDE_CODE_MARKERS,
    homeMarkers: [],
  },
  [CLIENT_CURSOR]: {
    client: CLIENT_CURSOR,
    label: 'Cursor',
    action: CONFIG_ACTION_WRITE,
    configFile: CURSOR_CONFIG_FILE,
    serversKey: MCP_SERVERS_KEY,
    entry: stdioEntry,
    projectMarkers: CURSOR_MARKERS,
    homeMarkers: [],
  },
  [CLIENT_VSCODE]: {
    client: CLIENT_VSCODE,
    label: 'VS Code',
    action: CONFIG_ACTION_WRITE,
    configFile: VSCODE_CONFIG_FILE,
    serversKey: VSCODE_SERVERS_KEY,
    entry: { type: STDIO_TRANSPORT_TYPE, ...stdioEntry },
    projectMarkers: VSCODE_MARKERS,
    homeMarkers: [],
  },
  [CLIENT_WINDSURF]: {
    client: CLIENT_WINDSURF,
    label: 'Windsurf',
    action: CONFIG_ACTION_PRINT,
    configFile: WINDSURF_CONFIG_FILE,
    serversKey: MCP_SERVERS_KEY,
    entry: stdioEntry,
    projectMarkers: WINDSURF_PROJECT_MARKERS,
    homeMarkers: [WINDSURF_HOME_MARKER],
  },
}
