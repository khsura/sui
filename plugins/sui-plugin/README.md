# sui-plugin

Claude Code plugin that gives Claude expert knowledge of the **`@khsura/sui`** Vue 3 component framework. Install it in an app that uses `@khsura/sui` (Vue or Nuxt) and Claude can set the library up, and generate idiomatic SUI components, forms, and layouts for you.

## Install

```
/plugin marketplace add khsura/sui
/plugin install sui-plugin@sui-framework
```

To install straight from GitHub:

```
/plugin marketplace add github:khsura/sui
```

Or add to your project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "sui-framework": {
      "source": { "source": "github", "repo": "khsura/sui" }
    }
  },
  "enabledPlugins": {
    "sui-plugin@sui-framework": true
  }
}
```

## Skills

| Skill | When to use |
| --- | --- |
| [`sui-getting-started`](./skills/sui-getting-started/SKILL.md) | Installing `@khsura/sui` from GitHub Packages, `SApp` + `createSUI`, styles and `@mdi/font`, Nuxt module, theme colors / dark mode, component defaults, vue-i18n, types, common mistakes. |
| [`sui-component`](./skills/sui-component/SKILL.md) | Using a specific component (`SButton`, `SCard`, `STable`, …) — routes to one per-family reference in `references/` with props, slots, events, examples and gotchas. |
| [`sui-form`](./skills/sui-form/SKILL.md) | Building validated forms with `SInput`, `SSelect`, `SCheckbox`, etc., including `rules` validation. |
| [`sui-layout`](./skills/sui-layout/SKILL.md) | Scaffolding app shells with `SLayout`, `SAppBar`, `SNavigationDrawer`, `SMain`, `SFooter`, `SBottomNavigation`. |
| [`sui-utilities`](./skills/sui-utilities/SKILL.md) | Looking up SUI utility classes (`s_*`), Vue directives, and SCSS helpers / mixins; restyling components without `:deep()`. |

Each skill lives in its own folder with a `SKILL.md` describing when Claude should invoke it.

## Maintenance

The plugin must work in consumer apps, where only the published package (`node_modules/@khsura/sui/dist` and `@types`) exists. Skills must not point at repository-only paths; bundle the content instead.

- `skills/sui-utilities/docs/` holds copies of `packages/app/docs/{classes,directives,helpers}.md`.
- `skills/sui-component/references/` holds copies of `packages/app/docs/components/*.md`, corrected against the component source and `definitions/props` (plus `alert.md`, written from source).

Update the copy and the original together whenever a component or its docs change, and bump `.claude-plugin/plugin.json` `version`.

Install the plugin rather than copying skill files into a project (`.agents/skills/`, `.claude/skills/`): copies drift out of date as SUI changes.

## Example prompts

```
/sui-component SAutocomplete with multiple selection
/sui-form registration form with email, password, confirm password
/sui-layout admin dashboard with nav drawer and toolbar
/sui-utilities flex utility classes
```

## Repository

Skills are maintained alongside the library at [github.com/khsura/sui](https://github.com/khsura/sui). Open an issue if a component is missing coverage, or edit the matching `SKILL.md` and send a PR.

## Related

- [`@khsura/sui`](https://github.com/khsura/sui/tree/main/packages/app) — the UI library this plugin documents
- [`@khsura/sui-nuxt`](https://github.com/khsura/sui-nuxt) — the Nuxt module
- [`marketplace.json`](https://github.com/khsura/sui/blob/main/.claude-plugin/marketplace.json) — the Claude Code marketplace catalog
