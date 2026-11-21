import type { SuiApiComponent } from '@khsura/shared/types'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { LoadSuiApi, ResolvedSuiApi } from '../types'
import { API_SOURCE_PROJECT, GET_COMPONENT_API_TOOL_NAME } from '../constants'
import { getComponentApiInputSchema } from '../schemas'
import { useComponentCatalogService } from '../services'
import { formatComponentApi, formatComponentNeedsUpgrade, formatUnknownComponent } from '../utils'
import { textResult, withSuiApi } from './toolResult'

/** The bundled (latest) copy of a component the project install lacks, or undefined when it is unknown there too. */
const findInBundled = (
  resolved: ResolvedSuiApi,
  name: string,
  loadBundledSuiApi: LoadSuiApi,
): { bundled: ResolvedSuiApi; component: SuiApiComponent } | undefined => {
  if (resolved.source !== API_SOURCE_PROJECT) {
    return undefined
  }

  let bundled: ResolvedSuiApi

  try {
    bundled = loadBundledSuiApi()
  } catch {
    // No usable bundled copy: fall back to the plain "unknown component" answer.
    return undefined
  }

  const lookup = useComponentCatalogService(bundled.api).findComponent(name)

  return lookup.found ? { bundled, component: lookup.component } : undefined
}

export const registerGetComponentApiTool = (
  server: McpServer,
  loadSuiApi: LoadSuiApi,
  loadBundledSuiApi: LoadSuiApi,
): void => {
  server.registerTool(
    GET_COMPONENT_API_TOOL_NAME,
    {
      description:
        'Returns the props, slots and events of one @khsura/sui component as markdown, with usage notes for activator and layout-child components. Unknown names return the closest matches; a component that only a newer @khsura/sui has says so.',
      inputSchema: getComponentApiInputSchema,
    },
    ({ name }) =>
      withSuiApi(loadSuiApi, (resolved) => {
        const lookup = useComponentCatalogService(resolved.api).findComponent(name)

        if (lookup.found) {
          return textResult(formatComponentApi(resolved, lookup.component))
        }

        const newer = findInBundled(resolved, name, loadBundledSuiApi)

        return newer
          ? textResult(formatComponentNeedsUpgrade(resolved, newer.bundled, newer.component.name), true)
          : textResult(formatUnknownComponent(resolved, name, lookup.suggestions), true)
      }),
  )
}
