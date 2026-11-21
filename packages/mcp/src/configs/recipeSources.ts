import { fileURLToPath } from 'node:url'
import {
  RECIPE_CODE_EXTENSION,
  RECIPE_NAMES,
  RECIPE_NOTES_EXTENSION,
  RECIPE_SOURCE_DIR,
  RECIPES_DIRNAME,
  REPO_ROOT_FROM_CONFIGS,
} from '../constants'

// The build copies every recipe file into dist/recipes beside dist/index.js.
export const bundledRecipesRoot = fileURLToPath(new URL(`./${RECIPES_DIRNAME}`, import.meta.url))
// Unbundled (dev, tests) the recipes are read straight from the monorepo.
export const repoRecipesRoot = fileURLToPath(new URL(`${REPO_ROOT_FROM_CONFIGS}${RECIPE_SOURCE_DIR}`, import.meta.url))

/** Every file name the recipe tools read: `<name>.vue` and `<name>.md` per recipe. */
export const recipeSourceFiles: readonly string[] = RECIPE_NAMES.flatMap((name) => [
  `${name}${RECIPE_CODE_EXTENSION}`,
  `${name}${RECIPE_NOTES_EXTENSION}`,
])
