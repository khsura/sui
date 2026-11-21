import { extractMarkdownSection } from '../../src/lib'

const markdown = [
  '# Title',
  '',
  '## Install',
  '',
  'Intro text.',
  '',
  '```bash',
  '# not a heading',
  'yarn add x',
  '```',
  '',
  '### Yarn',
  '',
  'Yarn text.',
  '',
  '---',
  '',
  '## Next',
  '',
  'Next text.',
].join('\n')

describe('extractMarkdownSection', () => {
  it('returns the section with its sub-sections up to the next same-level heading, trimming trailing rules', () => {
    const section = extractMarkdownSection(markdown, 'Install')

    expect(section?.startsWith('## Install')).toBe(true)
    expect(section).toContain('### Yarn')
    expect(section?.endsWith('Yarn text.')).toBe(true)
    expect(section).not.toContain('## Next')
  })

  it('ignores heading-like lines inside fenced code', () => {
    expect(extractMarkdownSection(markdown, 'not a heading')).toBeUndefined()
    expect(extractMarkdownSection(markdown, 'Install')).toContain('# not a heading')
  })

  it('stops at the first sub-heading when includeSubsections is false', () => {
    const section = extractMarkdownSection(markdown, 'Install', { includeSubsections: false })

    expect(section).toContain('yarn add x')
    expect(section).not.toContain('### Yarn')
  })

  it('returns undefined for an unknown heading', () => {
    expect(extractMarkdownSection(markdown, 'Missing')).toBeUndefined()
  })
})
