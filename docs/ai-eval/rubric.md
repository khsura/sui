# AI eval scoring rubric

Every generated page is scored on two axes: **(a) API misuse** and **(b) visual defects** at
375px and 1280px. Score strictly and the same way every run. When in doubt, read the definition
below literally. Don't use judgement calls that a later scorer can't repeat.

## (a) API misuse

### a1. Validator errors and warnings (automatic)

Run the built `@khsura/sui-mcp` validator (`validate_sui_template`) on the SFC through
`tools/validatePages.mjs`. Record its summary line's `errors` and `warnings` counts unchanged. Don't
filter or reinterpret them.

### a2. Manual misuse (checklist)

Count each **occurrence pattern once per page** (the same mistake on 3 sibling elements counts as
1). Count it only if the code is wrong against the library's **actual behaviour**, whether or not the
docs warn about it. Write the cause in the notes (`AI`, `docs`, or `lib`).

| Id | Misuse | Example |
|---|---|---|
| M1 | Invented prop or attribute that the validator can't see (dynamic `v-bind` object, prop on a non-`S*` element, prop through a wrapper) | `<div elevation="2">`, `v-bind="{ dense: true }"` on a component without `dense` |
| M2 | Wrong `v-model` shape or value type (also any vue-tsc type error on a `v-model` / prop binding) | `SRadioGroup v-model` with `string \| null`, `SExpansionPanels v-model` as a number |
| M3 | Wrong component-instance API use | treating `SForm.validate()`'s return value as "is valid" |
| M4 | A prop combination that the library renders broken | `block` on two buttons in one flex row, `hide-details` on `SCheckbox` (it hides the label) |
| M5 | Utility class that doesn't exist, or has no effect on the element it's on | `s_textAlign__center` on the flex `SCardTitle` |
| M6 | Missing or duplicated required wrapper | no `SApp`, layout children outside `SLayout`, nested `SApp` |
| M7 | Native attribute or element that fights SUI behaviour | `type="email"` inside `SForm`, which fires the browser's own validation bubble on top of SUI rules |
| M8 | Import of something `@khsura/sui` doesn't export, or behaviour that relies on an undocumented default | relying on `SNavigationDrawer` opening itself on mount |

Supporting automatic checks (recorded, not added to the misuse total):

- `vue-tsc` in strict mode over all pages (`npm run typecheck` in the harness). Record each error.
  A type error that is an M2 (wrong model/prop type) also counts as M2. A typing gap in the library
  (e.g. a slot scope typed `any`) is recorded but not counted.
- A check that every `s_*` class used exists in `dist/base.css` or `dist/s-ui.css` (M5).

## (b) Visual defects

Score the committed viewport screenshots (`base` plus every scenario in
`tools/harness/scenarios.mjs`) at **375×812** and **1280×800**. For content below the fold, also
score the full-page capture of the `base` state, which the harness writes to `fullpage/` and which
isn't committed. Count each defect **once per page per width**, however many scenarios or
elements show it. The same defect at both widths counts twice (once per width).

| Category | Code | Counts when … | Doesn't count |
|---|---|---|---|
| Overflow | OVF | content is clipped or cut **with no scroll affordance**, pushes the page wider than the viewport (`scrollWidth > width`, flagged in `console.json`), or text breaks mid-word because its box is too small | a table or region that scrolls inside its own container (`overflow: auto`) |
| Overlap | OVL | two pieces of content paint over each other so that either one is hard to read, including a native browser bubble covering SUI error text | an overlay (dialog, menu, snackbar, tooltip) intentionally over the page |
| Misalignment | MIS | siblings that should line up don't (baseline/edge off by ≥ 4px), controls in one form have inconsistent width or style (e.g. one field unoutlined), text alignment differs from what the code asked for, an element sits visibly detached from the element it belongs to, or a centred layout is stuck to one side | deliberate asymmetric design |
| Broken overlay / positioning | POS | an overlay opens in the wrong place, has no scrim where the pattern needs one, covers its own trigger or the app bar so it can't be dismissed the normal way, or doesn't open | — |
| Unreadable contrast | CON | text with contrast below **3:1** against its effective background (measured by `tools/harness/contrast.mjs`, or computed from styles) | decorative icons (sort arrows), disabled controls |
| Missing spacing | SPC | content flush against the viewport or container edge (< 4px), e.g. an app bar title at x = 0 or a dialog edge-to-edge on a phone, or two blocks touching with no gap | — |
| Non-functional control | NFC | a control or requested behaviour doesn't work or can't be understood: a missing label, a state that doesn't apply (a drawer that should be open by default), a click that doesn't do what was asked | behaviour the scenario can't exercise (record that as "not exercised" in the notes) |

### What is excluded from the per-page counts

- **Library-wide defects that no page code can cause or avoid**, e.g. a component's default that
  shows up identically for any correct usage, are listed once in the results file's "Library-wide"
  section and not counted per page. Defects that depend on how the page uses a component (even if
  a library default makes them likely) **are** counted per page, with `cause: lib` in the notes.
- **Upstream toolchain bugs** (Vue, Vite, the browser) that make correct code misbehave. Note them
  and exclude them.

## Totals

- Per page: `a1 errors`, `a1 warnings`, `a2 manual`, and visual defects per category per width.
- Run totals: sums of each column, **pages with ≥ 1 visual defect** (out of 10), and **pages with
  any defect or misuse**.
- "Top failure types": group every counted defect and misuse by root cause, and rank by count.
