import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { ClientConfigPlan, ClientDetectionOptions, McpClientId, McpClientTarget } from '../types'
import { mcpClientTargets } from '../configs'
import {
  CLIENT_CLAUDE_CODE,
  CONFIG_ACTION_WRITE,
  CONFIG_FILE_ENCODING,
  CONFIG_STATUS_UNCHANGED,
  MCP_CLIENT_IDS,
  SUI_SERVER_ENTRY_NAME,
} from '../constants'
import { McpConfigParseError, mergeMcpServerEntry } from '../lib'

const isTargetDetected = (target: McpClientTarget, { projectDir, homeDir }: ClientDetectionOptions): boolean =>
  target.projectMarkers.some((marker) => existsSync(join(projectDir, marker))) ||
  target.homeMarkers.some((marker) => existsSync(join(homeDir, marker)))

/** Clients whose project (or home) markers exist; Claude Code's `.mcp.json` when none do. */
export const detectMcpClients = (options: ClientDetectionOptions): { clients: McpClientId[]; isFallback: boolean } => {
  const detected = MCP_CLIENT_IDS.filter((client) => isTargetDetected(mcpClientTargets[client], options))

  return detected.length
    ? { clients: detected, isFallback: false }
    : { clients: [CLIENT_CLAUDE_CODE], isFallback: true }
}

const targetPath = (target: McpClientTarget, { projectDir, homeDir }: ClientDetectionOptions): string =>
  join(target.action === CONFIG_ACTION_WRITE ? projectDir : homeDir, target.configFile)

/**
 * Plans the `sui` entry for each client without writing anything.
 * Throws McpConfigParseError (naming the file) when an existing config is not valid JSON.
 */
export const planClientConfigs = (clients: McpClientId[], options: ClientDetectionOptions): ClientConfigPlan[] =>
  clients.map((client) => {
    const target = mcpClientTargets[client]
    const path = targetPath(target, options)

    const existingText =
      target.action === CONFIG_ACTION_WRITE && existsSync(path) ? readFileSync(path, CONFIG_FILE_ENCODING) : undefined

    try {
      return {
        target,
        path,
        merged: mergeMcpServerEntry({
          existingText,
          serversKey: target.serversKey,
          entryName: SUI_SERVER_ENTRY_NAME,
          entry: target.entry,
        }),
      }
    } catch (error) {
      if (error instanceof McpConfigParseError) {
        throw new McpConfigParseError(`${path} ${error.message}. Fix or remove it, then run the command again.`)
      }

      throw error
    }
  })

/** Writes every changed in-project plan; print-only and unchanged plans are left alone. */
export const applyClientConfigPlans = (plans: ClientConfigPlan[]): void => {
  plans
    .filter((plan) => plan.target.action === CONFIG_ACTION_WRITE && plan.merged.status !== CONFIG_STATUS_UNCHANGED)
    .forEach((plan) => {
      mkdirSync(dirname(plan.path), { recursive: true })
      writeFileSync(plan.path, plan.merged.text, CONFIG_FILE_ENCODING)
    })
}
