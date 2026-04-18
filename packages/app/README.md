# @khsura/sui

A Vue 3 + TypeScript component framework — batteries included.

> 89 components · 39 composables · layout system · theming · SCSS helpers · Storybook · Vitest

## Features

- **89 components** prefixed with `S` (e.g. `SButton`, `SCard`, `SInput`, `SDialog`, `SAutocomplete`, `SDataTable`). Every component ships with TypeScript prop types in `definitions/`.
- **Named layout system** — `<SLayout name="app">` + children (`SAppBar`, `SNavigationDrawer`, `SMain`, `SFooter`, `SBottomNavigation`) bound by a shared `name`.
- **Shared core props** across components — `color`, `elevation`, `size` (`mini` | `small` | `default` | `large` | `extra`), `outlined`, `borderRadius`, dimension props (`width`, `maxWidth`, ...), `href` / `to` link behaviour.
- **Form primitives** with unified `rules: ((value: unknown) => true | string)[]` validation, `hideDetails`, `error`, `dirty`, `disabled`, `id`.
- **Composables** — `useTheme()`, `useDisplay()` (breakpoints: `isMobile`, `isTablet`, `smAndUp`, …), `useScroll()`, `useClickOutside()`.
- **Popup activator pattern** — dialogs, menus, tooltips, and snackbars use the `#activator="{ on, attrs }"` slot (bind both `v-on="on"` and `v-bind="attrs"`).
- **SCSS utilities** — `s_*` utility classes, mixins, `s_getAppColor()` / `s_getPresetColor()` helpers, theme variables.
- **First-class TypeScript** — generated `.d.ts` files, generics on components where relevant.

## Installation

This package is published to **GitHub Packages** (not npmjs.com), so you need a GitHub token with `read:packages` scope.

### 1. Configure the registry

**For Yarn 4 (Berry)** — add to `.yarnrc.yml`:

```yaml
npmScopes:
  khsura:
    npmAlwaysAuth: true
    npmAuthToken: "${NPM_GITHUB_TOKEN}"
    npmRegistryServer: "https://npm.pkg.github.com"
```

Then expose the token via an env file (e.g. `.env.yarn` listed under `injectEnvironmentFiles`):

```
NPM_GITHUB_TOKEN=ghp_xxx...
```

**For npm** — add to `~/.npmrc` (or project `.npmrc`):

```
@khsura:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_GITHUB_TOKEN}
```

### 2. Add the package

```bash
yarn add @khsura/sui
# or
npm i @khsura/sui
```

### 3. Install the plugin

```ts
// main.ts
import { createApp } from 'vue'
import { createSUI } from '@khsura/sui'
import App from './App.vue'

import '@khsura/sui/style.css' // compiled CSS

const app = createApp(App)
app.use(createSUI())
app.mount('#app')
```

You can also import SCSS sources if you want to extend tokens:

```scss
// your styles
@use '@khsura/sui/style.scss' as *;
@use '@khsura/sui/helpers.scss' as *;
```

## Quick start

```vue
<template>
  <SLayout name="app">
    <SAppBar :for="'app'">
      <SToolbarTitle>My app</SToolbarTitle>
    </SAppBar>

    <SMain :for="'app'">
      <SContainer>
        <SCard elevation="2" outlined>
          <SCardTitle>Hello SUI</SCardTitle>
          <SCardText>
            <SButton color="primary" @click="handleClick">Click me</SButton>
          </SCardText>
        </SCard>
      </SContainer>
    </SMain>
  </SLayout>
</template>

<script setup lang="ts">
import { useDisplay } from '@khsura/sui'
const { isMobile } = useDisplay()
const handleClick = () => console.log({ isMobile: isMobile.value })
</script>
```

## Forms

```vue
<template>
  <SForm @submit.prevent="submit">
    <SInput v-model="name" :rules="[required]" label="Name" />
    <SSelect v-model="role" :items="roles" :rules="[required]" label="Role" />
    <SAutocomplete v-model="userId" :items="users" label="Assign to" />
    <SButton type="submit" color="primary">Save</SButton>
  </SForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const name = ref('')
const role = ref('')
const userId = ref('')
const roles = ['admin', 'editor', 'viewer']
const users = [{ text: 'Sura', value: '1' }, { text: 'Anar', value: '2' }]
const required = (v: unknown) => !!v || 'required'
const submit = () => console.log({ name: name.value, role: role.value, userId: userId.value })
</script>
```

## Popups (dialog / menu / tooltip / snackbar)

```vue
<SMenu>
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Open menu</SButton>
  </template>
  <SList>
    <SListItem>Item A</SListItem>
    <SListItem>Item B</SListItem>
  </SList>
</SMenu>
```

Always bind **both** `v-on="on"` and `v-bind="attrs"` on the activator element.

## Breakpoints (`useDisplay`)

```ts
import { useDisplay } from '@khsura/sui'
const {
  isMobile, isTablet, isDesktop,
  smAndUp, mdAndUp, lgAndUp,
  smAndDown, mdAndDown,
} = useDisplay()
```

## Component reference

Per-component docs live in [`docs/components/`](./docs/components/). Start with [`index.md`](./docs/components/index.md).

Interactive reference is in Storybook:

```bash
yarn workspace @khsura/sui storybook:dev
# http://localhost:6006
```

## Claude Code integration

This package ships with the `sui-plugin` Claude Code plugin. Install it so Claude can generate idiomatic SUI code for you:

```
/plugin marketplace add khsura/sui
/plugin install sui-plugin@sui-framework
```

Available skills: `/sui-getting-started`, `/sui-component`, `/sui-form`, `/sui-layout`, `/sui-docs` (utilities & mixins).

## Scripts

```bash
yarn build           # type-check + vite build + compile SCSS
yarn lint            # eslint
yarn stylelint       # stylelint on .vue/.css/.scss
yarn test            # vitest unit tests
yarn test-storybook  # vitest storybook tests
yarn storybook:dev   # storybook on :6006
yarn storybook:build # static storybook
yarn release         # yarn npm publish (see repo root README for beta flow)
```

## Peer expectations

- **Vue**: `^3.5.31`
- **Node**: `>=18`
- **Yarn**: `4.x` (Berry) if you develop this package

Required runtime deps (bundled or peered): `@vueuse/core`, `@vueuse/components`, `dayjs`, `uuid`, `vue-i18n`, `zod`.

## Versioning

Semver. Stable releases are cut by **release-please** from `main`. Pre-release builds use a `-beta.N` suffix and the `beta` npm tag:

```bash
yarn add @khsura/sui@beta
```

## License

See [`package.json`](./package.json).
