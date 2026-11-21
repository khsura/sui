import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { runConfigCommand } from '../../src/handlers'
import { makeTempDir } from '../testProject'

const run = (args: string[], cwd = makeTempDir()) => {
  const output = { stdout: '', stderr: '' }

  const exitCode = runConfigCommand(args, {
    stdout: (text) => {
      output.stdout += text
    },
    stderr: (text) => {
      output.stderr += text
    },
    cwd,
    homeDir: makeTempDir(),
  })

  return { exitCode, ...output, cwd }
}

describe('runConfigCommand', () => {
  it('writes .mcp.json for --client claude-code in --project', () => {
    const projectDir = makeTempDir()
    const { exitCode, stdout } = run(['--client', 'claude-code', '--project', projectDir])

    expect(exitCode).toBe(0)
    expect(stdout).toContain(`Claude Code: ${join(projectDir, '.mcp.json')}: created with the "sui" server.`)
    expect(JSON.parse(readFileSync(join(projectDir, '.mcp.json'), 'utf8')).mcpServers.sui.command).toBe('npx')
  })

  it('prints the planned contents on --dry-run and writes nothing', () => {
    const { exitCode, stdout, cwd } = run(['--client', 'cursor', '--dry-run'])

    expect(exitCode).toBe(0)
    expect(stdout).toContain('would be created with the "sui" server. New contents:')
    expect(stdout).toContain('"@khsura/sui-mcp"')
    expect(existsSync(join(cwd, '.cursor', 'mcp.json'))).toBe(false)
  })

  it('says when it falls back to Claude Code', () => {
    const { stdout, cwd } = run([])

    expect(stdout).toContain('No MCP client config found')
    expect(existsSync(join(cwd, '.mcp.json'))).toBe(true)
  })

  it('prints a snippet for Windsurf instead of writing outside the project', () => {
    const { stdout } = run(['--client', 'windsurf'])

    expect(stdout).toContain('mcp_config.json (user-level, not written by this command)')
    expect(stdout).toContain('"mcpServers"')
  })

  it('rejects an unknown client with usage on stderr', () => {
    const { exitCode, stderr, stdout } = run(['--client', 'emacs'])

    expect(exitCode).toBe(1)
    expect(stderr).toContain('Unknown client "emacs"')
    expect(stderr).toContain('Usage: npx @khsura/sui-mcp config')
    expect(stdout).toBe('')
  })

  it('fails without writing when an existing config is invalid JSON', () => {
    const projectDir = makeTempDir()

    writeFileSync(join(projectDir, '.mcp.json'), '{')

    const { exitCode, stderr } = run(['--project', projectDir])

    expect(exitCode).toBe(1)
    expect(stderr).toContain('.mcp.json is not valid JSON')
    expect(readFileSync(join(projectDir, '.mcp.json'), 'utf8')).toBe('{')
  })
})
