import { z } from 'zod'
import { MIN_FRONT_MATTER_VALUE_LENGTH, MIN_RECIPE_NAME_LENGTH, RECIPE_COMPONENT_SEPARATOR } from '../constants'

// A plain string (not an enum) so an unknown name reaches the tool and gets the name list back.
export const getRecipeInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(MIN_RECIPE_NAME_LENGTH)
    .describe('Recipe name, e.g. `app-shell`, `validated-form`, `data-table`. Call list_recipes for all names.'),
})

/** The front matter of a recipe's `.md` notes file; `components` is a comma-separated list. */
export const recipeFrontMatterSchema = z.object({
  title: z.string().min(MIN_FRONT_MATTER_VALUE_LENGTH),
  whenToUse: z.string().min(MIN_FRONT_MATTER_VALUE_LENGTH),
  components: z
    .string()
    .min(MIN_FRONT_MATTER_VALUE_LENGTH)
    .transform((list) =>
      list
        .split(RECIPE_COMPONENT_SEPARATOR)
        .map((component) => component.trim())
        .filter(Boolean),
    ),
})
