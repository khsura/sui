import { NodeTypes } from '@vue/compiler-dom'
import { parseVueTemplate } from '../../src/lib'

describe('parseVueTemplate', () => {
  it('parses a bare fragment', () => {
    const { root, errors } = parseVueTemplate('<SButton />')

    expect(errors).toEqual([])
    expect(root?.children[0]).toMatchObject({ type: NodeTypes.ELEMENT, tag: 'SButton' })
  })

  it('parses the template block of an SFC with whole-file positions', () => {
    const { root } = parseVueTemplate('<script setup>\n</script>\n<template>\n  <SButton />\n</template>')
    const button = root?.children.find((child) => child.type === NodeTypes.ELEMENT)

    expect(button?.loc.start).toMatchObject({ line: 4, column: 3 })
  })

  it('returns no root for an SFC without a template', () => {
    expect(parseVueTemplate('<script setup>\nconst a = 1\n</script>').root).toBeNull()
  })

  it('collects syntax errors with their position instead of throwing', () => {
    expect(parseVueTemplate('<div>\n  <span>').errors[0]).toMatchObject({ line: 2, column: 3 })
  })
})
