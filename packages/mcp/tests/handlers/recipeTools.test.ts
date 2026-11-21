import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import type { RecipeSourceOptions } from '../../src/types'
import { repoGuidesRoot, repoRecipesRoot } from '../../src/configs'
import { RECIPE_NAMES } from '../../src/constants'
import { createSuiMcpServer } from '../../src/server'
import { latestFixturePath, makeTempDir } from '../testProject'

const connectClient = async (recipeSourceOptions: RecipeSourceOptions = { sourceRoot: repoRecipesRoot }) => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()

  await createSuiMcpServer(
    { env: {}, cwd: makeTempDir(), bundledPath: latestFixturePath },
    { sourceRoot: repoGuidesRoot },
    recipeSourceOptions,
  ).connect(serverTransport)
  const client = new Client({ name: 'test', version: '0.0.0' })

  await client.connect(clientTransport)

  return client
}

const responseText = (response: Awaited<ReturnType<Client['callTool']>>): string => {
  const [first] = Array.isArray(response.content) ? response.content : []

  return first?.type === 'text' ? first.text : ''
}

describe('recipe tools', () => {
  it('registers list_recipes and get_recipe', async () => {
    const client = await connectClient()
    const { tools } = await client.listTools()

    expect(tools.map((tool) => tool.name)).toEqual(expect.arrayContaining(['list_recipes', 'get_recipe']))
  })

  it('list_recipes lists all six recipes with when to use', async () => {
    const client = await connectClient()
    const text = responseText(await client.callTool({ name: 'list_recipes', arguments: {} }))

    expect(text).toContain('6 recipes.')
    for (const name of RECIPE_NAMES) {
      expect(text).toContain(`| \`${name}\` |`)
    }

    expect(text).toContain('| `data-table` | Data table with sorting and pagination | A list of records')
  })

  it('get_recipe returns the notes, the full code in a vue block and the live example link', async () => {
    const client = await connectClient()
    const response = await client.callTool({ name: 'get_recipe', arguments: { name: 'activator-overlays' } })
    const text = responseText(response)

    expect(response.isError).toBeUndefined()
    expect(text).toContain('# Dialog, menu, tooltip and snackbar')
    expect(text).toContain('**When to use:**')
    expect(text).toContain('passes **no** slot props')
    expect(text).toContain('```vue\n<template>')
    expect(text).toContain('<template #activator="{ on, attrs }">')
    expect(text).toContain('</script>\n```')
    expect(text).toContain('Live example: https://sui.surakh.com/?path=/story/recipes--activator-overlays')
  })

  it('get_recipe with an unknown name is an error listing the names', async () => {
    const client = await connectClient()
    const response = await client.callTool({ name: 'get_recipe', arguments: { name: 'login-page' } })

    expect(response.isError).toBe(true)
    expect(responseText(response)).toBe(
      `Unknown recipe \`login-page\`. Available recipes: ${RECIPE_NAMES.map((name) => `\`${name}\``).join(', ')}.`,
    )
  })

  it('reports a missing recipe file as an error', async () => {
    const client = await connectClient({ sourceRoot: makeTempDir() })
    const listResponse = await client.callTool({ name: 'list_recipes', arguments: {} })
    const getResponse = await client.callTool({ name: 'get_recipe', arguments: { name: 'app-shell' } })

    expect(listResponse.isError).toBe(true)
    expect(getResponse.isError).toBe(true)
    expect(responseText(getResponse)).toContain('Recipe source file is missing')
  })
})
