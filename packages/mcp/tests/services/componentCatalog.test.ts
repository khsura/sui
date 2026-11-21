import { readFileSync } from 'node:fs'
import { suiApiSchema } from '@khsura/shared/schemas'
import { useComponentCatalogService } from '../../src/services'
import { latestFixturePath } from '../testProject'

const api = suiApiSchema.parse(JSON.parse(readFileSync(latestFixturePath, 'utf8')))
const catalog = useComponentCatalogService(api)

describe('useComponentCatalogService', () => {
  it.each(['SButton', 'sbutton', 's-button', 'S-Button', 'button', 'BUTTON', ' button '])(
    'finds SButton from %j',
    (query) => {
      const lookup = catalog.findComponent(query)

      expect(lookup.found && lookup.component.name).toBe('SButton')
    },
  )

  it('normalises multi-word names', () => {
    const lookup = catalog.findComponent('app-bar')

    expect(lookup.found && lookup.component.name).toBe('SAppBar')
  })

  it('suggests up to three closest names for an unknown component', () => {
    const lookup = catalog.findComponent('SDialg')

    expect(lookup.found).toBe(false)
    expect(!lookup.found && lookup.suggestions).toHaveLength(3)
    expect(!lookup.found && lookup.suggestions[0]).toBe('SDialog')
  })

  it('lists name, family and a family-derived purpose', () => {
    expect(catalog.listComponents()).toContainEqual({
      name: 'SAppBar',
      family: 'layout',
      purpose: 'App bar — app shell layout (SLayout and its named regions)',
    })
  })
})
