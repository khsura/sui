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
| `validate_sui_template` | Checks a `.vue` SFC or bare template fragment against the API: `unknown-component` (an `S*` / `s-*` tag that does not exist, with the closest names), `unknown-prop` (static attributes, `:prop` / `v-bind:prop`, and `v-model` / `v-model:prop` targets; kebab and camel case both accepted), `invalid-enum-value` (a static value, or a quoted literal binding, outside an enum prop's values), `unknown-slot` (`#name` / `v-slot:name`), and `parse-error`. Returns a summary line, then `line:col [rule] message — fix: hint` per issue. Issues are a normal result, not a tool error. |
| `ping` | Health check. |

## What the template validator skips

- Global and common native attributes (`class`, `style`, `id`, `key`, `ref`, `role`, `type`, `href`, …), `aria-*`, `data-*` and `on*` listeners fall through to the component's root element, so they are never unknown props. The list is in `src/constants/templateValidator.ts`.
- Event listeners (`@x`, `v-on`), `v-bind="object"`, dynamic arguments (`:[name]`, `#[name]`) and dynamic values (`:size="x"`) are not checked.
- Components whose `sui-api.json` entry lists no slots (slots that could not be extracted, such as STable's `item.<column>`) skip the slot check.
- Non-SUI tags (native elements, `RouterLink`, …) are ignored.

The rules live in `src/services/templateRules.ts` as `{ id, check(context) }` objects over the Vue template AST, independent of MCP, so more rules (or an eslint plugin) can reuse them.

## Where the guides come from

`get_guide` serves sections of `plugins/sui-plugin/skills/sui-getting-started/SKILL.md` and `packages/app/docs/` as they are, mapped per topic in `src/configs/guideTopics.ts`. The build copies the mapped files into `dist/guides/`; unbundled (dev, tests) the server reads them from the repo. A renamed heading or a moved file fails the tests and the build, so edit the docs, then the mapping.

## Which SUI version answers

Every response starts with the `@khsura/sui` version and its source:

1. `project`: the nearest `node_modules/@khsura/sui/dist/sui-api.json`, found by walking up from `SUI_PROJECT_ROOT` if set, else from the working directory the client starts the server in.
2. `bundled`: the copy shipped inside `@khsura/sui-mcp` (the latest release at build time), used when no project install has the file or the project file is invalid.

Set `SUI_PROJECT_ROOT` when your client starts the server outside the project folder. Component examples: https://sui.surakh.com/

