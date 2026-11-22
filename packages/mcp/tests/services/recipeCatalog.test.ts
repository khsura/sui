import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { SuiApi } from '@khsura/shared/types'
import { suiApiSchema } from '@khsura/shared/schemas'
import { recipeSourceFiles, repoRecipesRoot } from '../../src/configs'
import {
  RECIPE_ACTIVATOR_OVERLAYS,
  RECIPE_APP_SHELL,
  RECIPE_CENTERED_PAGE,
  RECIPE_DATA_TABLE,
  RECIPE_DENSE_TOOLBAR,
  RECIPE_FILTER_BAR,
  RECIPE_NAMES,
  RECIPE_RESPONSIVE_GRID,
  RECIPE_TABBED_SECTIONS,
  RECIPE_THEME_SETUP,
  RECIPE_VALIDATED_FORM,
  SUI_M2_FIXES_VERSION,
} from '../../src/constants'
import { isVersionAtLeast } from '../../src/lib'
import {
  readRecipe,
  resolveRecipeSourceRoot,
  useRecipeCatalogService,
  useTemplateValidatorService,
} from '../../src/services'
import { makeTempDir } from '../testProject'

// The recipes ship with the release that carries the M2 fixes (an uncoloured snackbar action reads on the snackbar),
// so they are validated as that version at least; the unreleased package still says the previous one.
const atLeastRecipeVersion = (api: SuiApi): SuiApi =>
  isVersionAtLeast(api.version, SUI_M2_FIXES_VERSION) ? api : { ...api, version: SUI_M2_FIXES_VERSION }

const readApi = (path: string): SuiApi =>
  atLeastRecipeVersion(suiApiSchema.parse(JSON.parse(readFileSync(path, 'utf8'))))

// sui-api.json of every component the recipes use, taken from `yarn build:api` in packages/app.
const recipeFixtureApi = readApi(fileURLToPath(new URL('../fixtures/suiApiRecipes.json', import.meta.url)))
// The full API built from the current component code; present after packages/app is built.
const builtAppApiPath = fileURLToPath(new URL('../../../app/dist/sui-api.json', import.meta.url))
const catalog = useRecipeCatalogService({ sourceRoot: repoRecipesRoot })

const copyRecipes = (): string => {
  const root = makeTempDir()

  recipeSourceFiles.forEach((fileName) => copyFileSync(join(repoRecipesRoot, fileName), join(root, fileName)))

  return root
}

describe('useRecipeCatalogService', () => {
  it('lists every recipe in order with its front matter', () => {
    const recipes = catalog.listRecipes()

    expect(recipes.map(({ name }) => name)).toEqual([...RECIPE_NAMES])
    recipes.forEach(({ title, whenToUse, components }) => {
      expect(title).not.toBe('')
      expect(whenToUse).not.toBe('')
      expect(components.length).toBeGreaterThan(0)
    })
  })

  it('publishes every recipe name the validator points to', () => {
    expect([...RECIPE_NAMES].sort()).toEqual(
      [
        RECIPE_APP_SHELL,
        RECIPE_VALIDATED_FORM,
        RECIPE_ACTIVATOR_OVERLAYS,
        RECIPE_DATA_TABLE,
        RECIPE_RESPONSIVE_GRID,
        RECIPE_THEME_SETUP,
        RECIPE_FILTER_BAR,
        RECIPE_CENTERED_PAGE,
        RECIPE_TABBED_SECTIONS,
        RECIPE_DENSE_TOOLBAR,
      ].sort(),
    )
  })

  it('gets a recipe with its notes and full SFC', () => {
    const lookup = catalog.getRecipe('app-shell')

    expect(lookup.found).toBe(true)
    if (lookup.found) {
      expect(lookup.recipe.title).toBe('App shell')
      expect(lookup.recipe.components).toContain('SNavigationDrawer')
      expect(lookup.recipe.notes).toContain('for="shell"')
      expect(lookup.recipe.code).toBe(readFileSync(join(repoRecipesRoot, 'app-shell.vue'), 'utf8'))
    }
  })

  it('normalizes case, spaces and underscores in the name', () => {
    expect(catalog.getRecipe(' Data Table ').found).toBe(true)
    expect(catalog.getRecipe('theme_setup').found).toBe(true)
  })

  it('returns the name list for an unknown recipe', () => {
    expect(catalog.getRecipe('login-page')).toEqual({ found: false, names: RECIPE_NAMES })
  })

  it('throws on a missing source file', () => {
    expect(() => readRecipe(makeTempDir(), 'app-shell')).toThrow('Recipe source file is missing')
  })

  it('throws on notes without front matter or with an incomplete one', () => {
    const root = copyRecipes()

    writeFileSync(join(root, 'data-table.md'), '# Data table\n')
    expect(() => readRecipe(root, 'data-table')).toThrow('have no front matter')

    writeFileSync(join(root, 'data-table.md'), '---\ntitle: Data table\n---\n')
    expect(() => readRecipe(root, 'data-table')).toThrow('have invalid front matter')
  })

  it('prefers the bundled folder when it exists', () => {
    const bundledRoot = copyRecipes()

    expect(resolveRecipeSourceRoot({ bundledRoot, repoRoot: 'repo' })).toBe(bundledRoot)
    expect(resolveRecipeSourceRoot({ bundledRoot: join(bundledRoot, 'missing'), repoRoot: 'repo' })).toBe('repo')
  })
})

describe('recipes pass validate_sui_template', () => {
  it.each(RECIPE_NAMES)('%s has no errors or warnings', (name) => {
    expect(useTemplateValidatorService(recipeFixtureApi).validate(readRecipe(repoRecipesRoot, name).code)).toEqual([])
  })

  it('still catches a broken copy of a recipe', () => {
    const brokenShell = readRecipe(repoRecipesRoot, 'app-shell').code.replace('<SMain for="shell">', '<SMain>')

    const rules = useTemplateValidatorService(recipeFixtureApi)
      .validate(brokenShell)
      .map(({ rule }) => rule)

    expect(rules).toEqual(['layout-for'])
  })

  it.skipIf(!existsSync(builtAppApiPath)).each(RECIPE_NAMES)(
    '%s has no errors or warnings against the built packages/app API',
    (name) => {
      expect(
        useTemplateValidatorService(readApi(builtAppApiPath)).validate(readRecipe(repoRecipesRoot, name).code),
      ).toEqual([])
    },
  )
})
