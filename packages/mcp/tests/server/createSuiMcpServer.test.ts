import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import packageJson from '../../package.json' with { type: 'json' }
import { createSuiMcpServer } from '../../src/server'

const connectClient = async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()

  await createSuiMcpServer().connect(serverTransport)
  const client = new Client({ name: 'test', version: '0.0.0' })

  await client.connect(clientTransport)

  return client
}

describe('createSuiMcpServer', () => {
  it('lists the ping tool', async () => {
    const client = await connectClient()
    const { tools } = await client.listTools()

    expect(tools.map((tool) => tool.name)).toContain('ping')
  })

  it('answers ping with pong and the server version', async () => {
    const client = await connectClient()
    const response = await client.callTool({ name: 'ping', arguments: {} })

    expect(response.content).toEqual([{ type: 'text', text: `pong ${packageJson.version}` }])
  })

  it('sends server instructions that point the AI at the API, recipes and the validator', async () => {
    const client = await connectClient()
    const instructions = client.getInstructions() ?? ''

    expect(instructions).toContain('get_component_api')
    expect(instructions).toContain('get_recipe')
    expect(instructions).toContain('ALWAYS run `validate_sui_template`')
    expect(instructions).toContain('`installation`')
  })
})
