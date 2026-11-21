import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { LoadSuiApi } from '../types'
import { VALIDATE_SUI_TEMPLATE_TOOL_NAME } from '../constants'
import { validateSuiTemplateInputSchema } from '../schemas'
import { useTemplateValidatorService } from '../services'
import { formatTemplateValidation } from '../utils'
import { textResult, withSuiApi } from './toolResult'

export const registerValidateSuiTemplateTool = (server: McpServer, loadSuiApi: LoadSuiApi): void => {
  server.registerTool(
    VALIDATE_SUI_TEMPLATE_TOOL_NAME,
    {
      description:
        'Checks a .vue SFC or template fragment against the @khsura/sui API: unknown S* components (with suggestions), unknown props, static values outside an enum prop, unknown slot names, and template syntax errors. Returns "line:col [rule] message — fix: hint" per issue. Run it on every template you generate before showing it.',
      inputSchema: validateSuiTemplateInputSchema,
    },
    ({ code }) =>
      withSuiApi(loadSuiApi, (resolved) =>
        textResult(formatTemplateValidation(resolved, useTemplateValidatorService(resolved.api).validate(code))),
      ),
  )
}
