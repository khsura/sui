#!/usr/bin/env node
// Runs the built @khsura/sui-mcp server over stdio and calls `validate_sui_template`
// on every `*.vue` file in a directory. Prints the raw tool output per file and a
// JSON summary line ({ file, errors, warnings }) at the end.
//
// Usage (from the repo root, after `yarn build` in packages/app and packages/mcp):
//   node docs/ai-eval/tools/validatePages.mjs docs/ai-eval/baseline/pages
import { readdir, readFile } from 'node:fs/promises'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const serverEntry = join(repoRoot, 'packages/mcp/dist/index.js')
const pagesDir = resolve(process.argv[2] ?? join(repoRoot, 'docs/ai-eval/baseline/pages'))
// The tool's summary line is "N error(s), M warning(s)." or "No issues found."
const countSeverity = (text, severity) => Number(text.match(new RegExp(`(\\d+) ${severity}s?\\b`))?.[1] ?? 0)

const main = async () => {
  const transport = new StdioClientTransport({ command: process.execPath, args: [serverEntry], stderr: 'ignore' })
  const client = new Client({ name: 'sui-ai-eval', version: '1.0.0' })

  await client.connect(transport)
  const files = (await readdir(pagesDir)).filter((name) => name.endsWith('.vue')).sort()
  const summary = []

  for (const file of files) {
    const code = await readFile(join(pagesDir, file), 'utf8')
    const response = await client.callTool({ name: 'validate_sui_template', arguments: { code } })
    const text = response.content.map((part) => part.text ?? '').join('\n')

    process.stdout.write(`\n=== ${file} ===\n${text}\n`)
    summary.push({ file, errors: countSeverity(text, 'error'), warnings: countSeverity(text, 'warning') })
  }

  process.stdout.write(`\nSUMMARY ${JSON.stringify(summary)}\n`)
  await client.close()
}

main()
