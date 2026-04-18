# sui-plugin

Claude Code plugin that gives Claude expert knowledge of the **`@khsura/sui`** Vue 3 component framework. Install it and Claude can generate idiomatic SUI components, forms, and layouts for you.

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
| [`sui-getting-started`](./skills/sui-getting-started/) | Setting up `@khsura/sui` in a new app, configuring `createSUI`, looking up shared props/conventions. |
| [`sui-component`](./skills/sui-component/) | Using a specific component (`SButton`, `SCard`, `SAutocomplete`, …) — imports, props, slots, events, examples. |
| [`sui-form`](./skills/sui-form/) | Building validated forms with `SInput`, `SSelect`, `SCheckbox`, etc., including `rules` validation. |
| [`sui-layout`](./skills/sui-layout/) | Scaffolding app shells with `SLayout`, `SAppBar`, `SNavigationDrawer`, `SMain`, `SFooter`, `SBottomNavigation`. |
| [`sui-docs`](./skills/sui-utilities/) | Looking up SUI utility classes (`s_*`), Vue directives, and SCSS helpers / mixins. |

Each skill lives in its own folder with a `SKILL.md` describing when Claude should invoke it.

## Example prompts

```
/sui-component SAutocomplete with multiple selection
/sui-form registration form with email, password, confirm password
/sui-layout admin dashboard with nav drawer and toolbar
/sui-docs flex utility classes
```

## Repository

Skills are maintained alongside the library at [github.com/khsura/sui](https://github.com/khsura/sui). Open an issue if a component is missing coverage, or edit the matching `SKILL.md` and send a PR.

## Related

- [`@khsura/sui`](../../packages/app) — the UI library this plugin documents
- [`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json) — the Claude Code marketplace catalog
