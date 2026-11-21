import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import type { LoadSuiApi, ResolvedSuiApi } from '../types'

export const textResult = (text: string, isError = false): CallToolResult => ({
  content: [{ type: 'text', text }],
  ...(isError ? { isError } : {}),
})

/** Runs a tool body against the resolved API, turning a resolution failure into an MCP error result. */
export const withSuiApi = (
  loadSuiApi: LoadSuiApi,
  toolBody: (resolved: ResolvedSuiApi) => CallToolResult,
): CallToolResult => {
  let resolved: ResolvedSuiApi

  try {
    resolved = loadSuiApi()
  } catch (error) {
    return textResult(error instanceof Error ? error.message : String(error), true)
  }

  return toolBody(resolved)
}
