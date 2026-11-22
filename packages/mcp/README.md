# @khsura/sui-mcp

Model Context Protocol server for [`@khsura/sui`](https://www.npmjs.com/package/@khsura/sui). It gives AI assistants (Claude Code, Cursor, VS Code, Windsurf, …) version-accurate SUI component APIs, tested recipes and a template validator, so generated UI matches the framework instead of guessing. It runs locally over stdio and needs no API key. Component docs and live examples: [sui.surakh.com](https://sui.surakh.com/).

## Quick start

From your app's folder, let the CLI detect your client and write its config:

```bash
npx -y @khsura/sui-mcp config            # detect clients and write their config
npx -y @khsura/sui-mcp config --dry-run  # print the planned changes, write nothing
```

| Option | Effect |
| --- | --- |
| `--client <id>` | Configure only `claude-code`, `cursor`, `vscode` or `windsurf`. Repeat it for several. |
| `--dry-run` | Print each file and its new contents without writing. |
| `--project <dir>` | Configure another folder instead of the current one. |

Detection looks for `.mcp.json`, `.claude/` or `CLAUDE.md` (Claude Code), `.cursor/` (Cursor), `.vscode/` (VS Code) and `.windsurf/` or `~/.codeium/windsurf/` (Windsurf). When none exists it writes Claude Code's `.mcp.json`. The CLI adds a `sui` server to the existing file and keeps every other server; an existing `sui` entry keeps its extra fields such as `env`. A file that is not valid JSON stops the command with its path, and nothing is written. Windsurf only reads a user-level file, so the CLI prints the snippet for `~/.codeium/windsurf/mcp_config.json` instead of writing outside the project.

Restart or reload the client afterwards so it starts the server.

## Client setup

To configure a client by hand, add one of these entries.

**Claude Code**: `.mcp.json` in the project root, or run `claude mcp add sui -- npx -y @khsura/sui-mcp`.

```json
{
  "mcpServers": {
    "sui": { "command": "npx", "args": ["-y", "@khsura/sui-mcp"] }
  }
}
```

**Cursor**: `.cursor/mcp.json` in the project (or `~/.cursor/mcp.json` for every project).

```json
{
  "mcpServers": {
    "sui": { "command": "npx", "args": ["-y", "@khsura/sui-mcp"] }
  }
}
```

**VS Code**: `.vscode/mcp.json`. VS Code uses `servers` and needs `"type": "stdio"`.

```json
{
  "servers": {
    "sui": { "type": "stdio", "command": "npx", "args": ["-y", "@khsura/sui-mcp"] }
  }
}
```

**Windsurf**: `~/.codeium/windsurf/mcp_config.json`.

```json
{
  "mcpServers": {
    "sui": { "command": "npx", "args": ["-y", "@khsura/sui-mcp"] }
  }
}
```

If your client starts servers outside the project folder, add `"env": { "SUI_PROJECT_ROOT": "/path/to/your/app" }` to the entry so the server finds your installed `@khsura/sui` (see [Which SUI version answers](#which-sui-version-answers)).

## What the server tells the AI

The server sends these instructions when a client connects:

- Setting up SUI: call `get_guide` with topic `installation` first.
- Before using an SUI component it has not checked, call `get_component_api`. `list_components` lists every component.
- For common patterns, start from a tested recipe (`list_recipes`, `get_recipe`).
- Always run `validate_sui_template` on every generated or changed template and fix every error before finishing.

## Tools

| Tool | What it returns |
| --- | --- |
| `list_components` | Every component with its family and a one-line purpose. |
| `get_component_api` | Props (type, default, required, allowed values), slots and events of one component as markdown. Accepts `SButton`, `s-button` or `button`. Adds the activator-pattern note (SDialog, SMenu, SSnackbar), the STooltip activator note (no slot props to bind), or the layout-child note (SAppBar, SNavigationDrawer, SMain, SFooter, SBottomNavigation). Unknown names return an error with the three closest names; a name from another UI library (`SCol`, `STextField`, `SBtn`, `SDataTable`, `STabsWindow`, `SAvatar`, …) gets its SUI equivalent and a hint first. A component that only the bundled (newer) API has returns an error saying the project needs a newer `@khsura/sui`. |
| `list_guides` | The setup guide topics with what each covers. |
| `get_guide` | One setup guide as markdown: `installation` (Vue and Nuxt, styles, `@mdi/font`), `theming` (theme colors, dark mode), `component-defaults`, `display` (`useDisplay` breakpoints), `i18n`, `common-mistakes`. Unknown topics return an error with the topic list. |
| `validate_sui_template` | Checks a `.vue` SFC or bare template fragment against the API and the composition rules below. Returns a summary line, then `line:col [rule] message — fix: hint — recipe: name` per issue (the recipe part only when one applies). Issues are a normal result, not a tool error. |
| `list_recipes` | The tested, copy-ready recipes with when to use each. |
| `get_recipe` | One recipe: its notes, the full Vue SFC in a ```` ```vue ```` block and the link to its live Storybook story. Names: `app-shell`, `validated-form`, `activator-overlays`, `data-table`, `responsive-grid`, `theme-setup`, `filter-bar`, `centered-page`, `tabbed-sections`, `dense-toolbar`. Unknown names return an error with the name list. |
| `ping` | Health check. |

## Example prompts

- "Add a settings page with a validated form (name, email, notification toggle). Use the SUI MCP and validate the template."
- "What props does STable take in the SUI version this project installs?"
- "Build an admin shell with an app bar, a navigation drawer and a footer. Start from the SUI `app-shell` recipe."
- "Set up @khsura/sui in this Nuxt app."
- "Check `src/pages/Orders.vue` with `validate_sui_template` and fix every issue."

## Template validator rules

| Rule | Severity | What it catches | Recipe |
| --- | --- | --- | --- |
| `parse-error` | error | Template syntax errors. | — |
| `unknown-component` | error | An `S*` / `s-*` tag that does not exist, with the closest names. A name from another UI library gets its SUI equivalent first (the alias map in `src/constants/componentAliases.ts`); an alias stops applying once that name is a real component in `sui-api.json`. | — |
| `unknown-prop` | error | Static attributes, `:prop` / `v-bind:prop`, and `v-model` / `v-model:prop` targets the component does not have (kebab and camel case both accepted). | — |
| `invalid-enum-value` | error | A static value, or a quoted literal binding, outside an enum prop's values. | — |
| `unknown-slot` | error | `#name` / `v-slot:name` the component does not have. | — |
| `activator-binding` | error | An `#activator` / `v-slot:activator` slot on SDialog, SMenu or SSnackbar whose root element does not bind both `v-on="on"` and `v-bind="attrs"` (also `#activator="props"` with `props.on` / `props.attrs`, renamed and `...rest` destructuring). A warning on STooltip when its activator slot takes slot props: STooltip passes none and listens on its own wrapper. | `activator-overlays` |
| `layout-for` | error | Inside an `SLayout name="x"`, an SAppBar, SNavigationDrawer, SMain, SFooter or SBottomNavigation without `for` (it joins the app-level layout instead), or a static `for` that matches no enclosing `SLayout name`. | `app-shell` |
| `form-rules-outside-form` | warning | An `S*` input with `rules` / `:rules` and no enclosing SForm: rules only run on value change, so untouched fields pass on submit. | `validated-form` |
| `icon-button-label` | warning | An SButton whose only content is an SIcon and that has no `aria-label`, `aria-labelledby` or `title`. | `app-shell` |
| `no-raw-replacement` | warning | Raw `<button>`, `<input>` (not `type="hidden"`), `<select>`, `<textarea>` or `<dialog>`, with the SUI component to use (`<input type="checkbox">` → SCheckbox, `radio` → SRadioGroup). | `validated-form`, `activator-overlays` for `<dialog>` |
| `native-validation-in-form` | warning | `type="email"`, `url` or `number` on an `S*` input inside an SForm without `novalidate`: the browser validates on submit and its bubble covers SUI's error text. The fix hint suggests `type="text" inputmode="email"` (or `novalidate` for numbers). Only before 1.20.0 (`fixedIn`). | `validated-form` |
| `hide-details-hides-label` | warning | `hide-details` on an SCheckbox that has a `label`: it hides the label too, so the checkbox shows no text. Use `hide-error`. Only before 1.20.0 (`fixedIn`). | `validated-form` |
| `hidden-label-no-visible-name` | warning | `hide-details` on a text field (SInput, SSelect, STextarea, SAutocomplete, SDatePickerInput) hides its `label` by design (it becomes the `aria-label`); warns when no placeholder, or one sharing no word with the label, says on screen what the field is for. | `filter-bar` |
| `snackbar-action-contrast` | warning | A `variant="text"` or `variant="icon"` SButton in an SSnackbar `#action` slot with a hex CSS `color` below 4.5:1 on the dark `#424242` snackbar (a CSS colour is used as is). Before 1.20.0 it also reports a `variant="text"` action with `color="primary"` (or `secondary`, `success`, `info`, `error`) and a text or icon action with no `color`, which kept the page's dark text colour there; from 1.20.0 an action without `color` takes the snackbar text colour and preset colours use a variant tuned to the snackbar. | `activator-overlays` |
| `block-buttons-in-row` | warning | Two or more `block` SButtons as siblings in a flex row (`s_display__flex` / `s_display--*__flex`, an inline `display: flex`, or SCardActions): `block` does not shrink, so later buttons are pushed off screen. | `responsive-grid` |
| `field-button-row` | warning | A text field (`SInput`, `SSelect`, `SDatePickerInput`, `SAutocomplete`, `STextarea`) without `hide-details` and an `SButton` as siblings in a flex row: the button lines up with the field's label, not its box. Use `SFormRow` (1.20.0+); recipe `filter-bar`. |
| `card-title-text-align` | warning | An `s_textAlign__*` class on SCardTitle, which is a flex container, so the class has no effect. The fix hint names the matching `s_justify__*` class. Only before 1.20.0 (`fixedIn`). | — |
| `date-picker-empty-string` | warning | An SDatePickerInput whose `v-model` / `:model-value` is `''`, or whose model starts as `''` in the SFC script (`x = ref('')`, `{ x: '' }`): the picker opens on "Invalid date". Start it as `null`. Only before 1.20.0 (`fixedIn`). | `validated-form` |
| `fill-height-under-app` | warning | `s_height--fill` on a direct child of `SApp`: before 1.20.0 it resolves to the content height (SApp only has a min-height), so a card centred inside it sticks to the top. Points to the `centered-page` recipe. Skipped from `@khsura/sui` 1.20.0, where that child grows to fill SApp. |
| `pagination-length-rows` | warning | `SPagination`'s `:length` bound to a row count (`items.length`, `totalItems`, `itemsCount`, …) with no division: `length` is the number of pages, so it would show one page per row. |
| `pagination-zero-based` | warning | `SPagination`'s `v-model` bound to a name ending in `index` (such as STable's `pageIndex`): SPagination's page starts at 1. |
| `skeleton-loader-unknown-preset` | error | A static `SSkeletonLoader` `type` with a preset SUI does not have (Vuetify's `paragraph`, `sentences`, `list-item-two-line`, …, or `text*3` instead of `text@3`): the part is ignored. The hint names the SUI preset to use. |
| `skeleton-loader-never-hides` | warning | `SSkeletonLoader` with a bound `:loading` but no content inside: with nothing to swap in, the skeleton stays on screen after loading ends. |
| `tabs-in-slide-group` | warning | `STabs` with an `SSlideGroup` ancestor: STabs already scrolls its own row, with an edge fade (or `wrap` for several rows), so the wrapper only adds a second scroller. | `tabbed-sections` |
| `row-inset-from-text` | warning | An `SRow` beside a native heading or paragraph (or `SBreadcrumbs`), directly or through an `SForm` / `<form>`, without `no-outer-gutters` + `gap` (or `no-gutters`): the row and its columns pad by 8px each, so the grid starts 16px inside the text. Siblings with their own horizontal padding / margin class are skipped. | `responsive-grid` |

Rules for behaviours that a component fix removed carry a `fixedIn` version: the engine skips them when the resolved `sui-api.json` version is that version or newer, so a project on an older `@khsura/sui` still gets the warning. A `version` that is not semver keeps every rule on.

Recipe names are stable (`app-shell`, `validated-form`, `activator-overlays`, `data-table`, `responsive-grid`, `theme-setup`, `filter-bar`, `centered-page`, `tabbed-sections`, `dense-toolbar`); `get_recipe` serves the recipes under these names.

Future work: a `table-structure` rule (STable column keys and `item.<column>` slot names, per `packages/app/docs/components/table.md`) is waiting on complete STable slot data in `sui-api.json`.

## What the template validator skips

- Global and common native attributes (`class`, `style`, `id`, `key`, `ref`, `role`, `type`, `href`, …), `aria-*`, `data-*` and `on*` listeners fall through to the component's root element, so they are never unknown props. The list is in `src/constants/templateValidator.ts`.
- Event listeners (`@x`, `v-on`), `v-bind="object"`, dynamic arguments (`:[name]`, `#[name]`) and dynamic values (`:size="x"`) are not checked.
- Components whose `sui-api.json` entry lists no slots (slots that could not be extracted, such as STable's `item.<column>`) skip the slot check.
- Non-SUI tags (`RouterLink`, …) are ignored, and native elements are only checked by `no-raw-replacement` and (as the parent of a button row) `block-buttons-in-row`.
- `layout-for` does not require `for` when there is no enclosing SLayout in the submitted code (the layout lives in a parent file) or the enclosing SLayout has no `name` (children without `for` join the app-level layout, which is correct). A child with `app`, a bound `:for` and a bound `:name` are not compared.
- `icon-button-label` cannot see inside `v-bind="object"`, so a button with an object spread is assumed labelled.
- The behaviour rules only read static values: a bound `:type`, `:color` or `:class` object, and a flex row made by a scoped CSS class, are not checked. `date-picker-empty-string` finds the model's initial value by its last path segment (`form.from` → `from: ''`) in the submitted SFC's script; models initialised elsewhere (a store, a prop) are not checked.

The API rules live in `src/services/templateRules.ts` and the composition rules in `src/services/compositionRules.ts`, the behaviour rules in `src/services/behaviourRules.ts`, as `{ id, target?, check(context) }` objects over the Vue template AST, independent of MCP, so more rules (or an eslint plugin) can reuse them. A rule sees the element, its ancestors, the catalog lookup and the SFC's script source; `target: 'any-element'` runs it on native elements too.

## Where the guides come from

`get_guide` serves sections of `plugins/sui-plugin/skills/sui-getting-started/SKILL.md` and `packages/app/docs/` as they are, mapped per topic in `src/configs/guideTopics.ts`. The build copies the mapped files into `dist/guides/`; unbundled (dev, tests) the server reads them from the repo. A renamed heading or a moved file fails the tests and the build, so edit the docs, then the mapping.

## Where the recipes come from

Each recipe is a `.vue` SFC plus a `.md` notes file with front matter (`title`, `whenToUse`, `components`) in `packages/app/storybook/recipes/`. Storybook renders every recipe as a `Recipes/*` story tagged `visual` (https://sui.surakh.com/), and a test runs `validate_sui_template` over all six and expects no errors or warnings. The build copies the files into `dist/recipes/`; unbundled (dev, tests) the server reads them from the repo. To add a recipe, add both files, its name to `RECIPE_NAMES` in `src/constants/recipes.ts` and a story to `packages/app/storybook/stories/recipes.stories.ts`.

## Which SUI version answers

Every response starts with the `@khsura/sui` version and its source:

1. `project`: the nearest `node_modules/@khsura/sui/dist/sui-api.json`, found by walking up from `SUI_PROJECT_ROOT` if set, else from the working directory the client starts the server in.
2. `bundled`: the copy shipped inside `@khsura/sui-mcp` (the latest release at build time), used when no project install has the file or the project file is invalid.

Set `SUI_PROJECT_ROOT` when your client starts the server outside the project folder. Component examples: https://sui.surakh.com/

