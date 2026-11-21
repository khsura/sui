import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { createSuiMcpServer } from '../../src/server'
import { latestFixturePath, makeTempDir } from '../testProject'

const connectClient = async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()

  await createSuiMcpServer({ env: {}, cwd: makeTempDir(), bundledPath: latestFixturePath }).connect(serverTransport)
  const client = new Client({ name: 'test', version: '0.0.0' })

  await client.connect(clientTransport)

  return client
}

const validateTemplate = async (code: string) => {
  const client = await connectClient()
  const response = await client.callTool({ name: 'validate_sui_template', arguments: { code } })
  const [first] = Array.isArray(response.content) ? response.content : []

  return { isError: response.isError, text: first?.type === 'text' ? first.text : '' }
}

describe('validate_sui_template tool', () => {
  it('is registered', async () => {
    const { tools } = await (await connectClient()).listTools()

    expect(tools.map((tool) => tool.name)).toContain('validate_sui_template')
  })

  it('reports a clean template with the version header', async () => {
    const { isError, text } = await validateTemplate('<SButton size="small">Save</SButton>')

    expect(isError).toBeFalsy()
    expect(text).toContain('@khsura/sui 1.18.3 · source: bundled')
    expect(text).toContain('No issues found.')
  })

  it('lists issues as a successful result, not an MCP error', async () => {
    const { isError, text } = await validateTemplate('<SButton size="big" colour="red" />')

    expect(isError).toBeFalsy()
    expect(text).toContain('2 errors, 0 warnings.')
    expect(text).toContain(
      '- 1:10 [invalid-enum-value] `big` is not a valid `size` for `SButton`. — fix: Use one of: `default`, `extra`, `large`, `mini`, `small`.',
    )
    expect(text).toContain('- 1:21 [unknown-prop] `SButton` has no prop `colour`. — fix: Did you mean `color`?')
  })

  it('rejects empty code', async () => {
    const { isError } = await validateTemplate('')

    expect(isError).toBe(true)
  })
})
