import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { SuiApi } from '@khsura/shared/types'
import { suiApiSchema } from '@khsura/shared/schemas'
import { latestFixturePath } from './testProject'

export const fixtureApi: SuiApi = suiApiSchema.parse(JSON.parse(readFileSync(latestFixturePath, 'utf8')))

export const readTemplateFixture = (fileName: string): string =>
  readFileSync(fileURLToPath(new URL(`./fixtures/templates/${fileName}`, import.meta.url)), 'utf8')
