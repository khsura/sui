import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { SuiApi } from '@khsura/shared/types'
import { suiApiSchema } from '@khsura/shared/schemas'
import { latestFixturePath } from './testProject'

export const fixtureApi: SuiApi = suiApiSchema.parse(JSON.parse(readFileSync(latestFixturePath, 'utf8')))

export const readTemplateFixture = (fileName: string): string =>
  readFileSync(fileURLToPath(new URL(`./fixtures/templates/${fileName}`, import.meta.url)), 'utf8')

/** `api` plus an empty stub for each name it lacks, for tests that need a component the fixture does not have. */
export const withComponents = (api: SuiApi, names: string[]): SuiApi => ({
  ...api,
  components: [
    ...api.components,
    ...names
      .filter((name) => !api.components.some((component) => component.name === name))
      .map((name) => ({ name, family: 'core', file: `components/${name}.vue`, props: [], slots: [], events: [] })),
  ],
})
