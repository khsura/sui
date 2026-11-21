# SUI improvement plan — design

Date: 2026-11-21 · Tracker: OnePM project **SUI** (`fgy8ynjmjy4tdepd8tqk2jbk`)

## Intent

When an AI assistant builds UI with `@khsura/sui`, the result often drifts from the
intended design ("broken UI"), and each drift becomes a UI bug ticket. The goal of
this plan is **fewer broken-UI tickets** — not feature parity with Vuetify. Vuetify
(cloned at `../vuetify`) is a reference for ideas, not a target.

### Where broken UI comes from today

The last 19 `fix:` commits (since 2026-06) are mostly SUI itself breaking under
correct use, not AI misuse:

- layout under content stress — switch/checkbox shape when the label wraps, datepicker
  input width/height (iOS Safari), datepicker year list format
- overlay positioning — autocomplete menu opened above the field, mobile drawer scrim
- binding mistakes inside SUI — `:styles` vs `:style` in `SWindow`, `to` without `href`
- a11y — checkbox/radio/switch not keyboard reachable

So there are two sources:

1. **AI misuses SUI** — invented props, missing `v-bind="attrs"` on activators, wrong
   layout nesting (`for` / `name`), hand-built replacements for missing components.
2. **SUI breaks when used correctly** — edge cases nobody exercised.

The plan attacks both.

## Goals

- G1. An MCP server that gives any AI client (Claude, Cursor, VS Code, …) accurate SUI
  API, tested recipes, and a validator for generated templates.
- G2. Existing components survive stress: long text, narrow/mobile widths, iOS Safari,
  dark mode, keyboard use — proven by visual regression tests.
- G3. Add the components AI most often hand-builds, so it stops composing them from `div`s.
- G4. Global configuration (density/variant/rounded defaults, icon aliases) so an app's
  look is set once instead of per call site.

## Non-goals

- Porting all of Vuetify. No Calendar rewrite, Parallax, Sparkline, Heatmap, Map, Video, etc.
- Vuetify One–style bins/playgrounds/bug-report tools in the MCP.
- A breaking API redesign of existing components.

## Anti-goals (failure even if it "works")

- MCP data that drifts from the shipped package version (stale props = the same bug).
- New components added without the stress stories/tests G2 requires.
- Config options that change the default look of existing apps on upgrade.

## Constraints

- Monorepo: yarn workspaces + nx; packages `app` (`@khsura/sui` 1.18.x) and `shared`.
- Props are TypeScript types in `packages/app/definitions/props/` (72 files) — not
  runtime objects, so API metadata must be extracted from types.
- Existing AI knowledge lives in `plugins/sui-plugin/skills/*` (Claude only). Memory rule:
  every component feature change also updates the plugin skills and bumps its version.
- Storybook 10 with `@storybook/addon-vitest` and Playwright already installed;
  `@storybook/addon-mcp` exists but is dev-only (localhost:6006).
- Global coding conventions (`~/.claude/CLAUDE.md`): camelCase files, barrels, layer ranks,
  tests under `tests/`.

## Approaches considered

| | Approach | Trade-off |
|---|---|---|
| **A (chosen)** | Guardrail MCP (generated API + recipes + template validator) **and** component hardening with visual tests | Most work; only option that hits both sources of broken UI |
| B | Thin MCP serving existing skill markdown | Fast, but Claude already has this via the plugin — gap barely moves |
| C | No MCP; `eslint-plugin-sui` + visual tests | Catches mistakes in CI for any tool, but doesn't guide the AI while writing |

The user handed the choice to me; A was chosen because it is the only approach that
addresses source 2 (SUI's own breakage), which dominates recent fixes. C's lint rules
can reuse the validator's rule engine later.

## Design

### Milestone 1 — SUI MCP server (high priority)

New package `packages/mcp` (`@khsura/sui-mcp`), stdio via `npx`, optional hosted HTTP later.

- **API metadata generation** — a build step uses `vue-component-meta` (or the TS
  compiler) over `components/` + `definitions/props/` to emit `sui-api.json`: per
  component props (type, default, description), slots (+ slot props), emits, and the
  package version. Generated in CI on every release, so it cannot drift.
- **Tools**
  - `list_components` — names + one-line purpose + family.
  - `get_component_api(name)` — props/slots/events from `sui-api.json`.
  - `get_recipe(name)` / `list_recipes` — tested, copy-ready patterns: app shell layout,
    validated form, dialog/menu/tooltip with activator, data table with pagination,
    responsive grid, theme + dark mode setup. Each recipe is also a Storybook story, so
    it is visually tested (G2).
  - `get_guide(topic)` — installation (Vue/Nuxt), theming, component defaults, display
    breakpoints; sourced from `docs/components/` and plugin skill references.
  - `validate_sui_template(code)` — parses a `.vue` SFC template and reports: unknown
    `S*` component, unknown prop, wrong prop value for enum types (size, variant…),
    activator slot without both `v-on="on"` and `v-bind="attrs"`, layout children
    missing `for` / unmatched `SLayout name`, form inputs with `rules` outside `SForm`.
    Returns line-anchored errors + fix hints.
- **Setup** — `npx @khsura/sui-mcp config` writes client config (Claude Code, Cursor,
  VS Code), mirroring Vuetify's CLI; docs page + plugin README entry.
- **Success measure** — a fixed set of ~10 prompts ("build a settings page with a form
  and a confirm dialog", …) run with and without the MCP; count validator errors and
  visual defects. Re-run after each milestone.

### Milestone 2 — Harden existing components

- Visual regression harness: Storybook stories + Playwright screenshots via
  `addon-vitest`, at 375 / 768 / 1280 widths, light + dark.
- **Stress stories** per component: long/wrapping labels, empty and overflowing content,
  disabled/error/loading states, RTL-safe text, keyboard focus.
- Audit order driven by bug history and AI usage: form inputs (Input, Select,
  Autocomplete, Checkbox/Radio/Switch, Textarea, DatePicker), overlays (Menu, Dialog,
  Tooltip, Snackbar — position/flip/scrim), layout (AppBar, NavigationDrawer, Main,
  BottomNavigation), Table, Tabs, Card, List.
- Each found defect = its own bug task with the reproducing story attached.
- A11y pass on interactive components (focus ring, roles, labels).

### Milestone 3 — New frequently used components

Chosen because AI tends to hand-build them (and Vuetify proves the demand):
`SAvatar`, `SPagination` (standalone; reuse table pagination logic), `SCombobox`,
`SFileInput`, `SSkeletonLoader`, `SEmptyState`, `SSlider` (+ range), `SNumberInput`,
`SSnackbarQueue`. Second wave if time allows: `STimePicker`, `STimeline`, `STreeview`,
`SVirtualScroll` / `SInfiniteScroll`, `SOtpInput`, `SBanner`.

Each new component ships with: props definition, stories incl. stress stories,
unit tests, `docs/components/*.md`, plugin skill reference, and appears in the MCP.

### Milestone 4 — Global configuration

- Global `density` (`default | comfortable | compact`) across inputs, lists, tables, buttons.
- Global default `variant` / `rounded` per component through the existing
  `componentDefaultsService` (document and extend rather than replace).
- Icon aliases (`$close`, `$expand`, …) so components and apps don't hard-code mdi names.
- A scoped defaults provider component (`SDefaultsProvider`) for per-subtree overrides.
- All defaults keep today's look unless the app opts in.

## Decided

- Approach A; milestone order 1 → 2 → 3 → 4, with M2's harness started early because
  M1 recipes depend on it.
- MCP is a new workspace package, API data generated from source.
- Plan is tracked as OnePM milestones + tasks in project SUI.
- Capacity: one AI agent working sequentially, no deadline. Milestones are undated;
  tasks carry story points, are ordered, and each is self-contained (context, files,
  acceptance criteria) so an agent can pick it up cold. M3 wave 2 stays in the backlog
  until wave 1 is done.

## Calls made after builder review (Claude's calls — user delegated the how)

- **API data location** — `sui-api.json` is generated at build and shipped inside
  `@khsura/sui` (`dist/sui-api.json`). The MCP reads it from the user's
  `node_modules/@khsura/sui`, so it always matches the installed version; it falls back
  to a copy bundled in `@khsura/sui-mcp` (latest) when no project is found. Release-please
  releases both packages together.
- **Plugin skills stay, generated from the same source** — skill reference API tables
  are generated from `sui-api.json` + recipes (extra M1 task); hand-written prose/gotchas
  remain. One source, two delivery channels.
- **M2 includes the fixes** — each defect is its own bug task inside M2. Overlay and form
  input fixes land before M3 starts; the rest can run in parallel with M3.
- **Visual test environment** — Playwright (Chromium + WebKit) in the official Playwright
  Docker image on GitHub Actions; baselines committed, updated only from CI. WebKit is a
  proxy for Safari; a short manual real-iOS checklist (form inputs, overlays, drawer) is
  run before each minor release.
- **Success measure** — baseline run before M1 ships, using Claude Code + the current
  default Claude model, 10 fixed prompts, run by the maintainer. Target: ≥50% fewer
  validator errors + visual defects after M1+M2. It reports progress; it does not gate
  milestones.

## Left to the builder

- `vue-component-meta` vs custom TS extraction; template parser choice for the validator.
- Exact recipe list beyond the six named; exact MCP tool names.
- Hosting of an HTTP endpoint (not required for v1).
- Story-point estimates per task.
