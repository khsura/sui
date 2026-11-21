import { slotPropAccessor } from '../../src/lib'

describe('slotPropAccessor', () => {
  it.each([
    ['{ on, attrs }', 'on', 'on'],
    ['{ on, attrs }', 'attrs', 'attrs'],
    ['{ on: open, attrs: activatorAttrs }', 'on', 'open'],
    ['{ attrs = {}, on }', 'attrs', 'attrs'],
    ['{ on, ...rest }', 'attrs', 'rest.attrs'],
    ['{ items = [1, 2], on }', 'on', 'on'],
    ['props', 'on', 'props.on'],
    ['  slotProps  ', 'attrs', 'slotProps.attrs'],
  ])('%s exposes %s as %s', (pattern, key, expected) => {
    expect(slotPropAccessor(pattern, key)).toBe(expected)
  })

  it.each([
    ['{ on }', 'attrs'],
    ['[on, attrs]', 'on'],
    ['', 'on'],
  ])('%s does not expose %s', (pattern, key) => {
    expect(slotPropAccessor(pattern, key)).toBeUndefined()
  })
})
