import {
  GET_COMPONENT_API_TOOL_NAME,
  GET_GUIDE_TOOL_NAME,
  GET_RECIPE_TOOL_NAME,
  INSTALLATION_GUIDE_TOPIC,
  LIST_COMPONENTS_TOOL_NAME,
  LIST_RECIPES_TOOL_NAME,
  VALIDATE_SUI_TEMPLATE_TOOL_NAME,
} from '../constants'

/** Sent in the initialize result: how an AI client should use these tools when it writes @khsura/sui code. */
export const serverInstructions = [
  'sui-mcp answers questions about the @khsura/sui Vue 3 component framework (components prefixed `S`, such as SButton) from the version the project installs.',
  `- Setting up SUI in a project: call \`${GET_GUIDE_TOOL_NAME}\` with topic \`${INSTALLATION_GUIDE_TOPIC}\` first.`,
  `- Before using an SUI component you have not checked in this session, call \`${GET_COMPONENT_API_TOOL_NAME}\` for its real props, slots and events. Do not guess prop names from other UI libraries. \`${LIST_COMPONENTS_TOOL_NAME}\` lists every component.`,
  `- For common patterns (forms, dialogs, tables, app layouts and so on), start from a tested recipe: \`${LIST_RECIPES_TOOL_NAME}\`, then \`${GET_RECIPE_TOOL_NAME}\`.`,
  `- ALWAYS run \`${VALIDATE_SUI_TEMPLATE_TOOL_NAME}\` on every template you generate or change, fix every error it reports, and run it again until it reports none before you finish.`,
].join('\n')
