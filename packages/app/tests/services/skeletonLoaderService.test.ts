import { skeletonLoaderPresets } from '@/app/configs'
import { skeletonLoaderMaxDepth, skeletonLoaderMaxRepeat } from '@/app/constants'
import {
  getSkeletonLoaderDepth,
  getSkeletonLoaderNodeClass,
  getSkeletonLoaderNodes,
  isSkeletonLoaderPreset,
  parseSkeletonLoaderType,
} from '@/app/services'

describe('parseSkeletonLoaderType', () => {
  test('reads a single preset with a count of 1', () => {
    expect(parseSkeletonLoaderType('text')).toEqual([{ preset: 'text', count: 1 }])
  })

  test('reads comma-separated presets and @N repeats, ignoring spaces', () => {
    expect(parseSkeletonLoaderType(' avatar ,text@3, list-item-avatar @ 2 ')).toEqual([
      { preset: 'avatar', count: 1 },
      { preset: 'text', count: 3 },
      { preset: 'list-item-avatar', count: 2 },
    ])
  })

  test('drops empty parts and unknown presets', () => {
    expect(parseSkeletonLoaderType('text,, paragraph, sentences@2,')).toEqual([{ preset: 'text', count: 1 }])
    expect(parseSkeletonLoaderType('')).toEqual([])
  })

  test.each(['text@0', 'text@-2', 'text@1.5', 'text@abc', 'text@'])('counts %j as 1', (type) => {
    expect(parseSkeletonLoaderType(type)).toEqual([{ preset: 'text', count: 1 }])
  })

  test('caps the repeat count', () => {
    expect(parseSkeletonLoaderType('text@100000')).toEqual([{ preset: 'text', count: skeletonLoaderMaxRepeat }])
  })

  test('is case-sensitive, like the rest of the presets', () => {
    expect(parseSkeletonLoaderType('Text')).toEqual([])
  })
})

describe('isSkeletonLoaderPreset', () => {
  test.each(skeletonLoaderPresets)('knows %s', (preset) => {
    expect(isSkeletonLoaderPreset(preset)).toBe(true)
  })

  test('rejects Vuetify-only presets', () => {
    expect(isSkeletonLoaderPreset('paragraph')).toBe(false)
  })
})

describe('getSkeletonLoaderNodes', () => {
  test('repeats a preset with stable keys', () => {
    const nodes = getSkeletonLoaderNodes('avatar, text@2')

    expect(nodes.map(({ key, preset }) => [key, preset])).toEqual([
      ['0', 'avatar'],
      ['1', 'text'],
      ['2', 'text'],
    ])
    expect(nodes.every(({ children }) => children.length === 0)).toBe(true)
  })

  test('expands a card into an image, a heading and two lines', () => {
    const [card] = getSkeletonLoaderNodes('card')

    expect(card?.children.map(({ preset }) => preset)).toEqual(['image', 'heading', 'text', 'text'])
    expect(card?.children.map(({ key }) => key)).toEqual(['0-0', '0-1', '0-2', '0-3'])
  })

  test('expands a table into rows of cells', () => {
    const [table] = getSkeletonLoaderNodes('table')
    const [firstRow] = table?.children ?? []

    expect(table?.children.every(({ preset }) => preset === 'table-row')).toBe(true)
    expect(firstRow?.children.every(({ preset }) => preset === 'text')).toBe(true)
    expect(firstRow?.children[0]?.key).toBe('0-0-0')
  })

  test.each(skeletonLoaderPresets)('%s nests no deeper than the template draws', (preset) => {
    expect(getSkeletonLoaderDepth(getSkeletonLoaderNodes(preset))).toBeLessThanOrEqual(skeletonLoaderMaxDepth)
  })
})

describe('getSkeletonLoaderNodeClass', () => {
  test('marks a bone and its camelCase element', () => {
    const [node] = getSkeletonLoaderNodes('list-item-avatar')

    expect(node && getSkeletonLoaderNodeClass(node)).toEqual({
      s_skeletonLoader__bone: false,
      s_skeletonLoader__listItemAvatar: true,
    })
    expect(node?.children[0] && getSkeletonLoaderNodeClass(node.children[0])).toEqual({
      s_skeletonLoader__bone: true,
      s_skeletonLoader__avatar: true,
    })
  })
})
