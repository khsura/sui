import type { Recipe } from '../../src/types'
import { formatRecipe } from '../../src/utils'

const recipe: Recipe = {
  name: 'theme-setup',
  title: 'Theme',
  whenToUse: 'Theming',
  components: ['SSwitch'],
  notes: 'Some notes',
  code: '<template><SSwitch /></template>\n',
}

describe('formatRecipe', () => {
  it('fences the code as vue and links the story', () => {
    expect(formatRecipe(recipe)).toBe(
      [
        '# Theme',
        '**When to use:** Theming',
        '**Components:** `SSwitch`',
        'Some notes',
        '```vue\n<template><SSwitch /></template>\n```',
        'Live example: https://sui.surakh.com/?path=/story/recipes--theme-setup',
      ].join('\n\n'),
    )
  })

  it('uses a longer fence when the code contains a backtick fence', () => {
    expect(formatRecipe({ ...recipe, code: '<!-- ```ts -->' })).toContain('````vue\n<!-- ```ts -->\n````')
  })

  it('leaves out empty notes', () => {
    expect(formatRecipe({ ...recipe, notes: '' })).not.toContain('\n\n\n\n')
  })
})
