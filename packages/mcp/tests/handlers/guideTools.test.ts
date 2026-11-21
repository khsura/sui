import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import type { GuideSourceOptions } from '../../src/types'
import { repoGuidesRoot } from '../../src/configs'
import { createSuiMcpServer } from '../../src/server'
import { latestFixturePath, makeTempDir } from '../testProject'

const connectClient = async (guideSourceOptions: GuideSourceOptions = { sourceRoot: repoGuidesRoot }) => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()

  await createSuiMcpServer({ env: {}, cwd: makeTempDir(), bundledPath: latestFixturePath }, guideSourceOptions).connect(
    serverTransport,
  )
  const client = new Client({ name: 'test', version: '0.0.0' })

  await client.connect(clientTransport)

  return client
}

const responseText = (response: Awaited<ReturnType<Client['callTool']>>): string => {
  const [first] = Array.isArray(response.content) ? response.content : []

  return first?.type === 'text' ? first.text : ''
}

describe('guide tools', () => {
  it('registers list_guides and get_guide', async () => {
    const client = await connectClient()
    const { tools } = await client.listTools()

    expect(tools.map((tool) => tool.name)).toEqual(expect.arrayContaining(['list_guides', 'get_guide']))
  })

  it('list_guides lists all six topics', async () => {
    const client = await connectClient()
    const text = responseText(await client.callTool({ name: 'list_guides', arguments: {} }))

    expect(text).toContain('6 guides.')
    for (const topic of ['installation', 'theming', 'component-defaults', 'display', 'i18n', 'common-mistakes']) {
      expect(text).toContain(`| \`${topic}\` |`)
    }
  })

  it('get_guide returns the guide markdown with the live examples link', async () => {
    const client = await connectClient()
    const response = await client.callTool({ name: 'get_guide', arguments: { topic: 'i18n' } })
    const text = responseText(response)

    expect(response.isError).toBeUndefined()
    expect(text).toContain('# vue-i18n setup')
    expect(text).toContain('getFormInputModelValueRules')
    expect(text).toContain('Live examples: https://sui.surakh.com/')
  })

  it('get_guide with an unknown topic is an error listing the topics', async () => {
    const client = await connectClient()
    const response = await client.callTool({ name: 'get_guide', arguments: { topic: 'routing' } })

    expect(response.isError).toBe(true)
    expect(responseText(response)).toContain('Unknown guide topic `routing`. Available topics: `installation`')
  })

  it('get_guide reports a missing source file as an error', async () => {
    const client = await connectClient({ sourceRoot: makeTempDir() })
    const response = await client.callTool({ name: 'get_guide', arguments: { topic: 'theming' } })

    expect(response.isError).toBe(true)
    expect(responseText(response)).toContain('Guide source file is missing')
  })
})
