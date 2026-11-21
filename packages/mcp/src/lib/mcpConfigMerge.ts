import type { JsonObject, JsonValue, MergedMcpConfig, MergeMcpServerEntryInput } from '../types'
import {
  CONFIG_STATUS_ADDED,
  CONFIG_STATUS_CREATED,
  CONFIG_STATUS_UNCHANGED,
  CONFIG_STATUS_UPDATED,
  JSON_INDENT,
} from '../constants'

export class McpConfigParseError extends Error {
  override name = 'McpConfigParseError'
}

const isJsonObject = (value: JsonValue | undefined): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseJsonObject = (text: string): JsonObject => {
  let parsed: JsonValue

  try {
    // JSON.parse returns `any`; the guard below narrows it to an object.
    parsed = JSON.parse(text)
  } catch (error) {
    throw new McpConfigParseError(`is not valid JSON (${error instanceof Error ? error.message : String(error)})`)
  }

  if (!isJsonObject(parsed)) {
    throw new McpConfigParseError('must contain a JSON object at the top level')
  }

  return parsed
}

const serializeJson = (value: JsonObject): string => `${JSON.stringify(value, null, JSON_INDENT)}\n`

/**
 * Adds (or refreshes) `entryName` under `serversKey`, keeping every other server and top-level key.
 * Fields of an existing entry that `entry` does not set (such as `env`) are kept.
 * Throws McpConfigParseError for text that is not a JSON object or whose servers key is not an object.
 */
export const mergeMcpServerEntry = ({
  existingText,
  serversKey,
  entryName,
  entry,
}: MergeMcpServerEntryInput): MergedMcpConfig => {
  if (existingText === undefined || existingText.trim() === '') {
    return {
      text: serializeJson({ [serversKey]: { [entryName]: entry } }),
      status: CONFIG_STATUS_CREATED,
    }
  }

  const config = parseJsonObject(existingText)
  const servers = config[serversKey] ?? {}

  if (!isJsonObject(servers)) {
    throw new McpConfigParseError(`has a "${serversKey}" value that is not an object`)
  }

  const existingEntry = servers[entryName]
  const mergedEntry: JsonObject = isJsonObject(existingEntry) ? { ...existingEntry, ...entry } : entry
  const isUnchanged = isJsonObject(existingEntry) && JSON.stringify(existingEntry) === JSON.stringify(mergedEntry)

  if (isUnchanged) {
    return { text: existingText, status: CONFIG_STATUS_UNCHANGED }
  }

  return {
    text: serializeJson({ ...config, [serversKey]: { ...servers, [entryName]: mergedEntry } }),
    status: existingEntry === undefined ? CONFIG_STATUS_ADDED : CONFIG_STATUS_UPDATED,
  }
}

/** The snippet a user pastes into a config file they edit by hand. */
export const mcpServerSnippet = ({
  serversKey,
  entryName,
  entry,
}: Omit<MergeMcpServerEntryInput, 'existingText'>): string => serializeJson({ [serversKey]: { [entryName]: entry } })
