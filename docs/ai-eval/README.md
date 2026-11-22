# AI eval: broken UI from AI-generated SUI code

A repeatable measurement of how often an AI coding assistant writes broken `@khsura/sui` pages. The
first run (`baseline-2026-11.md`) is the **baseline** to compare later runs against: the AI has the
sui-plugin skills, but no MCP server and no SUI source. Later runs (with the MCP server, after
hardening) repeat **exactly** the steps below and add a results file plus a `<condition>/` folder. The
second run, with the MCP server, is `after-m1.md` with its files in `with-mcp/`. The third run, with the MCP
server and the M2 hardening (condition `hardened`), is `after-m2.md` with its files in `after-m2/`.

| File | What it is |
|---|---|
| `prompts.md` | The 10 frozen prompts (never edit; add a `prompts-v2.md` and a new baseline instead) |
| `rubric.md` | How to score: validator counts, the manual misuse checklist, visual defect categories |
| `baseline-2026-11.md` | Baseline results table, totals and top failure types |
| `baseline/pages/NN-name.vue` | The generated SFCs, verbatim (excluded from lint by a local `eslint.config.mjs`) |
| `baseline/screenshots/` | `NN-name--<scenario>--<375\|1280>.png` (`.jpg` when the PNG is over 150KB) |
| `baseline/validator.txt`, `vue-tsc.txt`, `contrast.txt`, `console.json` | Raw output of the automatic checks |
| `after-m1.md` | With-MCP results, the comparison with the baseline, tool usage, and the remaining failure types mapped to tasks |
| `with-mcp/` | The same layout as `baseline/`, plus `mcp-calls/NN-name.jsonl` (every MCP call each generator made) |
| `after-m2.md`, `after-m2/` | The `hardened` run: results, the baseline vs after-M1 vs after-M2 comparison, and follow-up tasks. The same layout as `with-mcp/`, plus `probes/` (one-off probe shots where a fixed scenario missed the page's controls) |
| `tools/validatePages.mjs` | Stdio MCP client: runs `validate_sui_template` from the built `packages/mcp` on every page |
| `tools/mcpCall.mjs` | One-shot stdio MCP client the `with-mcp` generators use: prints the server instructions or one tool result, and logs each call |
| `tools/harness/` | The throwaway Vite + Vue render app: screenshots, interaction scenarios, contrast scan, typecheck |

## 1. Conditions

| Condition | The generating agent may use |
|---|---|
| `baseline` | Only files under `plugins/sui-plugin/` (the skills). No MCP, no `packages/`, no web |
| `with-mcp` | The same, plus the `@khsura/sui-mcp` server through `tools/mcpCall.mjs` (results: `after-m1.md`) |
| `hardened` | The same as `with-mcp`, after the hardening tasks (later run) |

Generate with the current default Claude Code model. Write down the model in the results file.

## 2. Generate (one fresh agent per prompt)

For each prompt in `prompts.md`, start a **fresh** general-purpose subagent (no shared context; the
10 can run in parallel). Give it this instruction verbatim, with the prompt and output path filled
in:

```text
You are an AI coding assistant in a consumer app that uses @khsura/sui. You may read ONLY files
under <repo>/plugins/sui-plugin/ for SUI knowledge. Do not read anything under packages/ (or
anywhere else in that repo), do not use MCP tools, do not search the web, and do not run or render
the code. Write one Vue SFC `Page.vue` implementing the request below, to <out>/NN-name/Page.vue
(use the Write tool; create the folder if needed). Assume SUI is already installed and registered
globally by the app (per the getting-started skill) and that the page is mounted as the root
component. The file must be self-contained (mock data inline, `<script setup lang="ts">`). When
done, report only the file path and a list of the SUI components you used.

Request:
<prompt text from prompts.md, verbatim>
```

For the `with-mcp` / `hardened` conditions, replace the "do not use MCP tools" clause with "use the
`sui` MCP server tools as you see fit", and change nothing else. The reading restriction is an
instruction, not a sandbox. Check the agent's report and tool use, and rerun any agent that broke
the restriction.

### 2a. With MCP: reaching the server

A running Claude Code session can't attach a new MCP server to its subagents, so the generators reach
the built server through `tools/mcpCall.mjs`. Each call spawns `packages/mcp/dist/index.js` over stdio
(with `SUI_PROJECT_ROOT` = `packages/app`, so it reads the local `dist/sui-api.json`), runs
`initialize`, and prints the server `instructions` or the tool result text. Build first:

```bash
(cd packages/app && yarn build) && (cd packages/mcp && yarn build)
node docs/ai-eval/tools/mcpCall.mjs ping '{}'         # "pong <version>"
```

Append this to the wrapper instruction, after the MCP clause, with `NN-name` and paths filled in:

```text
In this environment it is reached through a CLI, run with Bash exactly like this:

SUI_EVAL_PAGE=NN-name SUI_EVAL_LOG=<scratch>/mcp-logs/NN-name.jsonl node <repo>/docs/ai-eval/tools/mcpCall.mjs <tool> '<json-args>'

(for validate_sui_template you may pass `--file <path-to-your-Page.vue>` instead of JSON args).
Running that command is the only permitted use of anything outside plugins/sui-plugin/; do not
read the CLI's source. Before writing code, run the command with the single argument
`instructions` and follow those instructions; use the tools (list_components, get_component_api,
list_recipes, get_recipe, get_guide, validate_sui_template) as an AI client would.
```

and change the report line to "report only the file path, a list of the SUI components you used, and
the MCP tools you called with a count per tool". Write each page to a fresh, empty output folder (an
old `Page.vue` left from an earlier run looks like a finished page).

`SUI_EVAL_LOG` gets one JSON line per call (`{time, page, tool, args, isError}`; `code` is logged as
its length). Copy the logs to `<condition>/mcp-calls/` and count calls per tool from them; compare
with the agents' own counts. Then validate, render and score exactly as below.

Copy each `Page.vue` unchanged to `<condition>/pages/NN-name.vue`. **Don't fix anything by hand.**

## 3. Validate (automatic API misuse)

```bash
(cd packages/app && yarn build)        # dist/s-ui.js + dist/sui-api.json
(cd packages/mcp && yarn build)        # dist/index.js (bundles the API data)
node docs/ai-eval/tools/validatePages.mjs docs/ai-eval/<condition>/pages > docs/ai-eval/<condition>/validator.txt
```

The last line is `SUMMARY [{file, errors, warnings}, ...]`. Those are column a1.

## 4. Render and screenshot

```bash
H=/tmp/ai-eval-app                                  # any scratch dir outside the repo
cp -R docs/ai-eval/tools/harness "$H" && cd "$H" && npm install && npx playwright install chromium
ln -s <repo>/packages/app/dist sui-dist             # the local build, not npm
ln -s <repo>/packages/app/@types sui-types
mkdir -p pages && for f in <repo>/docs/ai-eval/<condition>/pages/*.vue; do
  n=$(basename "$f" .vue); mkdir -p "pages/$n"; cp "$f" "pages/$n/Page.vue"; done
npx vite &                                          # http://localhost:5199/?page=NN-name
node screenshot.mjs out                             # out/*.png|jpg, out/fullpage/*.jpg, out/console.json
node contrast.mjs > out/contrast.txt
npm run typecheck > out/vue-tsc.txt
```

How the harness works (`src/main.js`):

- It mirrors the getting-started skill: `createSUI()`, `@khsura/sui/base.css`,
  `@khsura/sui/style.css` and `@mdi/font`.
- Because the prompt says SUI is registered globally, every `S*` export is registered as a global
  component.
- If the page's template has its own `<SApp>`, the page is mounted as the root. Otherwise the
  harness wraps it in `SApp`, like the `App.vue` in the getting-started skill.
- Keep `vue` at **3.5.41 or newer**. The baseline and after-M1 runs pinned 3.5.39, whose template
  compiler has a bug (fixed upstream in 3.5.41, vuejs/core#11682): when an element in a `v-for`
  over a constant array has `:key` and `v-show` and no other dynamic binding, it gets no patch flag,
  so its `v-show` never updates. That is why page 08's tabs "didn't switch". SUI wasn't involved:
  the same template without SUI fails on 3.5.39 and works on 3.5.41.
- `sass` is listed, and `@khsura/sui/helpers.scss` is aliased, because pages may `@use` the documented SCSS helpers
  (added in the after-M2 run; page 10 used them).
- Run the eval against a build whose `package.json` version matches its features. The MCP gates advice by the
  installed version, so a milestone branch that is behind `main`'s version gets advice meant for older releases (see
  `after-m2.md`, Limitations).
- `vue-router` is listed because the built `s-ui.js` imports it, although `@khsura/sui` doesn't
  declare it as a dependency. Without it, Vite can't resolve the import and no page mounts.

`screenshot.mjs` does the following:

- Shoots the viewport at 375×812 and 1280×800.
- For each page, also runs the fixed interaction scenarios in `scenarios.mjs` (opening dialogs,
  menus and the drawer, submitting empty forms, moving through the stepper, switching tabs, firing
  snackbars). Each scenario starts from a fresh load.
- Writes a full-page `base` capture to `fullpage/` for scoring below the fold. Don't commit it.
- Logs console errors, failed steps and horizontal overflow to `console.json`.

Copy the viewport shots (not `fullpage/`) to `<condition>/screenshots/` and the raw outputs next to
them.

## 5. Score

Open **every** screenshot and score it with `rubric.md`. Record the results in the results file:

- One row per prompt.
- Visual defects by category at both widths.
- A one-line note per page with cause tags (`AI`, `docs`, `lib`).
- Totals.
- A "Top failure types" ranking.

Keep library-wide and upstream-toolchain findings in their own sections. They aren't part of the
per-page counts.
