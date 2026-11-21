import path from 'node:path'
import { findPublicComponents } from '../../../scripts/apiMetadata/componentExports'

const appRoot = path.resolve(import.meta.dirname, '../../..')

describe('findPublicComponents', () => {
  const components = findPublicComponents(appRoot)
  const names = components.map((component) => component.name)

  it('finds flat and nested exports', () => {
    expect(names).toEqual(expect.arrayContaining(['SAlert', 'SButton', 'SDialog', 'SInput', 'SFormInputError']))
  })

  it('assigns the family from the folder', () => {
    expect(components.find((component) => component.name === 'SButton')?.family).toBe('core')
    expect(components.find((component) => component.name === 'SInput')?.family).toBe('form')
    expect(components.find((component) => component.name === 'SFormInputError')?.family).toBe('form')
  })

  it('has unique names in sorted order', () => {
    expect(new Set(names).size).toBe(names.length)
    expect([...names].sort()).toEqual(names)
  })

  it('points at .vue files relative to the app root', () => {
    components.forEach((component) => expect(component.file).toMatch(/^components\/.+\.vue$/))
  })
})
