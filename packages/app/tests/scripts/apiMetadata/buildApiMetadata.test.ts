import fs from 'node:fs'
import path from 'node:path'
import type { SuiApi } from '@khsura/shared/types'
import packageJson from '../../../package.json'
import { buildApiMetadata } from '../../../scripts/apiMetadata/buildApiMetadata'
import { findPublicComponents } from '../../../scripts/apiMetadata/componentExports'

const appRoot = path.resolve(import.meta.dirname, '../../..')
const BUILD_TIMEOUT_MS = 300_000
const SLOT_OUTLET_PATTERN = /<slot\b/

describe('buildApiMetadata', () => {
  let api: SuiApi
  const byName = (name: string) => api.components.find((component) => component.name === name)

  beforeAll(() => {
    api = buildApiMetadata(appRoot)
  }, BUILD_TIMEOUT_MS)

  it('stamps the package name and version', () => {
    expect(api.package).toBe('@khsura/sui')
    expect(api.version).toBe(packageJson.version)
  })

  it('covers every public component', () => {
    expect(api.components.map((component) => component.name)).toEqual(
      findPublicComponents(appRoot).map((component) => component.name),
    )
  })

  it('resolves alias and intersection props on SButton', () => {
    const props = byName('SButton')?.props ?? []

    expect(props.map((prop) => prop.name)).toEqual(expect.arrayContaining(['color', 'disabled', 'loading', 'size']))
    expect(props.find((prop) => prop.name === 'size')?.enumValues).toEqual([
      'default',
      'extra',
      'large',
      'mini',
      'small',
    ])
    expect(props.find((prop) => prop.name === 'loading')?.enumValues).toBeUndefined()
  })

  it('drops Vue global props', () => {
    expect(byName('SButton')?.props.map((prop) => prop.name)).not.toEqual(
      expect.arrayContaining(['key', 'ref', 'class']),
    )
  })

  it('exposes the activator slot on SDialog', () => {
    expect(byName('SDialog')?.slots.map((slot) => slot.name)).toContain('activator')
  })

  it('lists slots for every component that renders a <slot>', () => {
    const missingSlots = api.components.filter(
      (component) =>
        component.slots.length === 0 &&
        SLOT_OUTLET_PATTERN.test(fs.readFileSync(path.join(appRoot, component.file), 'utf8')),
    )

    expect(missingSlots.map((component) => component.name)).toEqual([])
  })

  it('emits dynamic STable slots as pattern entries', () => {
    const slots = byName('STable')?.slots ?? []

    expect(slots.find((slot) => slot.name === 'item.<column>')?.pattern).toBe('^item\\..+$')
    expect(slots.find((slot) => slot.name === 'header.<column>')?.pattern).toBe('^header\\..+$')
    expect(slots.map((slot) => slot.name)).toEqual(expect.arrayContaining(['group', 'expanded', 'noData']))
  })

  it('matches the snapshot for SButton, SInput, SDialog, STable', () => {
    expect(['SButton', 'SInput', 'SDialog', 'STable'].map(byName)).toMatchSnapshot()
  })
})
