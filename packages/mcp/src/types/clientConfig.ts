import type {
  CONFIG_ACTION_PRINT,
  CONFIG_ACTION_WRITE,
  CONFIG_STATUS_ADDED,
  CONFIG_STATUS_CREATED,
  CONFIG_STATUS_UNCHANGED,
  CONFIG_STATUS_UPDATED,
  MCP_CLIENT_IDS,
} from '../constants'

export type McpClientId = (typeof MCP_CLIENT_IDS)[number]

/** A JSON value parsed from a client config file. */
export type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject
export interface JsonObject {
  [key: string]: JsonValue
}

export interface McpClientTarget {
  client: McpClientId
  label: string
  /** `write`: a file inside the project; `print`: a user-level file the CLI only prints a snippet for. */
  action: typeof CONFIG_ACTION_WRITE | typeof CONFIG_ACTION_PRINT
  /** Relative to the project (write) or the home directory (print). */
  configFile: string
  serversKey: string
  entry: JsonObject
  /** Project-relative paths whose presence marks the client as used. */
  projectMarkers: readonly string[]
  /** Home-relative paths whose presence marks the client as installed. */
  homeMarkers: readonly string[]
}

export type McpConfigStatus =
  | typeof CONFIG_STATUS_CREATED
  | typeof CONFIG_STATUS_ADDED
  | typeof CONFIG_STATUS_UPDATED
  | typeof CONFIG_STATUS_UNCHANGED

export interface MergeMcpServerEntryInput {
  /** Current file text, or undefined when the file does not exist. */
  existingText: string | undefined
  serversKey: string
  entryName: string
  entry: JsonObject
}

export interface MergedMcpConfig {
  text: string
  status: McpConfigStatus
}

export interface ClientConfigPlan {
  target: McpClientTarget
  /** Absolute path of the file to write, or the user-level file the snippet belongs in. */
  path: string
  merged: MergedMcpConfig
}

export interface ConfigCommandOptions {
  clients: McpClientId[]
  dryRun: boolean
  projectDir: string
}

export interface ClientDetectionOptions {
  projectDir: string
  homeDir: string
}

export interface ConfigCommandIo {
  stdout: (text: string) => void
  stderr: (text: string) => void
  cwd: string
  homeDir: string
}
