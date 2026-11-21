import { McpConfigParseError, mcpServerSnippet, mergeMcpServerEntry } from '../../src/lib'

const entry = { command: 'npx', args: ['-y', '@khsura/sui-mcp'] }

const merge = (existingText: string | undefined) =>
  mergeMcpServerEntry({ existingText, serversKey: 'mcpServers', entryName: 'sui', entry })

describe('mergeMcpServerEntry', () => {
  it('creates the file contents when the file is missing', () => {
    const merged = merge(undefined)

    expect(merged.status).toBe('created')
    expect(JSON.parse(merged.text)).toEqual({ mcpServers: { sui: entry } })
    expect(merged.text.endsWith('\n')).toBe(true)
  })

  it('treats an empty file like a missing one', () => {
    expect(merge('  \n').status).toBe('created')
  })

  it('adds sui next to existing servers and top-level keys without clobbering them', () => {
    const existing = JSON.stringify({ inputs: [], mcpServers: { other: { command: 'other-mcp' } } })
    const merged = merge(existing)

    expect(merged.status).toBe('added')
    expect(JSON.parse(merged.text)).toEqual({ inputs: [], mcpServers: { other: { command: 'other-mcp' }, sui: entry } })
  })

  it('adds the servers key when the file has none', () => {
    expect(JSON.parse(merge('{"theme":"dark"}').text)).toEqual({ theme: 'dark', mcpServers: { sui: entry } })
  })

  it('updates an existing sui entry but keeps its extra fields such as env', () => {
    const existing = JSON.stringify({
      mcpServers: { sui: { command: 'node', args: ['old.js'], env: { SUI_PROJECT_ROOT: '/app' } } },
    })

    const merged = merge(existing)

    expect(merged.status).toBe('updated')
    expect(JSON.parse(merged.text).mcpServers.sui).toEqual({ ...entry, env: { SUI_PROJECT_ROOT: '/app' } })
  })

  it('reports unchanged and returns the original text when sui is already configured', () => {
    const existing = JSON.stringify({ mcpServers: { sui: entry } })
    const merged = merge(existing)

    expect(merged).toEqual({ status: 'unchanged', text: existing })
  })

  it('throws a clear error for invalid JSON', () => {
    expect(() => merge('{ "mcpServers": ')).toThrow(McpConfigParseError)
    expect(() => merge('{ "mcpServers": ')).toThrow(/is not valid JSON/)
  })

  it('throws when the top level is not an object', () => {
    expect(() => merge('[]')).toThrow(/JSON object at the top level/)
  })

  it('throws when the servers key is not an object', () => {
    expect(() => merge('{"mcpServers": []}')).toThrow(/"mcpServers" value that is not an object/)
  })
})

describe('mcpServerSnippet', () => {
  it('wraps the entry in its servers key', () => {
    expect(JSON.parse(mcpServerSnippet({ serversKey: 'mcpServers', entryName: 'sui', entry }))).toEqual({
      mcpServers: { sui: entry },
    })
  })
})
