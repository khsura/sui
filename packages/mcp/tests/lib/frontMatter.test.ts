import { parseFrontMatter } from '../../src/lib'

describe('parseFrontMatter', () => {
  it('splits flat key: value pairs from the trimmed body', () => {
    const markdown = '---\ntitle: App shell\nwhenToUse: A page frame: bar and drawer\n---\n\n- note one\n'

    expect(parseFrontMatter(markdown)).toEqual({
      attributes: { title: 'App shell', whenToUse: 'A page frame: bar and drawer' },
      body: '- note one',
    })
  })

  it('reads CRLF line endings and an empty body', () => {
    expect(parseFrontMatter('---\r\ntitle: Grid\r\n---')).toEqual({ attributes: { title: 'Grid' }, body: '' })
  })

  it('skips lines that are not key: value pairs', () => {
    expect(parseFrontMatter('---\n# comment\ntitle: Grid\n---\nbody')?.attributes).toEqual({ title: 'Grid' })
  })

  it('returns undefined without a leading front matter block', () => {
    expect(parseFrontMatter('# Title\n---\ntitle: x\n---')).toBeUndefined()
  })
})
