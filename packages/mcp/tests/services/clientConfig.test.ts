import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { applyClientConfigPlans, detectMcpClients, planClientConfigs } from '../../src/services'
import { makeTempDir } from '../testProject'

const suiEntry = { command: 'npx', args: ['-y', '@khsura/sui-mcp'] }
const dirs = () => ({ projectDir: makeTempDir(), homeDir: makeTempDir() })

describe('detectMcpClients', () => {
  it('falls back to Claude Code when no client marker exists', () => {
    expect(detectMcpClients(dirs())).toEqual({ clients: ['claude-code'], isFallback: true })
  })

  it('detects clients from project folders and the Windsurf home folder', () => {
    const options = dirs()

    mkdirSync(join(options.projectDir, '.cursor'))
    mkdirSync(join(options.projectDir, '.vscode'))
    mkdirSync(join(options.homeDir, '.codeium', 'windsurf'), { recursive: true })

    expect(detectMcpClients(options)).toEqual({ clients: ['cursor', 'vscode', 'windsurf'], isFallback: false })
  })
})

describe('planClientConfigs / applyClientConfigPlans', () => {
  it('writes each client its own file and key, and only prints Windsurf', () => {
    const options = dirs()
    const plans = planClientConfigs(['claude-code', 'cursor', 'vscode', 'windsurf'], options)

    applyClientConfigPlans(plans)

    const readJson = (file: string) => JSON.parse(readFileSync(join(options.projectDir, file), 'utf8'))

    expect(readJson('.mcp.json')).toEqual({ mcpServers: { sui: suiEntry } })
    expect(readJson('.cursor/mcp.json')).toEqual({ mcpServers: { sui: suiEntry } })
    expect(readJson('.vscode/mcp.json')).toEqual({ servers: { sui: { type: 'stdio', ...suiEntry } } })
    expect(plans[3]?.path).toBe(join(options.homeDir, '.codeium/windsurf/mcp_config.json'))
    expect(() => readFileSync(plans[3]?.path ?? '', 'utf8')).toThrow()
  })

  it('merges into an existing file without dropping other servers', () => {
    const options = dirs()
    const configPath = join(options.projectDir, '.mcp.json')

    writeFileSync(configPath, JSON.stringify({ mcpServers: { other: { command: 'other' } } }))
    applyClientConfigPlans(planClientConfigs(['claude-code'], options))

    expect(JSON.parse(readFileSync(configPath, 'utf8')).mcpServers).toEqual({
      other: { command: 'other' },
      sui: suiEntry,
    })
  })

  it('names the file on invalid JSON and plans nothing, so nothing is written', () => {
    const options = dirs()

    mkdirSync(join(options.projectDir, '.cursor'))
    writeFileSync(join(options.projectDir, '.cursor', 'mcp.json'), '{ not json')

    expect(() => planClientConfigs(['claude-code', 'cursor'], options)).toThrow(
      new RegExp(`${join(options.projectDir, '.cursor', 'mcp.json')} is not valid JSON`),
    )
    expect(() => readFileSync(join(options.projectDir, '.mcp.json'), 'utf8')).toThrow()
  })
})
