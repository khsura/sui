import { describe, expect, test } from 'vitest'
import { hasRawProp, resolveComponentDefault } from '@/app/lib'
import { globalComponentDefaultTargets } from '@/app/configs'

describe('resolveComponentDefault', () => {
  const base = { legacyComponents: undefined, componentName: 'SButton', propName: 'size', hasProp: true }

  test('component default wins over global', () => {
    expect(
      resolveComponentDefault({ ...base, defaults: { SButton: { size: 'large' }, global: { size: 'small' } } }),
    ).toEqual({ found: true, value: 'large' })
  })

  test('global applies when no component default is set', () => {
    expect(resolveComponentDefault({ ...base, defaults: { global: { size: 'small' } } })).toEqual({
      found: true,
      value: 'small',
    })
  })

  test('an undefined component value does not hide the global one', () => {
    expect(
      resolveComponentDefault({ ...base, defaults: { SButton: { size: undefined }, global: { size: 'small' } } }),
    ).toEqual({ found: true, value: 'small' })
  })

  test('nothing configured falls through to the built-in default', () => {
    expect(resolveComponentDefault({ ...base, defaults: {} })).toEqual({ found: false })
    expect(resolveComponentDefault({ ...base, defaults: undefined })).toEqual({ found: false })
  })

  test('global is skipped when the component lacks the prop or is not a target', () => {
    const defaults = { global: { size: 'small' as const } }

    expect(resolveComponentDefault({ ...base, defaults, hasProp: false })).toEqual({ found: false })
    expect(resolveComponentDefault({ ...base, defaults, componentName: 'SCheckbox' })).toEqual({ found: false })
    expect(resolveComponentDefault({ ...base, defaults, componentName: 'SProgressCircular' })).toEqual({
      found: false,
    })
  })

  test('non-global props never read the global layer', () => {
    expect(resolveComponentDefault({ ...base, propName: 'label', defaults: { global: { size: 'small' } } })).toEqual({
      found: false,
    })
  })

  test('the onetab case: global size reaches buttons, chips and icons', () => {
    expect(globalComponentDefaultTargets.size).toEqual(expect.arrayContaining(['SButton', 'SChip', 'SIcon']))
  })
})

describe('hasRawProp', () => {
  test('matches camelCase and kebab-case keys', () => {
    expect(hasRawProp({ ariaLabel: 'x' }, 'ariaLabel')).toBe(true)
    expect(hasRawProp({ 'aria-label': 'x' }, 'ariaLabel')).toBe(true)
    expect(hasRawProp({ size: undefined }, 'size')).toBe(true)
    expect(hasRawProp({}, 'size')).toBe(false)
  })
})
