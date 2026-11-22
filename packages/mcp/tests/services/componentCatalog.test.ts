import { readFileSync } from 'node:fs'
import { suiApiSchema } from '@khsura/shared/schemas'
import { COMPONENT_ALIASES } from '../../src/constants'
import type * as ConstantsModule from '../../src/constants'
import { useComponentCatalogService } from '../../src/services'
import { latestFixturePath } from '../testProject'
import { withComponents } from '../testTemplates'

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

describe('other-library component aliases', () => {
  /** Every alias and the SUI components it must map to. */
  const expectedAliases: [string, string[]][] = [
    ['SCol', ['SColumn']],
    ['SCols', ['SColumn']],
    ['SColumns', ['SColumn']],
    ['STextField', ['SInput']],
    ['STextInput', ['SInput']],
    ['SInputText', ['SInput']],
    ['SBtn', ['SButton']],
    ['SIconButton', ['SButton']],
    ['SBtnToggle', ['SToggleButtonGroup', 'SToggleButton']],
    ['SDataTable', ['STable']],
    ['SSimpleTable', ['STable']],
    ['STabsWindow', ['SWindow']],
    ['STabsWindowItem', ['SWindowItem']],
    ['STabsItems', ['SWindow']],
    ['STabItem', ['SWindowItem']],
    ['STabPanels', ['SWindow']],
    ['STabPanel', ['SWindowItem']],
    ['STabPane', ['STab', 'SWindowItem']],
    ['SModal', ['SDialog']],
    ['SDrawer', ['SNavigationDrawer']],
    ['SHeader', ['SAppBar']],
    ['SPage', ['SMain']],
    ['SContent', ['SMain']],
    ['SToast', ['SSnackbar']],
    ['SNotification', ['SSnackbar']],
    ['SDropdown', ['SMenu']],
    ['SSpinner', ['SProgressCircular']],
    ['SProgressBar', ['SProgressLinear']],
    ['SToggle', ['SSwitch']],
    ['SCombobox', ['SAutocomplete']],
    ['SImg', ['SImage']],
    ['SCardHeader', ['SCardTitle']],
    ['SCardBody', ['SCardText']],
    ['SCardContent', ['SCardText']],
    ['SCardSection', ['SCardText']],
    ['SCardFooter', ['SCardActions']],
    ['SExpansionPanelTitle', ['SExpansionPanelHeader']],
    ['SExpansionPanelText', ['SExpansionPanelContent']],
    ['SAccordion', ['SExpansionPanels']],
    ['SStepperItem', ['SStepperStep']],
  ]

  const targetNames = [...new Set(expectedAliases.flatMap(([, suiNames]) => suiNames))]
  /** The fixture plus every alias target, so each alias resolves. */
  const fullApi = withComponents(api, targetNames)
  const fullCatalog = useComponentCatalogService(fullApi)

  it('covers every alias in the map', () => {
    expect(expectedAliases.map(([alias]) => alias).sort()).toEqual(Object.keys(COMPONENT_ALIASES).sort())
  })

  it.each(expectedAliases)('maps %s to %j', (alias, suiNames) => {
    const lookup = fullCatalog.findComponent(alias)

    expect(lookup.found).toBe(false)
    expect(!lookup.found && lookup.alias).toMatchObject({ alias, suiNames })
    expect(!lookup.found && lookup.alias?.hint).toBeTruthy()
  })

  it.each(['s-text-field', 'text-field', 'STEXTFIELD', ' col '])('matches %j like a component name', (query) => {
    const lookup = fullCatalog.findComponent(query)

    expect(!lookup.found && lookup.alias?.suiNames.length).toBe(1)
  })

  it('keeps the alias targets out of the Levenshtein suggestions', () => {
    const lookup = fullCatalog.findComponent('SCol')

    expect(!lookup.found && lookup.suggestions).not.toContain('SColumn')
  })

  it.each(['SModal', 'SCol'])('stops applying %s once the real component exists', (name) => {
    const lookup = useComponentCatalogService(withComponents(fullApi, [name])).findComponent(name)

    expect(lookup.found && lookup.component.name).toBe(name)
  })

  it('skips an alias whose SUI targets this version does not have', () => {
    const lookup = catalog.findComponent('STabsWindow')

    expect(!lookup.found && lookup.alias).toBeUndefined()
    expect(!lookup.found && lookup.suggestions.length).toBeGreaterThan(0)
  })

  it('keeps only the targets this version has', () => {
    const lookup = useComponentCatalogService(withComponents(api, ['SWindowItem'])).findComponent('STabPane')

    expect(!lookup.found && lookup.alias?.suiNames).toEqual(['SWindowItem'])
  })

  it('has no alias for an ordinary typo', () => {
    const lookup = fullCatalog.findComponent('SDialg')

    expect(!lookup.found && lookup.alias).toBeUndefined()
  })
})

describe('an alias with no SUI equivalent', () => {
  // Synthetic: the real map has no such alias right now, but the code path must keep working for the next one.
  const syntheticAlias = 'SSyntheticWidget'
  const syntheticHint = 'There is no widget component; compose it from SCard and SList.'

  afterEach(() => {
    vi.doUnmock('../../src/constants')
    vi.resetModules()
  })

  it('returns the hint with no SUI targets and still suggests names', async () => {
    vi.resetModules()
    vi.doMock('../../src/constants', async (importOriginal) => {
      const original = await importOriginal<typeof ConstantsModule>()

      return {
        ...original,
        COMPONENT_ALIASES: { ...original.COMPONENT_ALIASES, [syntheticAlias]: { suiNames: [], hint: syntheticHint } },
      }
    })
    const { useComponentCatalogService: useMockedCatalogService } = await import('../../src/services')
    const lookup = useMockedCatalogService(api).findComponent(syntheticAlias)

    expect(lookup.found).toBe(false)
    expect(!lookup.found && lookup.alias).toEqual({ alias: syntheticAlias, suiNames: [], hint: syntheticHint })
    expect(!lookup.found && lookup.suggestions.length).toBeGreaterThan(0)
  })
})
