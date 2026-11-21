import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
import type { ClientConfigPlan, ConfigCommandIo, ConfigCommandOptions, McpClientId } from '../types'
import { configUsage } from '../configs'
import {
  CONFIG_ACTION_PRINT,
  CONFIG_STATUS_CREATED,
  CONFIG_STATUS_UNCHANGED,
  EXIT_CODE_FAILURE,
  EXIT_CODE_SUCCESS,
  MCP_CLIENT_IDS,
  SUI_SERVER_ENTRY_NAME,
} from '../constants'
import { mcpServerSnippet } from '../lib'
import { mcpClientIdSchema } from '../schemas'
import { applyClientConfigPlans, detectMcpClients, planClientConfigs } from '../services'

const parseClient = (client: string): McpClientId => {
  const parsed = mcpClientIdSchema.safeParse(client)

  if (!parsed.success) {
    throw new Error(`Unknown client "${client}". Use one of: ${MCP_CLIENT_IDS.join(', ')}.`)
  }

  return parsed.data
}

const parseConfigArgs = (args: string[], cwd: string): ConfigCommandOptions => {
  const { values } = parseArgs({
    args,
    options: {
      client: { type: 'string', multiple: true },
      'dry-run': { type: 'boolean', default: false },
      project: { type: 'string' },
    },
    strict: true,
    allowPositionals: false,
  })

  return {
    clients: (values.client ?? []).map(parseClient),
    dryRun: values['dry-run'],
    projectDir: resolve(cwd, values.project ?? '.'),
  }
}

const describePlan = (plan: ClientConfigPlan, dryRun: boolean): string => {
  const { target, path, merged } = plan

  if (target.action === CONFIG_ACTION_PRINT) {
    return [
      `${target.label}: add this to ${path} (user-level, not written by this command):`,
      mcpServerSnippet({ serversKey: target.serversKey, entryName: SUI_SERVER_ENTRY_NAME, entry: target.entry }),
    ].join('\n')
  }

  if (merged.status === CONFIG_STATUS_UNCHANGED) {
    return `${target.label}: ${path} already has the "${SUI_SERVER_ENTRY_NAME}" server; nothing to do.`
  }

  const change =
    merged.status === CONFIG_STATUS_CREATED
      ? `created with the "${SUI_SERVER_ENTRY_NAME}" server`
      : `"${SUI_SERVER_ENTRY_NAME}" server ${merged.status}`

  return dryRun
    ? [`${target.label} (dry run): ${path}: would be ${change}. New contents:`, merged.text].join('\n')
    : `${target.label}: ${path}: ${change}.`
}

const errorMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error))

/**
 * `sui-mcp config`: writes the `sui` stdio server entry into each detected (or named) client's
 * project config. Human-readable output; never starts the MCP server. Returns the exit code.
 */
export const runConfigCommand = (args: string[], io: ConfigCommandIo): number => {
  try {
    const options = parseConfigArgs(args, io.cwd)
    const detection = { projectDir: options.projectDir, homeDir: io.homeDir }
    const detected = options.clients.length ? undefined : detectMcpClients(detection)
    const clients = detected?.clients ?? options.clients

    if (detected?.isFallback) {
      io.stdout(
        `No MCP client config found in ${options.projectDir}; configuring Claude Code (.mcp.json). Use --client to choose another.\n`,
      )
    }

    const plans = planClientConfigs(clients, detection)

    if (!options.dryRun) {
      applyClientConfigPlans(plans)
    }

    io.stdout(`${plans.map((plan) => describePlan(plan, options.dryRun)).join('\n')}\n`)

    if (!options.dryRun) {
      io.stdout('Restart or reload your AI client so it starts the sui server.\n')
    }

    return EXIT_CODE_SUCCESS
  } catch (error) {
    io.stderr(`sui-mcp config: ${errorMessage(error)}\n\n${configUsage}\n`)

    return EXIT_CODE_FAILURE
  }
}
