import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Recipe, RecipeLookup, RecipeName, RecipeSourceOptions, RecipeSummary } from '../types'
import { bundledRecipesRoot, repoRecipesRoot } from '../configs'
import {
  RECIPE_CODE_EXTENSION,
  RECIPE_NAME_SEPARATOR,
  RECIPE_NAME_SEPARATOR_PATTERN,
  RECIPE_NAMES,
  RECIPE_NOTES_EXTENSION,
  RECIPE_TEXT_ENCODING,
} from '../constants'
import { parseFrontMatter } from '../lib'
import { recipeFrontMatterSchema } from '../schemas'

/** `dist/recipes` when the build shipped it beside the bundle, otherwise the monorepo recipe folder. */
export const resolveRecipeSourceRoot = ({
  bundledRoot = bundledRecipesRoot,
  repoRoot = repoRecipesRoot,
}: { bundledRoot?: string; repoRoot?: string } = {}): string => (existsSync(bundledRoot) ? bundledRoot : repoRoot)

const readRecipeFile = (sourceRoot: string, fileName: string): string => {
  const sourcePath = join(sourceRoot, fileName)

  if (!existsSync(sourcePath)) {
    throw new Error(`Recipe source file is missing: ${sourcePath}`)
  }

  return readFileSync(sourcePath, RECIPE_TEXT_ENCODING)
}

/** Reads `<name>.md` (front matter + notes) and `<name>.vue`; a missing file or bad front matter throws. */
export const readRecipe = (sourceRoot: string, name: RecipeName): Recipe => {
  const notesFile = `${name}${RECIPE_NOTES_EXTENSION}`
  const document = parseFrontMatter(readRecipeFile(sourceRoot, notesFile))

  if (!document) {
    throw new Error(`Recipe notes ${notesFile} have no front matter`)
  }

  const frontMatter = recipeFrontMatterSchema.safeParse(document.attributes)

  if (!frontMatter.success) {
    throw new Error(`Recipe notes ${notesFile} have invalid front matter: ${frontMatter.error.message}`)
  }

  return {
    name,
    ...frontMatter.data,
    notes: document.body,
    code: readRecipeFile(sourceRoot, `${name}${RECIPE_CODE_EXTENSION}`),
  }
}

const normalizeRecipeName = (name: string): string =>
  name.trim().toLowerCase().replaceAll(RECIPE_NAME_SEPARATOR_PATTERN, RECIPE_NAME_SEPARATOR)

const isRecipeName = (name: string): name is RecipeName => RECIPE_NAMES.some((recipeName) => recipeName === name)

export const useRecipeCatalogService = ({ sourceRoot = resolveRecipeSourceRoot() }: RecipeSourceOptions = {}) => ({
  listRecipes: (): RecipeSummary[] =>
    RECIPE_NAMES.map((name) => {
      const { title, whenToUse, components } = readRecipe(sourceRoot, name)

      return { name, title, whenToUse, components }
    }),

  getRecipe: (name: string): RecipeLookup => {
    const requestedName = normalizeRecipeName(name)

    return isRecipeName(requestedName)
      ? { found: true, recipe: readRecipe(sourceRoot, requestedName) }
      : { found: false, names: RECIPE_NAMES }
  },
})
