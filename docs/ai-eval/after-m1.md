# After M1, 2026-11: AI-generated SUI pages with the MCP server

| | |
|---|---|
| Date | 2026-11-21 |
| Condition | `with-mcp`: sui-plugin skills **plus** the `@khsura/sui-mcp` server, no SUI source (see `README.md` §1 and §2) |
| Generator | Claude Code subagents (general-purpose, model Claude Opus 5.5), one fresh agent per prompt, run in parallel. Same model, client, prompts and wrapper as the baseline. Only the MCP clause changed |
| MCP access | `tools/mcpCall.mjs`, a one-shot stdio client for the built server (Claude Code can't add an MCP server to a running subagent). Every call is logged in [`with-mcp/mcp-calls/`](with-mcp/mcp-calls/) |
| Library | `@khsura/sui` 1.18.3, built locally from this repo's milestone branch |
| MCP server / validator | `@khsura/sui-mcp` 0.1.0, built locally (`SUI_PROJECT_ROOT` = `packages/app`, so it reads the local `dist/sui-api.json`) |
| Render | The same harness, scenarios and widths as the baseline: Vite 8.1.3, Vue 3.5.39, Chromium (Playwright 1.61.1), 375×812 and 1280×800 |
| Pages / screenshots | [`with-mcp/pages/`](with-mcp/pages/) / [`with-mcp/screenshots/`](with-mcp/screenshots/) |

## Headline

- **Visual defects fell from 38 to 30** (−21%): 15 at 375px and 15 at 1280px, about 3.0 per page. **Manual
  API misuses fell from 6 to 4**, and **`vue-tsc` strict errors fell from 3 to 0**.
- **9 of 10 pages still have at least one visual defect**, the same as the baseline. 07 is clean again,
  and it is now also free of misuses, so **9 of 10 pages have any defect or misuse** (baseline 10).
- The MCP fixed the **page-composition** failures: the desktop drawer that started closed, `block`
  buttons pushing Reset off screen, an un-centred `max-width` container, a clipped cart badge, a flex
  title ignoring `text-align`, and a `v-model` type error. Recipes and the validator did that work.
- What remains is mostly **component-level**: library defaults and component bugs that show up with
  correct, documented usage (unoutlined `SSelect`, edge-to-edge mobile dialogs, theme `success`
  contrast, `SCardTitle` word-break, tabs wrapping, a menu clipped by its list). These belong to the M2
  hardening tasks.
- **One defect was propagated by the MCP itself:** the `validated-form` recipe uses `type="email"`
  inside `SForm`. Both form generators that read it copied it (01, 06), so the native browser bubble
  still fires on top of SUI's error text.
- **The generators used the tools heavily:** 179 logged calls, about 18 per page. Every generator read
  the instructions and called `list_recipes`, `get_component_api` and `validate_sui_template`; 9 of 10
  fetched at least one recipe.

## Results

Visual defect codes: OVF overflow · OVL overlap · MIS misalignment · POS broken overlay/positioning ·
CON unreadable contrast · SPC missing spacing · NFC non-functional control (definitions:
[`rubric.md`](rubric.md)). Cells read `375 / 1280`. A `–` means 0 at both widths.

| # | Page | Val. err | Val. warn | Manual | OVF | OVL | MIS | POS | CON | SPC | NFC | Visual 375 | Visual 1280 | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | settings | 0 | 0 | 1 | – | 1 / 1 | 1 / 1 | – | – | 1 / 0 | – | 3 | 2 | M7 `type="email"` in `SForm`, copied from the `validated-form` recipe: native validation blocks submit and its bubble covers the SUI error (AI/docs, confirmed by a probe because the fixed `Save` click misses the "Save changes" label; the inline errors themselves render). `SSelect` is unoutlined and shadowed next to outlined inputs, and the bio counter sits far below the textarea (lib). The dialog is edge-to-edge at 375 (lib) |
| 02 | dashboard-shell | 0 | 0 | 0 | – | – | – | 1 / 0 | 0 / 1 | – | – | 1 | 1 | Follows the `app-shell` recipe: the drawer now starts **open on desktop** and closed on mobile, and the app bar has inline spacing. The mobile drawer still has no scrim and covers the app bar and its own toggle (lib). "Paid" is white on success green, 2.73:1 (lib theme). The table scrolls inside its wrapper at 375 (not counted) |
| 03 | mobile-list | 0 | 0 | 0 | – | – | – | 1 / 1 | 1 / 1 | – | – | 2 | 2 | The row `SMenu` is clipped by the list: "Call/Edit/Delete" are cut to one letter at both widths (lib: the menu isn't kept inside the viewport or teleported). No `SAvatar` exists, so the AI hand-built initials avatars with forced white text on light colours, 1.94–2.65:1 (AI). No app bar, so the baseline's app-bar edge defect is gone |
| 04 | date-range-filter | 0 | 0 | 1 | – | – | 1 / 1 | – | – | 1 / 1 | 1 / 1 | 3 | 3 | M2 `SDatePickerInput v-model` starts as `''`: opening the picker shows **"Invalid date" and a grid of NaN** (lib: an empty string should mean no date, docs don't say). `SSelect` is unoutlined next to the date inputs and the buttons sit above the input baseline at 1280 (lib). The card is flush with the top of the viewport (AI). The `block` buttons now sit in an `SRow`/`SColumn` grid from the `responsive-grid` recipe, so nothing is pushed off screen. The to/from error was not exercised |
| 05 | card-grid | 0 | 0 | 0 | 0 / 1 | – | 0 / 1 | – | 1 / 1 | – | – | 1 | 3 | At 1280 the title breaks mid-word, "Headphone/s" (`SCardTitle` word-break, lib). The card is again made a flex column, so `SImage` shrinks and image heights differ (AI). "New" is white on success green, 2.73:1 (lib). The cart badge and header spacing are now fine; the grid is 1/2/4 columns as asked |
| 06 | login | 0 | 0 | 2 | – | – | – | – | – | – | 1 / 1 | 1 | 1 | M4 `hide-details` on `SCheckbox` still hides its **label**, so "Remember me" is missing (lib, undocumented, the validator doesn't flag it). M7 `type="email"` in `SForm` from the recipe (not visible in the scenarios: the empty submit passes native validation). The title is now centred with flex classes (the baseline's M5 is gone). Centring, validation and loading work |
| 07 | stepper-wizard | 0 | 0 | 0 | – | – | – | – | – | – | – | 0 | 0 | Clean. During generation the validator reported `form-rules-outside-form` on the radio group; the generator wrapped the step in `SForm` and re-validated. The radio `v-model` is typed `string \| undefined`, so the baseline's vue-tsc error is gone |
| 08 | tabs-expansion | 0 | 0 | 0 | – | – | 1 / 1 | – | – | – | – | 1 | 1 | At 375 the tabs wrap onto 2 rows (lib). Panel content is indented 8px less than its header at 1280 (lib). The container is centred now (the baseline's inline `max-width` is gone). Tab switching fails the same way as in the baseline (excluded, see below) |
| 09 | snackbar | 0 | 0 | 0 | 1 / 0 | – | – | – | 1 / 1 | 1 / 0 | – | 3 | 1 | At 375 the `SListItem` content collapses next to the two text-button actions: names and sizes are cut to "Q…", "84. 0…" (lib/AI). The Undo action is `color="primary"` on the dark snackbar, 2.18:1 (AI/docs, computed from styles). The rename dialog is edge-to-edge at 375 (lib). Delete, Undo, the rename dialog and the 4 s timeouts work |
| 10 | detail-two-column | 0 | 0 | 0 | – | – | – | – | 0 / 1 | – | – | 0 | 1 | "Delivered" is white on success green, 2.73:1 (lib, computed from styles). Stacking and breadcrumbs are correct. The orders table scrolls inside its card at 375 (not counted) |
| | **Total** | **0** | **0** | **4** | **2** | **2** | **7** | **3** | **8** | **4** | **4** | **15** | **15** | |

- Pages with ≥ 1 visual defect: **9 / 10** (only 07 is clean).
- Pages with any visual defect or manual misuse: **9 / 10**.
- `vue-tsc` strict: **0 errors** ([`with-mcp/vue-tsc.txt`](with-mcp/vue-tsc.txt)). The baseline's `STable`
  `#item.<key>` slot typing gap is gone, because `sui-api.json` and the components now have typed slots.
- Validator on the final pages: 0 errors, 0 warnings ([`with-mcp/validator.txt`](with-mcp/validator.txt)).
  During generation it found 1 warning (07, fixed by the generator before it finished).
- Runtime: no console errors or Vue warnings. One scenario step failed: 01's `Save` click, because the
  button says "Save changes" ([`with-mcp/console.json`](with-mcp/console.json)).

## Baseline vs with MCP

| Measure | Baseline | With MCP | Change |
|---|---|---|---|
| OVF overflow | 4 | 2 | −2 |
| OVL overlap | 2 | 2 | 0 |
| MIS misalignment | 14 | 7 | −7 |
| POS broken overlay / positioning | 1 | 3 | +2 |
| CON unreadable contrast | 6 | 8 | +2 |
| SPC missing spacing | 8 | 4 | −4 |
| NFC non-functional control | 3 | 4 | +1 |
| **Visual defects** (375 / 1280) | **38** (18 / 20) | **30** (15 / 15) | **−8** |
| Manual misuses (a2) | 6 | 4 | −2 |
| Validator errors / warnings on the final pages (a1) | 0 / 0 | 0 / 0 | 0 |
| `vue-tsc` strict errors | 3 | 0 | −3 |
| Pages with ≥ 1 visual defect | 9 / 10 | 9 / 10 | 0 |
| Pages with any defect or misuse | 10 / 10 | 9 / 10 | −1 |

Per page (visual defects, both widths, plus manual misuses):

| # | Page | Baseline visual | With MCP visual | Baseline manual | With MCP manual |
|---|---|---|---|---|---|
| 01 | settings | 7 | 5 | 1 | 1 |
| 02 | dashboard-shell | 5 | 2 | 1 | 0 |
| 03 | mobile-list | 2 | 4 | 0 | 0 |
| 04 | date-range-filter | 5 | 6 | 1 | 1 |
| 05 | card-grid | 7 | 4 | 0 | 0 |
| 06 | login | 4 | 2 | 2 | 2 |
| 07 | stepper-wizard | 0 | 0 | 1 | 0 |
| 08 | tabs-expansion | 4 | 2 | 0 | 0 |
| 09 | snackbar | 3 | 4 | 0 | 0 |
| 10 | detail-two-column | 1 | 1 | 0 | 0 |

With one sample per prompt, a page-level change of 1–2 can be noise (03 and 09 got worse through
different design choices, not through the MCP). The category totals are the signal.

## What the MCP prevented

| Baseline defect | Count | How it was prevented |
|---|---|---|
| 02: drawer relies on opening itself, starts closed on desktop (M8, NFC) | 2 | `app-shell` recipe: the drawer's initial state comes from `useDisplay()` |
| 02, 03: content touching the screen edge in `SAppBar` (SPC) | 4 | `app-shell` recipe (icon buttons give the bar inline spacing); 03 chose a sheet header instead of an app bar |
| 04: `block` Apply and Reset in one flex row, Reset off screen (M4, OVF, MIS) | 4 | `responsive-grid` recipe: buttons placed in `SRow`/`SColumn` |
| 05: cart badge clipped at the viewport edge, header with no top gap (OVF, SPC) | 3 | `SContainer` + `SRow` layout from the `responsive-grid` recipe |
| 06: `s_textAlign__center` on the flex `SCardTitle` (M5, MIS) | 3 | `get_component_api` / the generator centred with flex classes instead |
| 07: `SRadioGroup v-model` typed `string \| null` (M2) | 1 | Model typed from the API; the validator's `form-rules-outside-form` warning led to a proper `SForm` |
| 08: inline `max-width` leaves the content stuck to the left (MIS) | 1 | `SContainer` used as documented |
| 02, 10: `STable` item slot typed `any` (vue-tsc, not counted) | – | Typed slots in `sui-api.json` and the components |

## Top remaining failure types

Ranked by counted defects and misuses (34 = 30 visual + 4 manual). Each item is assigned its main
cause. "Fix" names the existing task that should fix it, or the follow-up task this run created.

| Rank | Root cause | Count | Pages | Category | Cause | Fix |
|---|---|---|---|---|---|---|
| 1 | **Overlay placement**: mobile `SDialog` edge-to-edge (01, 09), the mobile drawer has no scrim and covers the app bar and its toggle (02), the row `SMenu` clipped by its list (03) | 5 | 01, 02, 03, 09 | SPC, POS | lib | **M2-03 overlays** (dialog on mobile, menu flip/shift inside the viewport); drawer scrim: **M2-04 layout shell** |
| 2 | **Data-display internals**: `SCardTitle` breaks words, `SImage` shrinks in a flex card, tabs wrap at 375, expansion-panel content indent, `SListItem` content collapses next to actions | 5 | 05, 08, 09 | OVF, MIS | lib (image: AI) | **M2-05 data display**; equal-height card grid recipe: **new M1-14** |
| 3 | **Form field styling and alignment**: `SSelect` unoutlined and shadowed next to outlined inputs, textarea counter detached, action buttons above the input baseline | 4 | 01, 04 | MIS | lib default | **M2-02 form inputs** (or a default via M4-02) |
| 4 | **Theme `success` is white on `#4caf50`** (2.73:1) for chips and badges | 4 | 02, 05, 10 | CON | lib theme | **new M2-10 theme contrast** (M2-06 accessibility would only catch it on a story that uses it) |
| 5 | **Native `type="email"` inside `SForm`**: the browser bubble fights SUI validation. **Taught by the `validated-form` recipe and the `sui-form` skill** | 4 | 01, 06 | M7, OVL | docs/recipe | **new M1-14** (recipe fix + validator rule) |
| 6 | **`SDatePickerInput` with `''` model** opens on "Invalid date" and a NaN grid | 3 | 04 | M2, NFC | lib | **M2-02 form inputs** (the "empty" stress case); validator rule until then: **new M1-14** |
| 7 | **`SCheckbox` `hide-details` hides the label** | 3 | 06 | M4, NFC | lib, undocumented | **M2-02 form inputs**; validator rule: **new M1-14** |
| 8 | **Colour choice on dark/coloured surfaces**: `primary` Undo on the dark snackbar (09), white initials on light colours (03) | 4 | 03, 09 | CON | AI/docs | Snackbar action colour: **new M1-14** (recipe + rule) and **M2-03 overlays** (on-colour); avatar: **M3-01 SAvatar** (3 generators asked `get_component_api` for `SAvatar`) |
| 9 | **Page spacing**: the card flush with the top of the viewport | 2 | 04 | SPC | AI | No task: a page-padding note in a recipe is enough (folded into **new M1-14**) |

Remaining defects by M2 area:

| M2 task | Remaining defects it should fix |
|---|---|
| M2-02 form inputs | `SSelect` default look (01, 04), detached textarea counter (01), buttons vs input baseline (04), `SDatePickerInput` empty-string model (04), `SCheckbox` `hide-details` hiding the label (06) |
| M2-03 overlays | Edge-to-edge mobile dialogs (01, 09), `SMenu` clipped inside a list (03), snackbar action on-colour (09) |
| M2-04 layout shell | Mobile drawer without scrim covering the app bar and its toggle (02) |
| M2-05 data display | `SCardTitle` word-break (05), tabs wrapping at 375 (08), expansion-panel content indent (08), `SListItem` content collapsing next to actions (09) |
| M2-06 accessibility | Contrast checks in CI would catch rank 4 and 8 on stories; the theme default itself is the new M2-10 |

## Tool usage

Counted from the per-page call logs written by `mcpCall.mjs`
([`with-mcp/mcp-calls/`](with-mcp/mcp-calls/)). The generators' own reports roughly matched the logs; the logs also count reruns and failed calls
that some reports left out.

| # | Page | Calls | instructions | list_components | get_component_api | list_recipes | get_recipe | get_guide | validate | Errors | Recipes read |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | settings | 16 | 1 | 1 | 8 | 1 | 4 | 0 | 1 | 0 | validated-form, activator-overlays |
| 02 | dashboard-shell | 13 | 1 | 2 | 5 | 2 | 2 | 0 | 1 | 1 | app-shell, data-table |
| 03 | mobile-list | 24 | 1 | 2 | 16 | 2 | 1 | 0 | 2 | 0 | activator-overlays |
| 04 | date-range-filter | 18 | 1 | 1 | 10 | 1 | 4 | 0 | 1 | 3 | responsive-grid, validated-form |
| 05 | card-grid | 17 | 1 | 3 | 9 | 2 | 1 | 0 | 1 | 0 | responsive-grid |
| 06 | login | 19 | 1 | 2 | 11 | 2 | 1 | 0 | 2 | 0 | validated-form |
| 07 | stepper-wizard | 16 | 1 | 2 | 8 | 2 | 1 | 0 | 2 | 0 | validated-form |
| 08 | tabs-expansion | 21 | 1 | 1 | 17 | 1 | 0 | 0 | 1 | 2 | – |
| 09 | snackbar | 16 | 1 | 2 | 9 | 1 | 2 | 0 | 1 | 1 | activator-overlays |
| 10 | detail-two-column | 19 | 1 | 1 | 11 | 1 | 4 | 0 | 1 | 1 | responsive-grid, data-table |
| | **Total** | **179** | **10** | **17** | **104** | **15** | **20** | **0** | **13** | **8** | |

- Every generator read the server instructions first and ran `validate_sui_template` before finishing,
  as the instructions say. 3 pages ran it twice (one real fix, in 07).
- `get_component_api` misses (the "errors" column) were names guessed from other libraries:
  `SAvatar` (02, 10), `SCol` (04), `STextField` (09), `STabsWindow`/`STabsWindowItem` (08). Each
  generator switched to the real component after the miss. 04's other 2 errors were malformed CLI calls.
- Nobody called `get_guide`: the prompts assume SUI is installed, so no setup guide was needed.
- Some repeated `list_*` / `get_recipe` calls were reruns because the session's context-saving hook cut
  the first output short (see Limitations).

## Library-wide (not counted per page)

- **`SApp` has no `min-height: 100vh`** (unchanged from the baseline): on pages shorter than the
  viewport the app background stops where the content ends (04, 07, 08, 09). Follow-up: **new M2-11**.
- `SBreadcrumbs` has its own inline padding, so the crumb starts 24px inside the cards below it (10).
  Identical for any correct use; not counted.

## Excluded: suspected upstream toolchain bug

- **08: tab switching doesn't work**, exactly as in the baseline: `STabs` updates the model, but the
  sections' `v-show` never re-applies. This page's sections also have a `class`, which the baseline
  reported as a workaround, so that workaround doesn't hold. Tracked by the existing STabs
  investigation task (M2-09).

## Limitations

- Same as the baseline: one sample per prompt; the reading restriction is an instruction, not a
  sandbox (the generators' reports show reads only under `plugins/sui-plugin/` plus the CLI); the
  generator and the scorer are the same model family; the session's ambient context (user `CLAUDE.md`,
  project memory) was injected into each generator, as it was for the baseline.
- The MCP was reached through `mcpCall.mjs` over Bash, not as native MCP tools, because a running
  Claude Code session can't attach a new MCP server to its subagents. The server, its instructions and
  its tool outputs are identical; only the transport differs. A native client would show the tool
  list and descriptions up front without the `instructions` call.
- The session runs a context-saving hook that shortens large command output. Several generators had
  `list_components`, `list_recipes` or `get_recipe` output cut and re-ran the call (or saved it to a
  file). A native MCP client wouldn't truncate, so the with-MCP result may slightly understate the
  MCP's effect.
- `mcpCall.mjs` was reformatted by `eslint --fix` while the generators were running; one generator (04)
  saw a single transient "Cannot find module" error and retried. No result was lost.
- 01's validation scenario clicks the exact text `Save`, which this page labels "Save changes", so the
  submit step failed. The inline errors still render from typing, and a one-off probe confirmed that
  clicking "Save changes" is blocked by native email validation (counted as OVL, as in the baseline).
