# SUI MCP foundation (M1-02 + M1-03) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A runnable `@khsura/sui-mcp` stdio server skeleton, and a build step that emits a version-accurate `dist/sui-api.json` inside `@khsura/sui`.

**Architecture:** New workspace package `packages/mcp` (src/ + tests/, vite SSR build to a single `dist/index.js` with a shebang). The API data shape is a Zod schema in `packages/shared` so producer (app build) and consumer (mcp, bundled) share it. The app generator parses the components barrels to find public components, extracts props/slots/events with `vue-component-meta`, validates against the schema, and writes `dist/sui-api.json` after `vite build`.

**Tech Stack:** yarn 4 workspaces + nx (inferred targets from package.json scripts), TypeScript strict, Vue 3.5 `defineProps<T>()`, `vue-component-meta`, `@modelcontextprotocol/sdk`, Zod v4, Vitest 4, vite-node.

**Spec:** `docs/superpowers/specs/2026-11-21-sui-improvement-plan-design.md` (Milestone 1; "Calls made after builder review" → API data location). OnePM tasks: `[M1-02]` e6o42s1gsbehys74pyzwbwcy, `[M1-03]` g4u6kitf0up76dgkrkmwrmde.

## Global Constraints

- Conventions from `~/.claude/CLAUDE.md`: camelCase files, `index.ts` barrels with `export *`, layer ranks (constants import nothing), arrow functions, no `console.log`, no magic numbers, no `as` without a one-line reason, Zod v4 top-level validators.
- `constants/` imports nothing; values needing types go in `configs/`.
- MCP stdio server must never write to stdout except protocol frames (logs → stderr).
- `sui-api.json` lives at `packages/app/dist/sui-api.json` (already covered by `"files": ["dist", …]`), and must contain the package `version` from `packages/app/package.json`.
- Verify per task: `yarn lint`, typecheck (`vue-tsc --noEmit` in app, `tsc --noEmit` in mcp/shared), `yarn test` in the touched package.
- Work on branch `feat/sui-mcp-foundation` (never commit on `main`). Commits use Conventional Commits + the Co-Authored-By trailer.

## Review Focus

1. **Path alias `@/app/*` not resolved by the checker** → props silently come back empty or `any`. Expect SButton to have a `size` prop with enum `['mini','small','default','large','extra']` (Task 3 test).
2. **Intersection props from `definitions/props/core`** (PropsColor, PropsBorder…) must be flattened into the component's props, not dropped. Expect SButton props to include `color` and `disabled` (Task 3 test).
3. **Barrel exports that rename or nest** (`export * from './form'`, `export { default as SAlert } from './sAlert.vue'`) — every public `S*` export must appear, internal `.vue` files must not. Expect the parsed list to include `SAlert`, `SInput` (nested in `form/`), and to equal the set of names exported by `components/index.ts` (Task 2 test).
4. **`prebuild` deletes `dist`** → generator must run after `vite build`, or the file vanishes. Verified by Task 4's build check.
5. **MCP stdout pollution** — any stray stdout write corrupts the stdio protocol. Expect the ping round-trip over the in-memory transport to succeed and the entry file to contain no `console.log` (lint rule `no-console` already enforced; Task 1 verification).

---

### Task 1: Scaffold `packages/mcp` with a `ping` tool (M1-02)

**Files:**
- Create: `packages/mcp/package.json` — name `@khsura/sui-mcp`, version `0.1.0`, `"type": "module"`, `"bin": { "sui-mcp": "./dist/index.js" }`, `"files": ["dist"]`, scripts `build` (`yarn g:vite build`), `lint` (`yarn g:eslint`), `test` (`yarn g:vitest run`), `typecheck` (`yarn g:tsc --noEmit` style matching shared); deps `@modelcontextprotocol/sdk`, `zod`; devDeps `@khsura/shared: workspace:^`.
- Create: `packages/mcp/tsconfig.json` (extends `@khsura/shared/tsconfig.base.json`, `types: ["node", "vitest/globals"]`, include `src`, `tests`, `*.config.ts`).
- Create: `packages/mcp/vite.config.ts` — `build.ssr: 'src/index.ts'`, `outDir: 'dist'`, `target: 'node20'`, `rollupOptions.output.banner: '#!/usr/bin/env node'`, `ssr.noExternal: ['@khsura/shared']`.
- Create: `packages/mcp/vitest.config.ts` — `environment: 'node'`, `include: ['tests/**/*.test.ts']`, `globals: true`.
- Create: `packages/mcp/eslint.config.mjs` — re-export `../shared/eslint.config.mjs`.
- Create: `packages/mcp/src/constants/server.ts` — `SERVER_NAME = 'sui-mcp'`, `PING_TOOL_NAME = 'ping'`, `PING_RESPONSE = 'pong'`; `src/constants/index.ts` barrel.
- Create: `packages/mcp/src/configs/serverInfo.ts` — `serverInfo = { name: SERVER_NAME, version }` with `version` from `../../package.json`; barrel.
- Create: `packages/mcp/src/handlers/ping.ts` — `registerPingTool = (server: McpServer): void`; barrel.
- Create: `packages/mcp/src/server/createSuiMcpServer.ts` — `createSuiMcpServer = (): McpServer` registers all handlers; barrel.
- Create: `packages/mcp/src/index.ts` — entry: create server, connect `StdioServerTransport`; on error write to `process.stderr` and exit code 1.
- Create: `packages/mcp/README.md` — one paragraph + run command.
- Modify: `release-please-config.json` (add `"packages/mcp": { "release-type": "node" }`), `.release-please-manifest.json` (add `"packages/mcp": "0.1.0"`).
- Test: `packages/mcp/tests/server/createSuiMcpServer.test.ts`

**Interfaces:**
- Produces: `createSuiMcpServer(): McpServer` (later tasks add `register*Tool(server)` handlers here); `serverInfo: { name: string; version: string }`.

- [ ] **Step 1: Create branch** — `git checkout -b feat/sui-mcp-foundation`.
- [ ] **Step 2: Write the failing test**

```ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { createSuiMcpServer } from '../../src/server'

const connect = async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  await createSuiMcpServer().connect(serverTransport)
  const client = new Client({ name: 'test', version: '0.0.0' })
  await client.connect(clientTransport)
  return client
}

describe('createSuiMcpServer', () => {
  it('lists the ping tool', async () => {
    const client = await connect()
    const { tools } = await client.listTools()
    expect(tools.map((tool) => tool.name)).toContain('ping')
  })
  it('answers ping with pong and the server version', async () => {
    const client = await connect()
    const response = await client.callTool({ name: 'ping', arguments: {} })
    expect(response.content).toEqual([{ type: 'text', text: expect.stringMatching(/^pong 0\.1\.0$/) }])
  })
})
```

- [ ] **Step 3: `yarn install`, then run** `cd packages/mcp && yarn test` — Expected: FAIL, cannot resolve `../../src/server`.
- [ ] **Step 4: Implement** the files above. `ping` returns `{ content: [{ type: 'text', text: \`${PING_RESPONSE} ${serverInfo.version}\` }] }`.
- [ ] **Step 5: Run** `yarn test` — Expected: 2 passed.
- [ ] **Step 6: Verify** `yarn lint`, `yarn typecheck`, `yarn build`, then `printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"x","version":"0"}}}' | node dist/index.js` prints one JSON-RPC result whose `serverInfo.name` is `sui-mcp`.
- [ ] **Step 7: Commit** — `feat(mcp): scaffold @khsura/sui-mcp stdio server with ping tool`.

### Task 2: Shared API schema + public component discovery (M1-03, part 1)

**Files:**
- Create: `packages/shared/schemas/suiApi.schema.ts` + `packages/shared/schemas/index.ts`; add `export * from './schemas'` to `packages/shared/index.ts`. Add `zod` to shared dependencies.
- Create: `packages/app/scripts/apiMetadata/componentExports.ts`
- Test: `packages/app/tests/scripts/apiMetadata/componentExports.test.ts`

**Interfaces:**
- Produces (shared):

```ts
suiApiPropSchema    = z.object({ name: z.string(), type: z.string(), required: z.boolean(), default: z.string().optional(), description: z.string(), enumValues: z.array(z.string()).optional() })
suiApiSlotSchema    = z.object({ name: z.string(), type: z.string(), description: z.string() })
suiApiEventSchema   = z.object({ name: z.string(), type: z.string(), description: z.string() })
suiApiComponentSchema = z.object({ name: z.string(), family: z.string(), file: z.string(), props: z.array(suiApiPropSchema), slots: z.array(suiApiSlotSchema), events: z.array(suiApiEventSchema) })
suiApiSchema        = z.object({ package: z.literal('@khsura/sui'), version: z.string(), generatedAt: z.iso.datetime(), components: z.array(suiApiComponentSchema) })
type SuiApi = z.infer<typeof suiApiSchema>   // and SuiApiComponent, SuiApiProp, …  (types file: packages/shared/types/suiApi.ts + barrel)
```

- Produces (app): `findPublicComponents = (componentsDir: string): ComponentExport[]` where `ComponentExport = { name: string; file: string /* repo-relative to packages/app */; family: string /* parent folder name, or 'core' for files directly in components/ */ }`. Implementation: read `index.ts`, follow `export * from './x'` recursively (resolving `./x/index.ts`), collect `export { default as SName } from './file.vue'`. Sorted by `name`.

- [ ] **Step 1: Write the failing test**

```ts
import path from 'node:path'
import { findPublicComponents } from '../../../scripts/apiMetadata/componentExports'

const componentsDir = path.resolve(__dirname, '../../../components')

describe('findPublicComponents', () => {
  const components = findPublicComponents(componentsDir)
  const names = components.map((component) => component.name)

  it('finds flat and nested exports', () => {
    expect(names).toEqual(expect.arrayContaining(['SAlert', 'SButton', 'SDialog', 'SInput']))
  })
  it('assigns family from the folder', () => {
    expect(components.find((c) => c.name === 'SButton')?.family).toBe('core')
    expect(components.find((c) => c.name === 'SInput')?.family).toBe('form')
  })
  it('has unique names, sorted', () => {
    expect(new Set(names).size).toBe(names.length)
    expect([...names].sort()).toEqual(names)
  })
  it('points at existing .vue files', () => {
    components.forEach((c) => expect(c.file).toMatch(/^components\/.+\.vue$/))
  })
})
```

- [ ] **Step 2: Run** `cd packages/app && yarn g:vitest run --project unit tests/scripts` — Expected: FAIL, module not found.
- [ ] **Step 3: Implement** schema/types in shared and `findPublicComponents` (regex over barrel text is enough; no TS AST needed).
- [ ] **Step 4: Run** the test — Expected: PASS. Also confirm `SFormInputError` appears only if the barrel exports it (match the barrel, not the filesystem).
- [ ] **Step 5: Verify** `yarn lint` + `vue-tsc --noEmit` in app, lint in shared.
- [ ] **Step 6: Commit** — `feat(app): shared sui-api schema and public component discovery`.

### Task 3: Extract props/slots/events with vue-component-meta (M1-03, part 2)

**Files:**
- Modify: `packages/app/package.json` — devDep `vue-component-meta` (match installed `vue` minor).
- Create: `packages/app/scripts/apiMetadata/componentMeta.ts`
- Create: `packages/app/scripts/apiMetadata/buildApiMetadata.ts`
- Test: `packages/app/tests/scripts/apiMetadata/buildApiMetadata.test.ts` (+ snapshot)

**Interfaces:**
- Consumes: `findPublicComponents`, `suiApiSchema`, `SuiApi`, `SuiApiComponent`.
- Produces: `extractComponentMeta = (checker: ComponentMetaChecker, appRoot: string, entry: ComponentExport): SuiApiComponent`; `buildApiMetadata = (appRoot: string): SuiApi` — creates one checker via `createChecker(path.join(appRoot, 'tsconfig.json'), { forceUseTs: true, printer: { newLine: 1 } })`, maps every public component, reads `version` from `package.json`, returns `suiApiSchema.parse(...)`.
- Mapping rules: drop props whose `global` is true (Vue built-ins like `key`, `ref`, `class`); `enumValues` = string-literal members of `prop.schema` when `schema.kind === 'enum'` and every member is a quoted literal (strip quotes; ignore `undefined`); `default` = `prop.default` as-is; slots/events from `meta.slots` / `meta.events`. Sort props, slots, events by name.

- [ ] **Step 1: Write the failing test**

```ts
import path from 'node:path'
import { buildApiMetadata } from '../../../scripts/apiMetadata/buildApiMetadata'
import pkg from '../../../package.json'

const appRoot = path.resolve(__dirname, '../../..')

describe('buildApiMetadata', { timeout: 120_000 }, () => {
  const api = buildApiMetadata(appRoot)
  const byName = (name: string) => api.components.find((c) => c.name === name)

  it('stamps the package version', () => {
    expect(api.version).toBe(pkg.version)
  })
  it('resolves alias + intersection props on SButton', () => {
    const props = byName('SButton')?.props ?? []
    expect(props.map((p) => p.name)).toEqual(expect.arrayContaining(['color', 'disabled', 'loading', 'size']))
    expect(props.find((p) => p.name === 'size')?.enumValues).toEqual(['default', 'extra', 'large', 'mini', 'small'])
  })
  it('exposes the activator slot on SDialog', () => {
    expect(byName('SDialog')?.slots.map((s) => s.name)).toContain('activator')
  })
  it('matches the snapshot for SButton, SInput, SDialog', () => {
    const picked = ['SButton', 'SInput', 'SDialog'].map(byName)
    expect(picked).toMatchSnapshot()
  })
})
```

(Sort `enumValues` alphabetically in the mapper so the assertion is order-stable.)

- [ ] **Step 2: Run** the test — Expected: FAIL, module not found.
- [ ] **Step 3: Implement** `componentMeta.ts` and `buildApiMetadata.ts`. If `createChecker` doesn't honour `@/app/*`, pass a tsconfig that sets `baseUrl` (create `packages/app/tsconfig.meta.json` extending `tsconfig.json`) rather than hacking paths.
- [ ] **Step 4: Run** — Expected: PASS; inspect the snapshot by eye: SButton `size` enum present, no `key`/`ref` props, descriptions empty-string not undefined.
- [ ] **Step 5: Verify** lint + `vue-tsc --noEmit` + full `yarn test` in app (existing tests still green).
- [ ] **Step 6: Commit** — `feat(app): extract component API metadata with vue-component-meta`.

### Task 4: Emit `dist/sui-api.json` in the build (M1-03, part 3)

**Files:**
- Create: `packages/app/scripts/apiMetadata/generateApiMetadata.ts` — CLI entry: `buildApiMetadata(appRoot)` → write `dist/sui-api.json` (2-space JSON); log the component count to stderr; exit 1 on schema failure with the Zod error.
- Create: `packages/app/scripts/apiMetadata/index.ts` barrel (exports `findPublicComponents`, `extractComponentMeta`, `buildApiMetadata`).
- Modify: `packages/app/package.json` — script `"build:api": "yarn g:vite-node scripts/apiMetadata/generateApiMetadata.ts"`; insert `&& yarn build:api` right after `yarn g:vite build` in `build`.

- [ ] **Step 1: Run** `cd packages/app && yarn build` — Expected: succeeds and `dist/sui-api.json` exists.
- [ ] **Step 2: Check content** — `node -e "const a=require('./dist/sui-api.json');console.error(a.version,a.components.length,a.components.find(c=>c.name==='SButton').props.length)"` prints `1.18.3 <N≥70> <M>0` with N equal to `findPublicComponents` length.
- [ ] **Step 3: Check packing** — `yarn pack --dry-run` (or `npm pack --dry-run`) lists `dist/sui-api.json`.
- [ ] **Step 4: Verify** lint + typecheck + `yarn test` in app.
- [ ] **Step 5: Commit** — `build(app): ship dist/sui-api.json with @khsura/sui`.
- [ ] **Step 6: OnePM** — move `[M1-02]` and `[M1-03]` to In Review with a comment linking the branch/PR.
