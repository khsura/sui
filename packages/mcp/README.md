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
| `ping` | Health check. |

## Where the guides come from

`get_guide` serves sections of `plugins/sui-plugin/skills/sui-getting-started/SKILL.md` and `packages/app/docs/` as they are, mapped per topic in `src/configs/guideTopics.ts`. The build copies the mapped files into `dist/guides/`; unbundled (dev, tests) the server reads them from the repo. A renamed heading or a moved file fails the tests and the build, so edit the docs, then the mapping.

## Which SUI version answers

Every response starts with the `@khsura/sui` version and its source:

1. `project`: the nearest `node_modules/@khsura/sui/dist/sui-api.json`, found by walking up from `SUI_PROJECT_ROOT` if set, else from the working directory the client starts the server in.
2. `bundled`: the copy shipped inside `@khsura/sui-mcp` (the latest release at build time), used when no project install has the file or the project file is invalid.

Set `SUI_PROJECT_ROOT` when your client starts the server outside the project folder. Component examples: https://sui.surakh.com/

