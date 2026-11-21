import type { Recipe, RecipeName, RecipeSummary } from '../types'
import {
  BACKTICK,
  BACKTICK_RUN_PATTERN,
  CODE_FENCE,
  GET_RECIPE_TOOL_NAME,
  GUIDE_SECTION_SEPARATOR,
  LIVE_EXAMPLES_LINE,
  LIVE_EXAMPLES_URL,
  RECIPE_STORY_PATH_PREFIX,
  VUE_FENCE_LANGUAGE,
} from '../constants'
import { inlineCode, markdownTable } from '../lib'

export const recipeStoryUrl = (name: RecipeName): string => `${LIVE_EXAMPLES_URL}${RECIPE_STORY_PATH_PREFIX}${name}`

/** A fence one backtick longer than the longest backtick run in `code`, so the code can never close it early. */
const codeFenceFor = (code: string): string => {
  const longestRun = Math.max(0, ...[...code.matchAll(BACKTICK_RUN_PATTERN)].map(([run]) => run.length))

  return longestRun < CODE_FENCE.length ? CODE_FENCE : BACKTICK.repeat(longestRun + 1)
}

export const formatRecipe = ({ name, title, whenToUse, components, notes, code }: Recipe): string => {
  const fence = codeFenceFor(code)

  return [
    `# ${title}`,
    `**When to use:** ${whenToUse}`,
    `**Components:** ${components.map(inlineCode).join(', ')}`,
    notes,
    `${fence}${VUE_FENCE_LANGUAGE}\n${code.trim()}\n${fence}`,
    `Live example: ${recipeStoryUrl(name)}`,
  ]
    .filter(Boolean)
    .join(GUIDE_SECTION_SEPARATOR)
}

export const formatRecipeList = (recipes: readonly RecipeSummary[]): string =>
  [
    `${recipes.length} recipes. Read one, with its full code, using ${inlineCode(GET_RECIPE_TOOL_NAME)} and its name.`,
    markdownTable(
      ['Name', 'Recipe', 'When to use'],
      recipes.map(({ name, title, whenToUse }) => [inlineCode(name), title, whenToUse]),
    ),
    LIVE_EXAMPLES_LINE,
  ].join(GUIDE_SECTION_SEPARATOR)

export const formatUnknownRecipe = (query: string, names: readonly RecipeName[]): string =>
  `Unknown recipe ${inlineCode(query)}. Available recipes: ${names.map(inlineCode).join(', ')}.`
