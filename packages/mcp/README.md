# @khsura/sui-mcp

Model Context Protocol server for [`@khsura/sui`](../app). It gives AI assistants (Claude Code, Cursor, VS Code, …) version-accurate SUI component APIs, tested recipes and a template validator, so generated UI matches the framework instead of guessing.

```bash
npx -y @khsura/sui-mcp   # stdio server
```

## Tools

| Tool | What it returns |
| --- | --- |
| `list_components` | Every component with its family and a one-line purpose. |
| `get_component_api` | Props (type, default, required, allowed values), slots and events of one component as markdown. Accepts `SButton`, `s-button` or `button`. Adds the activator-pattern note (SDialog, SMenu, STooltip, SSnackbar) or the layout-child note (SAppBar, SNavigationDrawer, SMain, SFooter, SBottomNavigation). Unknown names return an error with the three closest names. |
| `list_guides` | The setup guide topics with what each covers. |
| `get_guide` | One setup guide as markdown: `installation` (Vue and Nuxt, styles, `@mdi/font`), `theming` (theme colors, dark mode), `component-defaults`, `display` (`useDisplay` breakpoints), `i18n`, `common-mistakes`. Unknown topics return an error with the topic list. |
| `validate_sui_template` | Checks a `.vue` SFC or bare template fragment against the API and the composition rules below. Returns a summary line, then `line:col [rule] message — fix: hint — recipe: name` per issue (the recipe part only when one applies). Issues are a normal result, not a tool error. |
| `list_recipes` | The tested, copy-ready recipes with when to use each. |
| `get_recipe` | One recipe: its notes, the full Vue SFC in a ```` ```vue ```` block and the link to its live Storybook story. Names: `app-shell`, `validated-form`, `activator-overlays`, `data-table`, `responsive-grid`, `theme-setup`. Unknown names return an error with the name list. |
| `ping` | Health check. |

## Template validator rules

| Rule | Severity | What it catches | Recipe |
| --- | --- | --- | --- |
| `parse-error` | error | Template syntax errors. | — |
| `unknown-component` | error | An `S*` / `s-*` tag that does not exist, with the closest names. | — |
| `unknown-prop` | error | Static attributes, `:prop` / `v-bind:prop`, and `v-model` / `v-model:prop` targets the component does not have (kebab and camel case both accepted). | — |
| `invalid-enum-value` | error | A static value, or a quoted literal binding, outside an enum prop's values. | — |
| `unknown-slot` | error | `#name` / `v-slot:name` the component does not have. | — |
| `activator-binding` | error | An `#activator` / `v-slot:activator` slot on SDialog, SMenu or SSnackbar whose root element does not bind both `v-on="on"` and `v-bind="attrs"` (also `#activator="props"` with `props.on` / `props.attrs`, renamed and `...rest` destructuring). A warning on STooltip when its activator slot takes slot props: STooltip passes none and listens on its own wrapper. | `activator-overlays` |
| `layout-for` | error | Inside an `SLayout name="x"`, an SAppBar, SNavigationDrawer, SMain, SFooter or SBottomNavigation without `for` (it joins the app-level layout instead), or a static `for` that matches no enclosing `SLayout name`. | `app-shell` |
| `form-rules-outside-form` | warning | An `S*` input with `rules` / `:rules` and no enclosing SForm: rules only run on value change, so untouched fields pass on submit. | `validated-form` |
| `icon-button-label` | warning | An SButton whose only content is an SIcon and that has no `aria-label`, `aria-labelledby` or `title`. | `app-shell` |
| `no-raw-replacement` | warning | Raw `<button>`, `<input>` (not `type="hidden"`), `<select>`, `<textarea>` or `<dialog>`, with the SUI component to use (`<input type="checkbox">` → SCheckbox, `radio` → SRadioGroup). | `validated-form`, `activator-overlays` for `<dialog>` |

Recipe names are stable (`app-shell`, `validated-form`, `activator-overlays`, `data-table`, `responsive-grid`, `theme-setup`); `get_recipe` serves the recipes under these names.

Future work: a `table-structure` rule (STable column keys and `item.<column>` slot names, per `packages/app/docs/components/table.md`) is waiting on complete STable slot data in `sui-api.json`.

## What the template validator skips

- Global and common native attributes (`class`, `style`, `id`, `key`, `ref`, `role`, `type`, `href`, …), `aria-*`, `data-*` and `on*` listeners fall through to the component's root element, so they are never unknown props. The list is in `src/constants/templateValidator.ts`.
- Event listeners (`@x`, `v-on`), `v-bind="object"`, dynamic arguments (`:[name]`, `#[name]`) and dynamic values (`:size="x"`) are not checked.
- Components whose `sui-api.json` entry lists no slots (slots that could not be extracted, such as STable's `item.<column>`) skip the slot check.
- Non-SUI tags (`RouterLink`, …) are ignored, and native elements are only checked by `no-raw-replacement`.
- `layout-for` does not require `for` when there is no enclosing SLayout in the submitted code (the layout lives in a parent file) or the enclosing SLayout has no `name` (children without `for` join the app-level layout, which is correct). A child with `app`, a bound `:for` and a bound `:name` are not compared.
- `icon-button-label` cannot see inside `v-bind="object"`, so a button with an object spread is assumed labelled.

The API rules live in `src/services/templateRules.ts` and the composition rules in `src/services/compositionRules.ts`, as `{ id, target?, check(context) }` objects over the Vue template AST, independent of MCP, so more rules (or an eslint plugin) can reuse them. A rule sees the element, its ancestors and the catalog lookup; `target: 'any-element'` runs it on native elements too.

## Where the guides come from

`get_guide` serves sections of `plugins/sui-plugin/skills/sui-getting-started/SKILL.md` and `packages/app/docs/` as they are, mapped per topic in `src/configs/guideTopics.ts`. The build copies the mapped files into `dist/guides/`; unbundled (dev, tests) the server reads them from the repo. A renamed heading or a moved file fails the tests and the build, so edit the docs, then the mapping.

## Where the recipes come from

Each recipe is a `.vue` SFC plus a `.md` notes file with front matter (`title`, `whenToUse`, `components`) in `packages/app/storybook/recipes/`. Storybook renders every recipe as a `Recipes/*` story tagged `visual` (https://sui.surakh.com/), and a test runs `validate_sui_template` over all six and expects no errors or warnings. The build copies the files into `dist/recipes/`; unbundled (dev, tests) the server reads them from the repo. To add a recipe, add both files, its name to `RECIPE_NAMES` in `src/constants/recipes.ts` and a story to `packages/app/storybook/stories/recipes.stories.ts`.

## Which SUI version answers

Every response starts with the `@khsura/sui` version and its source:

1. `project`: the nearest `node_modules/@khsura/sui/dist/sui-api.json`, found by walking up from `SUI_PROJECT_ROOT` if set, else from the working directory the client starts the server in.
2. `bundled`: the copy shipped inside `@khsura/sui-mcp` (the latest release at build time), used when no project install has the file or the project file is invalid.

Set `SUI_PROJECT_ROOT` when your client starts the server outside the project folder. Component examples: https://sui.surakh.com/

