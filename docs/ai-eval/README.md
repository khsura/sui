# AI eval: broken UI from AI-generated SUI code

A repeatable measurement of how often an AI coding assistant writes broken `@khsura/sui` pages. The
first run (`baseline-2026-11.md`) is the **baseline** to compare later runs against: the AI has the
sui-plugin skills, but no MCP server and no SUI source. Later runs (with the MCP server, after
hardening) repeat **exactly** the steps below and add a new `results-<condition>-<yyyy-mm>.md` plus a
`<condition>/` folder.

| File | What it is |
|---|---|
| `prompts.md` | The 10 frozen prompts (never edit; add a `prompts-v2.md` and a new baseline instead) |
| `rubric.md` | How to score: validator counts, the manual misuse checklist, visual defect categories |
| `baseline-2026-11.md` | Baseline results table, totals and top failure types |
| `baseline/pages/NN-name.vue` | The generated SFCs, verbatim (excluded from lint by a local `eslint.config.mjs`) |
| `baseline/screenshots/` | `NN-name--<scenario>--<375\|1280>.png` (`.jpg` when the PNG is over 150KB) |
| `baseline/validator.txt`, `vue-tsc.txt`, `contrast.txt`, `console.json` | Raw output of the automatic checks |
| `tools/validatePages.mjs` | Stdio MCP client: runs `validate_sui_template` from the built `packages/mcp` on every page |
| `tools/harness/` | The throwaway Vite + Vue render app: screenshots, interaction scenarios, contrast scan, typecheck |

## 1. Conditions

| Condition | The generating agent may use |
|---|---|
| `baseline` | Only files under `plugins/sui-plugin/` (the skills). No MCP, no `packages/`, no web |
| `mcp` | The same, plus the `@khsura/sui-mcp` server (later run) |
| `hardened` | The same as `mcp`, after the hardening tasks (later run) |

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

For the `mcp` / `hardened` conditions, replace the "do not use MCP tools" clause with "use the
`sui` MCP server tools as you see fit", and change nothing else. The reading restriction is an
instruction, not a sandbox. Check the agent's report and tool use, and rerun any agent that broke
the restriction.

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
