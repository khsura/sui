import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import type { ResolveSuiApiOptions } from '../../src/types'
import { createSuiMcpServer } from '../../src/server'
import { latestFixturePath, makeProject, makeTempDir, olderFixturePath } from '../testProject'

const connectClient = async (apiSourceOptions: ResolveSuiApiOptions) => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()

  await createSuiMcpServer(apiSourceOptions).connect(serverTransport)
  const client = new Client({ name: 'test', version: '0.0.0' })

  await client.connect(clientTransport)

  return client
}

const responseText = (response: Awaited<ReturnType<Client['callTool']>>): string => {
  const [first] = Array.isArray(response.content) ? response.content : []

  return first?.type === 'text' ? first.text : ''
}

const bundledOnly = (): ResolveSuiApiOptions => ({ env: {}, cwd: makeTempDir(), bundledPath: latestFixturePath })

describe('component tools', () => {
  it('registers list_components and get_component_api', async () => {
    const client = await connectClient(bundledOnly())
    const { tools } = await client.listTools()

    expect(tools.map((tool) => tool.name)).toEqual(expect.arrayContaining(['list_components', 'get_component_api']))
  })

  it('list_components states the bundled version and source', async () => {
    const client = await connectClient(bundledOnly())
    const text = responseText(await client.callTool({ name: 'list_components', arguments: {} }))

    expect(text).toContain('@khsura/sui 1.18.3 · source: bundled')
    expect(text).toContain('| SButton | core | Button — core UI building block |')
  })

  it('reports an older project install with its own version and components', async () => {
    const project = makeProject({ fixturePath: olderFixturePath })
    const client = await connectClient({ env: { SUI_PROJECT_ROOT: project.root }, bundledPath: latestFixturePath })
    const text = responseText(await client.callTool({ name: 'list_components', arguments: {} }))

    expect(text).toContain('@khsura/sui 1.10.0 · source: project')
    expect(text).toContain('3 components.')
    expect(text).not.toContain('SAppBar')
  })

  it('get_component_api says a component needs a newer @khsura/sui when only the bundled API has it', async () => {
    const project = makeProject({ fixturePath: olderFixturePath })
    const client = await connectClient({ env: { SUI_PROJECT_ROOT: project.root }, bundledPath: latestFixturePath })
    const response = await client.callTool({ name: 'get_component_api', arguments: { name: 'SAppBar' } })
    const text = responseText(response)

    expect(response.isError).toBe(true)
    expect(text).toContain('`SAppBar` is not in @khsura/sui 1.10.0 installed in this project')
    expect(text).toContain('It exists in @khsura/sui 1.18.3, so it needs a newer @khsura/sui.')
  })

  it('get_component_api renders props with defaults as code and enum values', async () => {
    const client = await connectClient(bundledOnly())
    const text = responseText(await client.callTool({ name: 'get_component_api', arguments: { name: 's-button' } }))

    expect(text).toContain('# SButton')
    expect(text).toContain('| `tag` | `"a" \\| "button" \\| null` | `"button"` | no | `a`, `button` |')
    expect(text).toContain('## Events (1)')
  })

  it('shows dynamic slot families with their pattern', async () => {
    const client = await connectClient(bundledOnly())
    const text = responseText(await client.callTool({ name: 'get_component_api', arguments: { name: 'STable' } }))

    expect(text).toContain('## Slots (8)')
    expect(text).toContain('| `item.<column>` (pattern `^item\\..+$`) | `TableItemSlotProps<T>` |')
    expect(text).toContain('| `noData` | `any` |')
  })

  it('adds the activator note to activator components', async () => {
    const client = await connectClient(bundledOnly())
    const text = responseText(await client.callTool({ name: 'get_component_api', arguments: { name: 'dialog' } }))

    expect(text).toContain('**Activator pattern:**')
    expect(text).toContain('v-bind="attrs"')
  })

  it('tells STooltip users not to bind slot props on its activator', async () => {
    const client = await connectClient(bundledOnly())
    const text = responseText(await client.callTool({ name: 'get_component_api', arguments: { name: 'tooltip' } }))

    expect(text).toContain('**Activator:**')
    expect(text).not.toContain('**Activator pattern:**')
  })

  it('adds the layout-child note to layout children', async () => {
    const client = await connectClient(bundledOnly())
    const text = responseText(await client.callTool({ name: 'get_component_api', arguments: { name: 'SAppBar' } }))

    expect(text).toContain('**Layout child:**')
  })

  it.each([
    ['STextField', 'SUI equivalent: `SInput`'],
    ['s-modal', 'SUI equivalent: `SDialog`'],
  ])('answers %s with the other-library mapping before the close names', async (name, advice) => {
    const client = await connectClient(bundledOnly())
    const response = await client.callTool({ name: 'get_component_api', arguments: { name } })
    const text = responseText(response)

    expect(response.isError).toBe(true)
    expect(text).toContain('a name from another UI library')
    expect(text).toContain(advice)
    expect(text).not.toContain('Did you mean')
  })

  it('falls back to the close names when the alias target is missing from this version', async () => {
    const client = await connectClient(bundledOnly())
    const text = responseText(await client.callTool({ name: 'get_component_api', arguments: { name: 'STabsWindow' } }))

    expect(text).toContain('Did you mean:')
    expect(text).not.toContain('another UI library')
  })

  it('returns an error with suggestions for an unknown name', async () => {
    const client = await connectClient(bundledOnly())
    const response = await client.callTool({ name: 'get_component_api', arguments: { name: 'SDialg' } })

    expect(response.isError).toBe(true)
    expect(responseText(response)).toContain('Did you mean: `SDialog`')
  })

  it('returns an error when no API can be resolved', async () => {
    const emptyDir = makeTempDir()
    const client = await connectClient({ env: {}, cwd: emptyDir, bundledPath: `${emptyDir}/missing.json` })
    const response = await client.callTool({ name: 'list_components', arguments: {} })

    expect(response.isError).toBe(true)
  })
})
