# SUI

A Vue 3 + TypeScript component framework, developer utilities, and a Claude Code plugin — all in one monorepo.

## Packages

| Package | Description |
| --- | --- |
| [`@khsura/sui`](./packages/app) | Main UI library: 89 Vue 3 components, layout system, themes, composables, SCSS utilities. |
| [`@khsura/shared`](./packages/shared) | Shared helpers (faker, wait, etc.) used by the other packages and their tests. |
| [`sui-plugin`](./plugins/sui-plugin) | Claude Code plugin with skills for generating SUI code (components, forms, layouts, utilities). |

## Repository layout

```
sui/
├── .claude-plugin/
│   └── marketplace.json        # Claude Code marketplace catalog
├── packages/
│   ├── app/                    # @khsura/sui (published to GitHub Packages)
│   │   ├── components/         # 89 Vue SFCs (SButton, SCard, SInput, ...)
│   │   ├── services/           # 39 composables (useTheme, useDisplay, ...)
│   │   ├── definitions/        # Shared prop types
│   │   ├── storybook/          # Storybook stories and args
│   │   ├── docs/components/    # Per-component reference docs
│   │   └── tests/              # Vitest unit tests
│   └── shared/                 # @khsura/shared
└── plugins/
    └── sui-plugin/             # Claude Code skills
        └── skills/
            ├── sui-getting-started/
            ├── sui-component/
            ├── sui-form/
            ├── sui-layout/
            └── sui-utilities/
```

## Getting started (library user)

See [`packages/app/README.md`](./packages/app/README.md) for installation, setup, and usage.

## Getting started (Claude Code user)

Install the companion plugin so Claude can generate idiomatic SUI code:

```
/plugin marketplace add khsura/sui
/plugin install sui-plugin@sui-framework
```

Once installed, Claude gains skills like `/sui-component`, `/sui-form`, `/sui-layout`, and more.

## Development

This repo uses **Yarn 4** (Berry) workspaces and **Nx** for task orchestration.

```bash
# install
yarn install

# library development
yarn workspace @khsura/sui storybook:dev   # http://localhost:6006

# lint / test / build everything
yarn lint
yarn test
yarn build
```

Release is automated by **release-please**: merges to `main` that contain conventional commits (`feat:`, `fix:`, etc.) open a release PR; merging that PR publishes to GitHub Packages.

Manual beta releases can be cut with:

```bash
# bump to e.g. 1.7.16-beta.0 in packages/app/package.json, then:
yarn workspace @khsura/sui build
yarn workspace @khsura/sui npm publish --tag beta
```

## License

See individual package manifests.
