import type { z } from 'zod'
import type { RECIPE_NAMES } from '../constants'
import type { recipeFrontMatterSchema } from '../schemas'

export type RecipeName = (typeof RECIPE_NAMES)[number]

export type RecipeFrontMatter = z.infer<typeof recipeFrontMatterSchema>

export interface RecipeSummary extends RecipeFrontMatter {
  name: RecipeName
}

export interface Recipe extends RecipeSummary {
  /** Markdown body of the `.md` notes file, below its front matter. */
  notes: string
  /** The full `.vue` SFC. */
  code: string
}

export interface RecipeSourceOptions {
  /** Folder holding `<name>.vue` and `<name>.md`: `dist/recipes` when bundled, else the repo recipe folder. */
  sourceRoot?: string
}

export type RecipeLookup = { found: true; recipe: Recipe } | { found: false; names: readonly RecipeName[] }
