# After M2, 2026-11: AI-generated SUI pages with the MCP server and the hardened components

| | |
|---|---|
| Date | 2026-11-22 |
| Condition | `hardened`: sui-plugin skills **plus** the `@khsura/sui-mcp` server, against the `feature/m2-hardening` code (see `README.md` §1 and §2). The condition matches after-M1 (`with-mcp`), so any difference comes from the M2 hardening |
| Generator | Claude Code subagents (general-purpose, model Claude Opus 5.5), one fresh agent per prompt, at most 3 running at a time. Same model, client, prompts and wrapper as after-M1 |
| MCP access | `tools/mcpCall.mjs`, as in after-M1. Every call is logged in [`after-m2/mcp-calls/`](after-m2/mcp-calls/) |
| Library | `@khsura/sui` built locally from `feature/m2-hardening`. Its `package.json` still says **1.18.3**, see Limitations |
| MCP server / validator | `@khsura/sui-mcp` 0.1.0, built locally (`SUI_PROJECT_ROOT` = `packages/app`) |
| Render | The same harness, scenarios and widths: Vite 8.1.3, Vue 3.5.46, Chromium (Playwright 1.61.1), 375×812 and 1280×800. One change: `sass` was added, see Limitations |
| Pages / screenshots | [`after-m2/pages/`](after-m2/pages/) / [`after-m2/screenshots/`](after-m2/screenshots/) (+ [`after-m2/probes/`](after-m2/probes/)) |

## Headline

- **Target met.** Counted defects (visual defects + manual API misuses) fell from **44 in the baseline**
  to **14**, a **68% drop**. The design target was at least 50%, which means 22 or fewer. After-M1 had 34.
- **Visual defects: 38 → 30 → 12** (baseline → after-M1 → after-M2), 6 at 375px and 6 at 1280px.
  **Manual misuses: 6 → 4 → 2.** The validator reports 0 errors and 0 warnings on every final page. `vue-tsc` strict
  reports 1 error (after-M1: 0).
- **Pages with at least one visual defect: 9 → 9 → 6 of 10.** 01, 02, 07 and 10 are clean. 07 has one typing misuse,
  so **7 of 10** pages have any defect or misuse (baseline 10, after-M1 9).
- **What M2 removed:** every after-M1 component-level defect is gone or changed form (the tabs that wrapped at 375 are now
  clipped instead). That covers the unoutlined `SSelect`, the detached
  textarea counter, buttons off the input baseline, edge-to-edge mobile dialogs, the menu clipped by its list, the
  drawer without a scrim, the `success` contrast (4 cases), `SCardTitle` breaking mid-word, `SListItem` collapsing, the
  `SDatePickerInput` "Invalid date" grid, `SCheckbox` `hide-details` hiding its label, and the native `type="email"`
  bubble (the recipe and form `novalidate`).
- **What remains is mostly M2's own side effects.** Three of the seven remaining failure types (6 of the 14 counts) are
  **regressions introduced by M2**: new advice, or new defaults, that a generator followed exactly:
  - The STabs workaround the docs recommend (`SWindow`) renders at 0 height.
  - The snackbar action colour the recipe recommends (`warning`) is now 1.85:1.
  - `SApp` now fills the viewport, and the docs forbid a `min-height` wrapper, but nothing tells the child how to
    fill it, so the login card can't be centred.

## Results

Visual defect codes: OVF overflow · OVL overlap · MIS misalignment · POS broken overlay/positioning ·
CON unreadable contrast · SPC missing spacing · NFC non-functional control (definitions:
[`rubric.md`](rubric.md)). Cells read `375 / 1280`. A `–` means 0 at both widths.

| # | Page | Val. err | Val. warn | Manual | OVF | OVL | MIS | POS | CON | SPC | NFC | Visual 375 | Visual 1280 | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | settings | 0 | 0 | 0 | – | – | – | – | – | – | – | 0 | 0 | Clean. `SSelect` is outlined like the inputs, and the counter sits under the textarea. The form gets `novalidate`, so there's no native bubble. Both fixed scenarios miss the page's labels (the button says `Save changes`, and the first exact `Delete account` text is the card title), so a probe clicked the real buttons ([`probes/`](after-m2/probes/)): inline errors render, and the dialog has a 12px margin at 375 |
| 02 | dashboard-shell | 0 | 0 | 0 | – | – | – | – | – | – | – | 0 | 0 | Clean. The mobile drawer now has a scrim (it still covers the app bar, which is the normal modal-drawer pattern, dismissed by the scrim). The status chips are readable. The hand-built avatar has a translucent white circle meant for a coloured bar, so on the white bar only the initials show (AI, no `SAvatar`; not counted, the initials are readable) |
| 03 | mobile-list | 0 | 0 | 1 | – | – | – | – | – | – | 1 / 1 | 1 | 1 | M4 `label="Search by name"` together with `hide-details`: the label is hidden, so the field shows only the placeholder "e.g. Anna" and nothing says it searches (lib/docs: the pre-1.20 `filter-bar` advice; the validator doesn't flag it). The row menu now opens fully inside the viewport, and the avatars are readable |
| 04 | date-range-filter | 0 | 0 | 0 | – | – | – | – | – | – | 1 / 1 | 1 | 1 | Following the pre-1.20 `filter-bar` advice (`hide-details`, no label), the status select shows only "All" with no label (AI/docs). The date fields have "From/To date" placeholders. The picker opens on a valid month (the after-M1 NaN grid is gone), the select is outlined, and the buttons line up with the fields. The to/from error wasn't exercised |
| 05 | card-grid | 0 | 0 | 0 | – | – | 0 / 1 | – | – | – | – | 0 | 1 | At 1280, "Wireless headphones" wraps to 2 lines (cleanly, no mid-word break now), so that card's chips and button sit 36px lower than its row neighbours. The cards are equal height, but their content isn't pinned (AI: no equal-height card pattern). Badges are readable, and the cart badge isn't clipped |
| 06 | login | 0 | 0 | 0 | – | – | 1 / 1 | – | – | – | – | 1 | 1 | The card is centred horizontally but **stuck to the top**: `s_height--fill` on `SApp`'s child resolves to `auto`, and the layout skill says not to add a `min-height` wrapper (lib/docs, **M2 regression**). "Remember me" now shows its label. Validation and loading work |
| 07 | stepper-wizard | 0 | 0 | 1 | – | – | – | – | – | – | – | 0 | 0 | M2 `SRadioGroup v-model` typed `string \| null` (`vue-tsc` error, AI; it works at runtime). It looks clean at every step |
| 08 | tabs-expansion | 0 | 0 | 0 | 1 / 0 | – | – | – | – | – | 1 / 1 | 2 | 1 | **No FAQ is visible:** the page follows the getting-started advice to render tab panels with `SWindow`/`SWindowItem`, which collapse to 0px height when no height is set (lib/docs, **M2 regression**). At 375 the tabs no longer wrap, but "ACCOUNT" is cut off with no scroll affordance (lib). The `panel` scenario failed because no question is visible |
| 09 | snackbar | 0 | 0 | 0 | – | – | – | – | 1 / 1 | – | – | 1 | 1 | Undo uses `color="warning"`, as the recipe advises, but warning text is now `rgb(112,106,82)`: 1.85:1 on the snackbar (lib/docs, **M2 regression**). The table scrolls inside its wrapper at 375 (not counted). The rename dialog has margins at 375. Delete, Undo, rename and the 4 s timeout work |
| 10 | detail-two-column | 0 | 0 | 0 | – | – | – | – | – | – | – | 0 | 0 | Clean. Stacking, chips and the table are correct. The breadcrumb uses `to` without a router: SUI warns and renders a plain link that works (recorded, not counted). The breadcrumb vs card inset is library-wide, see below |
| | **Total** | **0** | **0** | **2** | **1** | **0** | **3** | **0** | **2** | **0** | **6** | **6** | **6** | |

- Pages with ≥ 1 visual defect: **6 / 10** (01, 02, 07 and 10 are clean).
- Pages with any visual defect or manual misuse: **7 / 10**.
- `vue-tsc` strict: **1 error**, 07's radio model ([`after-m2/vue-tsc.txt`](after-m2/vue-tsc.txt)).
- Validator on the final pages: 0 errors, 0 warnings ([`after-m2/validator.txt`](after-m2/validator.txt)).
  During generation it reported 2 `form-rules-outside-form` warnings (07, 09). Both generators fixed them.
- Contrast scan ([`after-m2/contrast.txt`](after-m2/contrast.txt)): only 09's Undo (1.85:1), plus decorative sort
  arrows (excluded).
- Runtime ([`after-m2/console.json`](after-m2/console.json)): no errors. 10 logs SUI's "no vue-router" warning. Scenario
  steps failed on 01 (fixed `Save` text, so a probe was used) and 08 (`panel`, nothing to click).

## Baseline vs after M1 vs after M2

| Measure | Baseline | After M1 (MCP) | After M2 (MCP + hardening) | M2 vs M1 | M2 vs baseline |
|---|---|---|---|---|---|
| OVF overflow | 4 | 2 | 1 | −1 | −3 |
| OVL overlap | 2 | 2 | 0 | −2 | −2 |
| MIS misalignment | 14 | 7 | 3 | −4 | −11 |
| POS broken overlay / positioning | 1 | 3 | 0 | −3 | −1 |
| CON unreadable contrast | 6 | 8 | 2 | −6 | −4 |
| SPC missing spacing | 8 | 4 | 0 | −4 | −8 |
| NFC non-functional control | 3 | 4 | 6 | +2 | +3 |
| **Visual defects** (375 / 1280) | **38** (18 / 20) | **30** (15 / 15) | **12** (6 / 6) | **−18** | **−26** |
| Manual misuses (a2) | 6 | 4 | 2 | −2 | −4 |
| **API misuse + visual (target metric)** | **44** | **34** (−23%) | **14 (−68%)** | −20 | **−30** |
| Validator errors / warnings on the final pages (a1) | 0 / 0 | 0 / 0 | 0 / 0 | 0 | 0 |
| `vue-tsc` strict errors | 3 | 0 | 1 | +1 | −2 |
| Pages with ≥ 1 visual defect | 9 / 10 | 9 / 10 | 6 / 10 | −3 | −3 |
| Pages with any defect or misuse | 10 / 10 | 9 / 10 | 7 / 10 | −2 | −3 |

**Target (design: at least 50% fewer API-misuse + visual defects than the baseline's 44): met.** The count is 14, which
is −68%, against a limit of 22.

NFC went up because two M2 regressions (08's empty tabs, the hidden labels in 03 and 04) remove content outright. Every
other category fell.

Per page (visual defects, both widths, plus manual misuses):

| # | Page | Baseline visual | M1 visual | M2 visual | Baseline manual | M1 manual | M2 manual |
|---|---|---|---|---|---|---|---|
| 01 | settings | 7 | 5 | 0 | 1 | 1 | 0 |
| 02 | dashboard-shell | 5 | 2 | 0 | 1 | 0 | 0 |
| 03 | mobile-list | 2 | 4 | 2 | 0 | 0 | 1 |
| 04 | date-range-filter | 5 | 6 | 2 | 1 | 1 | 0 |
| 05 | card-grid | 7 | 4 | 1 | 0 | 0 | 0 |
| 06 | login | 4 | 2 | 2 | 2 | 2 | 0 |
| 07 | stepper-wizard | 0 | 0 | 0 | 1 | 0 | 1 |
| 08 | tabs-expansion | 4 | 2 | 3 | 0 | 0 | 0 |
| 09 | snackbar | 3 | 4 | 2 | 0 | 0 | 0 |
| 10 | detail-two-column | 1 | 1 | 0 | 0 | 0 | 0 |

There is one sample per prompt, so a change of 1–2 on a single page can be noise. The category totals carry the signal.

## What M2 fixed (after-M1 defects that are gone)

| After-M1 defect | Count in M1 | Fixed by |
|---|---|---|
| Mobile `SDialog` edge-to-edge (01, 09) | 2 | M2-03 overlays |
| Row `SMenu` clipped by its list (03) | 2 | M2-03 / M2-14 viewport-aware placement |
| Mobile drawer without scrim over the app bar (02) | 1 | M2-04 layout shell |
| Theme `success` white text, 2.73:1 (02, 05, 10) | 4 | M2-10 theme contrast |
| `SSelect` unoutlined, counter detached, buttons off the baseline (01, 04) | 4 | M2-02 form inputs, M2-22 |
| `SCardTitle` mid-word break, `SListItem` collapse, panel indent, tabs wrapping (05, 08, 09) | 5 | M2-05 data display |
| `SDatePickerInput` `''` model → "Invalid date"/NaN grid (04) | 3 | M2-02 form inputs |
| `SCheckbox` `hide-details` hides the label (06) | 3 | M2-02 form inputs |
| `type="email"` in `SForm` → native bubble (01, 06) | 4 | M1-14 recipe fix (+ `novalidate`) |
| Snackbar `primary` action 2.18:1, white initials on light colours (03, 09) | 4 | M1-14 recipe advice (but see regression 2 below) |
| Card flush with the viewport top (04) | 2 | M1-14 page-padding note |

## Remaining failure types: component-level vs AI misuse

Ranked by counted defects and misuses (14 = 12 visual + 2 manual). "Fix" names an existing task, or one this run
filed.

| Rank | Root cause | Count | Pages | Category | Level | Fix |
|---|---|---|---|---|---|---|
| 1 | **Labels hidden by `hide-details`.** The pre-1.20 `filter-bar` advice says "`hide-details` + placeholder"; 03 also passed `label`, which `hide-details` silently drops | 5 | 03, 04 | NFC, M4 | Component (text fields drop `label`, unlike the M2 `SCheckbox`) + docs. Inflated by the version artifact (Limitations) | **new [M3-10]** |
| 2 | **`SWindow` collapses to 0 height**, and the getting-started skill recommends it for STabs panels | 2 | 08 | NFC | Component + docs, **M2 regression** | **new [M2-24]** |
| 3 | **Snackbar `warning` action is 1.85:1.** The recipe recommends `warning`; M2's status-colour work darkened warning text | 2 | 09 | CON | Component theme + recipe, **M2 regression** | **new [M2-25]** |
| 4 | **Content can't be vertically centred in `SApp`.** `s_height--fill` resolves to `auto`; the skill forbids a `min-height` wrapper | 2 | 06 | MIS | Component default + docs, **M2 regression** | **new [M2-26]** |
| 5 | **Tabs clipped at 375 with no scroll affordance** (the after-M1 wrap became a clip) | 1 | 08 | OVF | Component | **new [M3-11]** |
| 6 | **Card content not aligned across a grid row** (a 2-line title pushes the button down) | 1 | 05 | MIS | AI misuse (no equal-height card pattern used) | Existing: the M1-14 recipe work. Not refiled; recurs only with a 2-line title |
| 7 | **`SRadioGroup v-model` typed `string \| null`** | 1 | 07 | M2 (`vue-tsc`) | AI misuse (the API types say `GroupItemValue \| undefined`) | Not filed: the same misuse as the baseline, M1's generator avoided it, and `vue-tsc` catches it in a real project |

Summary: **12 of 14** remaining counts are component-level or docs-level (ranks 1–5), and 6 of those are M2
regressions (ranks 2–4). Rank 1 also depends on the version artifact. **2 of 14** are AI misuse (ranks 6–7).

## Tool usage

Counted from the per-page call logs ([`after-m2/mcp-calls/`](after-m2/mcp-calls/)).

| # | Page | Calls | instructions | list_components | get_component_api | list_recipes | get_recipe | get_guide | validate | Errors | Recipes read |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | settings | 15 | 1 | 2 | 7 | 1 | 3 | 0 | 1 | 0 | validated-form, activator-overlays |
| 02 | dashboard-shell | 14 | 1 | 2 | 6 | 2 | 2 | 0 | 1 | 2 | app-shell, data-table |
| 03 | mobile-list | 19 | 1 | 2 | 12 | 1 | 2 | 0 | 1 | 0 | activator-overlays, filter-bar |
| 04 | date-range-filter | 16 | 1 | 2 | 8 | 2 | 2 | 0 | 1 | 0 | filter-bar, responsive-grid |
| 05 | card-grid | 16 | 1 | 1 | 11 | 1 | 1 | 0 | 1 | 0 | responsive-grid |
| 06 | login | 14 | 1 | 2 | 7 | 1 | 2 | 0 | 1 | 0 | validated-form |
| 07 | stepper-wizard | 12 | 1 | 1 | 6 | 1 | 1 | 0 | 2 | 0 | validated-form |
| 08 | tabs-expansion | 15 | 1 | 2 | 9 | 2 | 0 | 0 | 1 | 0 | – |
| 09 | snackbar | 24 | 1 | 1 | 15 | 2 | 3 | 0 | 2 | 1 | activator-overlays, data-table, validated-form |
| 10 | detail-two-column | 14 | 1 | 2 | 6 | 1 | 2 | 0 | 2 | 0 | responsive-grid, data-table |
| | **Total** | **159** | **10** | **17** | **87** | **14** | **18** | **0** | **13** | **3** | |

- Every generator read the instructions first and validated before finishing (3 validated twice; 2 made real fixes).
- There were 3 lookup misses, down from 8 in after-M1: `SAvatar` twice (02) and `STextField` (09). The M2-12 alias
  mapping pointed `STextField` to `SInput`. `SAvatar` still doesn't exist (M3-01).
- The new `filter-bar` recipe was read by 03 and 04. Its pre-1.20 branch is behind rank 1.
- As before, the session's context-saving hook cut some `list_*` / `get_recipe` output short, and a few calls are
  reruns.

## Library-wide (not counted per page)

- **`SRow` outer padding** insets every grid from the content around it: the fields start 8px inside the card heading
  (04), and the cards start 16px inside the breadcrumb (10). This is the same for any usage without
  `no-outer-gutters`, which no recipe uses. It was present but unrecorded in after-M1, where the breadcrumb's own
  padding hid it on 10. Follow-up: **new [M3-12]**.
- `SApp` now fills the viewport (M2-11): the after-M1 library-wide finding is fixed.

## Limitations

- **Version artifact.** The milestone branch's `packages/app/package.json` still says `1.18.3`, while `main` has
  released 1.19.0. Because of the version gating (M2-13), the MCP tells generators that `SFormRow` and the automatic
  form `novalidate` only exist "since 1.20.0". So 03 and 04 took the pre-1.20 `hide-details` path, and 01, 06 and 09
  added `novalidate` by hand, against a build that actually has the 1.20 behaviour. Rank 1 would probably shrink on a
  run against the released 1.20.0. Counts were left as scored ("don't fix anything by hand"). The next eval should run
  on a build whose version matches its features (for example, after the 1.20.0 release).
- **Harness change:** 10 uses `@use '@khsura/sui/helpers.scss'`, a documented package export. The harness had no
  `sass` and no alias for it, so Vite couldn't load the page. `sass` 1.101.0 (the repo's version) and a
  `@khsura/sui/helpers.scss` alias were added to `tools/harness/`. No page was changed.
- **Probes:** 01's fixed scenarios click exact texts (`Save`, `Delete account`) that this page uses for a different
  element or not at all. A one-off Playwright probe clicked the actual buttons by role and name. Its screenshots are in
  [`after-m2/probes/`](after-m2/probes/) and are scored for 01. 08's `panel` scenario couldn't run because nothing was
  visible, and that is what was scored.
- Same as before: one sample per prompt; the reading restriction is an instruction, not a sandbox (the generators'
  reports show reads only under `plugins/sui-plugin/` plus the CLI); the generator and the scorer are the same model
  family; the MCP was reached over Bash through `mcpCall.mjs`.
