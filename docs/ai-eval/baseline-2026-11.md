# Baseline, 2026-11: AI-generated SUI pages without MCP

| | |
|---|---|
| Date | 2026-11-21 |
| Condition | `baseline`: sui-plugin skills only, no MCP server, no SUI source (see `README.md` §1) |
| Generator | Claude Code subagents (general-purpose, model Claude Opus 5.5), one fresh agent per prompt, run in parallel |
| Library | `@khsura/sui` 1.18.3, built locally from this repo's milestone branch |
| Validator | `@khsura/sui-mcp` 0.1.0 `validate_sui_template`, built locally |
| Render | Vite 8.1.3, Vue 3.5.39, Chromium (Playwright 1.61.1), 375×812 and 1280×800 |
| Pages / screenshots | [`baseline/pages/`](baseline/pages/) / [`baseline/screenshots/`](baseline/screenshots/) |

## Headline

- **9 of 10 pages have at least one visual defect** (only 07 is visually clean). There are **38
  visual defects** in total (18 at 375px, 20 at 1280px), about 3.8 per page.
- **The validator found 0 errors and 0 warnings on all 10 pages.** The skills already prevent
  name-level mistakes (unknown components, props, slots, activator bindings, layout `for`). What
  breaks is how the components behave and look together, which a static check can't see.
- **There are 6 manual API misuses** across 5 pages, and 3 `vue-tsc` strict errors (1 is a misuse,
  2 are a library typing gap).

## Results

Visual defect codes: OVF overflow · OVL overlap · MIS misalignment · POS broken overlay/positioning
· CON unreadable contrast · SPC missing spacing · NFC non-functional control (definitions:
[`rubric.md`](rubric.md)). Cells read `375 / 1280`. A `–` means 0 at both widths.

| # | Page | Val. err | Val. warn | Manual | OVF | OVL | MIS | POS | CON | SPC | NFC | Visual 375 | Visual 1280 | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | settings | 0 | 0 | 1 | – | 1 / 1 | 2 / 2 | – | – | 1 / 0 | – | 4 | 3 | M7 `type="email"` in `SForm`: the native browser bubble covers the SUI error (AI). `SSelect` renders unoutlined and narrow next to outlined `SInput`s (lib default). The bio counter sits far below the textarea (AI/lib). The dialog is edge-to-edge at 375 (lib) |
| 02 | dashboard-shell | 0 | 0 | 1 | – | – | – | 1 / 0 | 0 / 1 | 1 / 1 | 0 / 1 | 2 | 3 | M8: the drawer relies on opening itself, but it only reacts to resize, so it starts **closed on desktop** (docs: layout.md "auto-opens"). The mobile drawer has no scrim and covers the app bar and its own toggle (lib). The avatar is flush to the right edge, because `SAppBar` has no inline padding (lib). "Paid" is white on success green, 2.73:1 (lib theme) |
| 03 | mobile-list | 0 | 0 | 0 | – | – | – | – | – | 1 / 1 | – | 1 | 1 | The app bar title starts at x = 0 and the count touches the right edge (`SAppBar` padding, lib). The menu, search and activator binding all work |
| 04 | date-range-filter | 0 | 0 | 1 | 1 / 1 | – | 1 / 2 | – | – | – | – | 2 | 3 | M4 `block` on both Apply and Reset in one flex row: Reset is pushed off-screen (page 661 / 1418px wide) (AI). The buttons sit below the input baseline because the inputs reserve error space (lib). `SSelect` is unoutlined next to the outlined date inputs (lib). The to/from error was not exercised |
| 05 | card-grid | 0 | 0 | 0 | 1 / 1 | – | 0 / 1 | – | 1 / 1 | 1 / 1 | – | 3 | 4 | At 1280 the title breaks mid-word, "Headphone/s" (`SCardTitle` word-break, lib). The card is made a flex column, so `SImage` shrinks and the image heights differ (AI). The cart badge is clipped at the viewport edge at 375 (AI). The header has no top gap (AI). "New" is white on success green, 2.73:1 (lib) |
| 06 | login | 0 | 0 | 2 | – | – | 1 / 1 | – | – | – | 1 / 1 | 2 | 2 | M4 `hide-details` on `SCheckbox` also hides its **label**, so "Remember me" is missing (lib, undocumented). M5 `s_textAlign__center` has no effect on the flex `SCardTitle`: the title is left-aligned and the subtitle centred (lib). Centring, validation and loading all work |
| 07 | stepper-wizard | 0 | 0 | 1 | – | – | – | – | – | – | – | 0 | 0 | M2 `SRadioGroup v-model` is typed `string \| null` (vue-tsc TS2322) (AI). Visually clean; every step works |
| 08 | tabs-expansion | 0 | 0 | 0 | – | – | 2 / 2 | – | – | – | – | 2 | 2 | At 375 the tabs wrap onto 2 rows (lib). Panel content is indented differently from its header (lib). An inline `max-width` on `SContainer` leaves the content stuck to the left at 1280 (AI). Tab switching fails because of a toolchain bug, which is excluded (see below) |
| 09 | snackbar | 0 | 0 | 0 | – | – | – | – | 1 / 1 | 1 / 0 | – | 2 | 1 | The Undo action is `color="primary"` on the dark snackbar, 2.18:1 (AI/docs). The rename dialog is edge-to-edge at 375 (lib). Delete, Undo, the rename dialog and the timeouts all work |
| 10 | detail-two-column | 0 | 0 | 0 | – | – | – | – | 0 / 1 | – | – | 0 | 1 | "Delivered" is white on success green, 2.73:1 (lib). Stacking and breadcrumbs are correct. The orders table scrolls inside its card at 375 (not counted) |
| | **Total** | **0** | **0** | **6** | **4** | **2** | **14** | **1** | **6** | **8** | **3** | **18** | **20** | |

- Pages with ≥ 1 visual defect: **9 / 10**. Only 07 is clean, and 10's single defect is the
  theme's success colour at 1280.
- Pages with any visual defect or manual misuse: **10 / 10**. 07 has a `v-model` type misuse.
- `vue-tsc` strict: 3 errors. In 02 and 10 the `STable` `#item.<key>` slot's `item` is `any`, so
  indexing a typed record fails (library typing gap, not counted). The 07 error is counted as M2.
  See [`baseline/vue-tsc.txt`](baseline/vue-tsc.txt).
- Runtime: no console errors or Vue warnings on any page or scenario
  ([`baseline/console.json`](baseline/console.json)).

## Top failure types

These are ranked by the number of counted defects and misuses they caused. This list feeds the
MCP and hardening tasks.

| Rank | Root cause | Count | Pages | Category | Where to fix |
|---|---|---|---|---|---|
| 1 | **Responsive layout written by the AI**: `block` buttons side by side, tabs that wrap at 375 (no scroll or shrink by default), an un-centred `max-width` container, badges and headers touching edges | 8 | 04, 05, 08 | OVF, MIS, SPC, M4 | MCP recipes (filter bar, page header, centred container, tabs on mobile), plus a validator rule for `block` siblings |
| 2 | **`SAppBar` and mobile `SDialog` have no inline padding or viewport margin**, so content touches the screen edge | 6 | 01, 02, 03, 09 | SPC | lib defaults, or a recipe that shows the padding |
| 3 | **Field rows misaligned by the reserved error/details space and by inconsistent component paddings** (actions below the input baseline, a detached textarea counter, expansion-panel content and header indent) | 5 | 01, 04, 08 | MIS | lib; docs should show `hide-details` / aligned action rows |
| 4 | **Card internals**: `SCardTitle` breaks words mid-word, ignores `text-align` utility classes because it's flex, and `SImage` shrinks inside a flex card | 5 | 05, 06 | OVF, MIS, M5 | lib (`word-break`, alignment props) plus a card-grid recipe |
| 5 | **Behaviour the docs misstate or omit**: `SCheckbox` `hide-details` hides the label, and `SNavigationDrawer` doesn't open itself on mount on desktop (layout.md says it auto-opens) | 5 | 02, 06 | NFC, M4, M8 | docs first (skills, plus MCP validator rules), then lib |
| 6 | **`SSelect` defaults to an unoutlined, shadowed, content-width control** that clashes with the outlined `SInput` / `SDatePickerInput` in the same form. Storybook hides this, because it sets `SSelect: { outlined: true }` as an app default | 4 | 01, 04 | MIS | lib default or docs: make selects match inputs, or document the needed props in `sui-form` |
| 7 | **Theme `success` uses white text on `#4caf50`** (2.73:1) for chips and badges | 4 | 02, 05, 10 | CON | lib theme (darker success or dark on-colour) |
| 8 | **Native HTML attributes fighting SUI validation** (`type="email"` inside `SForm`) | 3 | 01 | OVL, M7 | `sui-form` skill: say to use `type="text"` with `inputmode="email"`, or add `novalidate`, plus a validator rule |
| 9 | **Colour choice on dark surfaces**: a `primary` action on the default snackbar (2.18:1) | 2 | 09 | CON | docs or recipe (snackbar action colour), or lib on-colour |
| 10 | **Mobile drawer overlay**: no scrim, and it covers the app bar and its own toggle | 1 | 02 | POS | lib |
| 11 | Wrong `v-model` type (`string \| null` on `SRadioGroup`) | 1 | 07 | M2 | docs (state the model type), plus vue-tsc in the loop |

These counts add up to the 38 visual defects plus the 6 manual misuses (44). Each item has been
assigned its main cause.

**What the validator can't see:** 0 validator findings against 38 visual defects. Every counted
problem was a runtime, layout or style issue, not a naming issue. Visual and behaviour rules need
docs, recipes and library fixes. They also need validator rules for the patterns that can be
detected statically: `block` siblings in a row, `hide-details` on `SCheckbox`, `type="email"` in
`SForm`, text-align utility classes on `SCardTitle`, and `color="primary"` actions in `SSnackbar`.

## Library-wide (not counted per page)

- **`SApp` has no `min-height: 100vh`.** On every page shorter than the viewport, the app
  background (and a drawer's height, in 02) stops where the content ends, leaving a white band
  below (01, 02, 03 search, 04, 07, 08, 09). No page code causes it. 06 avoided it by setting
  `min-height: 100vh` on its own wrapper.

## Excluded: suspected upstream toolchain bug

- **08: tab switching doesn't work.** `STabs` does update `activeTab`, but the sections'
  `v-show` never re-applies. A minimal repro with no SUI at all fails the same way: an element
  with **only** `v-show` + `:key` inside `v-for`. The `@vitejs/plugin-vue` 6.0.7 / Vite 8.1.3 dev
  transform emits it as a plain `createElementVNode` with no `NEED_PATCH` flag inside a
  `STABLE_FRAGMENT`, so the directive is never patched. `vue/compiler-sfc` 3.5.39 called directly
  emits a block and works. Adding any other attribute (e.g. a `class`) makes it work. This is
  excluded from the counts. It needs a separate check, because consumer apps on the same toolchain
  would see it.
- **Resolved (M2-09):** the cause is the Vue 3.5.39 template compiler, not Vite, plugin-vue or SUI.
  `compiler-sfc` 3.5.39 called with the SFC's binding metadata emits the same code. `sections` is a
  `const`, so the `v-for` becomes a `STABLE_FRAGMENT`. `:key` makes the compiler plan a block and
  skip `NEED_PATCH`, and then the stable `v-for` turns the block back into a plain vnode. The vnode
  ends up with no patch flag, so `v-show` is never patched. A `class` doesn't help (after-M1 page
  08 has one); text interpolation in the element does. Fixed upstream in Vue 3.5.41
  (vuejs/core#11682). The harness now pins Vue 3.5.46, and page 08's tabs switch.

## Limitations

- The generating agents were told not to read `packages/`. This is an instruction, not a sandbox.
  Their transcripts show file reads only under `plugins/sui-plugin/` (checked). Claude Code
  injected the session's ambient context into each agent automatically: the user-level
  `CLAUDE.md` files and the project auto-memory, which holds a short SUI summary (activator
  pattern, layout `for`, shared props). That is a small amount of SUI knowledge beyond the skills.
  Later runs get the same context, so the comparison still holds, but the true no-context
  baseline may be slightly worse.
- The generator is the same model family as the scorer. Scoring follows `rubric.md` literally to
  limit bias. All screenshots are committed so a second scorer can re-check them.
- Scenarios exercise each page's main interactions. Some behaviour wasn't exercised (04's to/from
  date error, 07's Finish, 09's Undo restore), and the notes say so where it matters.
- One sample per prompt. Later runs should compare against the same 10 prompts and may add samples
  per prompt to measure variance.
