# VueUse useColorMode Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace SUI's custom, non-reactive, non-persisted color-mode handling with VueUse `useColorMode`, adding a reactive `auto` (follow-OS) mode, `localStorage` persistence, and C2-root SSR flash prevention — without changing how components consume the theme.

**Architecture:** Keep `appState.theme` as the resolved `'light' | 'dark'` value that `colorService` reads (untouched). Introduce a separate persisted `themePreference` (`'auto' | 'light' | 'dark'`) backed by one `useColorMode` instance per app, cached in a module-level registry and created with `attribute: 'data-theme'`. A sync effect mirrors `useColorMode`'s resolved ref → `appState.theme` and its `store` → `appState.themePreference`. SSR flash is reduced (C2-root) via an exported head-script helper plus a root `[data-theme]` CSS layer for page background + text.

**Tech Stack:** Vue 3.5, TypeScript, `@vueuse/core@^14.2.1`, Vitest (`happy-dom`), SCSS.

---

## File Structure

**Create:**
- `packages/app/helpers/themeColorMode.ts` — module-level registry + `getThemeColorMode()`; owns the single `useColorMode` instance per app and the sync mirror into `appState`.
- `packages/app/helpers/themeHeadScript.ts` — `getThemeHeadScript(appName?)` returning the inline anti-flash `<script>` body.
- `packages/app/styles/generic/_theme.scss` — root `html[data-theme="..."]` background + text layer.
- `packages/app/tests/services/themeService.test.tsx` — unit tests for the new service surface.
- `packages/app/tests/helpers/themeHeadScript.test.ts` — unit tests for the head-script string.

**Modify:**
- `packages/app/types/app.ts` — add `ThemePreference`.
- `packages/app/definitions/app.ts` — split `theme` (resolved) vs `themePreference` (preference).
- `packages/app/configs/app.ts` — default `themePreference: 'auto'`.
- `packages/app/modules/sUI.ts` — extract `theme` option as preference; wire `getThemeColorMode` in `install`.
- `packages/app/services/themeService.ts` — return `{ theme, preference, setTheme }`.
- `packages/app/helpers/themeHelpers.ts` — mark `getBrowserTheme` `@deprecated`.
- `packages/app/helpers/index.ts` — export new helpers.
- `packages/app/index.ts` — export `ThemePreference`, `getThemeHeadScript`.
- `packages/app/styles/generic/index.scss` — `@use './theme'`.
- `packages/app/tests/setup.ts` — add `window.matchMedia` mock.

---

## Task 1: Add `ThemePreference` type

**Files:**
- Modify: `packages/app/types/app.ts:39`

- [ ] **Step 1: Add the type**

In `packages/app/types/app.ts`, the file currently ends with:

```ts
export type AppThemeType = 'light' | 'dark'
```

Add directly below it:

```ts
export type AppThemeType = 'light' | 'dark'

/**
 * The user's persisted color-mode choice.
 * `'auto'` follows the OS preference; `'light'`/`'dark'` are explicit overrides.
 * Distinct from `AppThemeType`, which is always the *resolved* theme.
 */
export type ThemePreference = AppThemeType | 'auto'
```

- [ ] **Step 2: Verify typecheck still passes**

Run: `cd packages/app && npx vue-tsc --noEmit`
Expected: PASS (no errors). `ThemePreference` is exported transitively via `index.ts`'s `export * from './types'`.

- [ ] **Step 3: Commit**

```bash
git add packages/app/types/app.ts
git commit -m "feat(theme): add ThemePreference type"
```

---

## Task 2: Split resolved theme vs preference in state definitions

**Files:**
- Modify: `packages/app/definitions/app.ts`
- Modify: `packages/app/configs/app.ts`

- [ ] **Step 1: Update `definitions/app.ts`**

Replace the entire contents of `packages/app/definitions/app.ts` with:

```ts
import { type AppTheme } from '@/app/constants'
import type {
  AppThemeType,
  DisplayOptions,
  DisplayPreset,
  ThemeConfig,
  ThemeConfigOptions,
  ThemePreference,
} from '@/app/types'

export type ComponentsOption = {
  [ComponentName: string]: Record<string, unknown>
}

export interface AppStateOptions {
  /** The user's color-mode preference. Defaults to `'auto'` (follow OS). */
  theme?: ThemePreference
  display?: DisplayOptions
  themes?: {
    [AppTheme.light]?: ThemeConfigOptions
    [AppTheme.dark]?: ThemeConfigOptions
  }
  components?: ComponentsOption
}

export interface AppState<T extends string = 'sui'> extends Required<Omit<AppStateOptions, 'theme'>> {
  readonly name: T
  /** Resolved theme actually applied. Never `'auto'`. Consumed by colorService. */
  theme: AppThemeType
  /** The user's persisted preference. Mirrors useColorMode's `store`. */
  themePreference: ThemePreference
  display: DisplayPreset
  themes: {
    [AppTheme.light]: ThemeConfig
    [AppTheme.dark]: ThemeConfig
  }
}
```

- [ ] **Step 2: Update `configs/app.ts` defaults**

In `packages/app/configs/app.ts`, the config object currently starts:

```ts
export const defaultAppConfig = {
  theme: AppTheme.light,
  display: {
```

Change it to add `themePreference` (keep `theme` as the resolved default for SSR/first paint):

```ts
export const defaultAppConfig = {
  theme: AppTheme.light,
  themePreference: 'auto',
  display: {
```

The trailing `} satisfies Omit<AppState, 'name'>` now requires both `theme: AppThemeType` and `themePreference: ThemePreference`, which are both present.

- [ ] **Step 3: Verify typecheck**

Run: `cd packages/app && npx vue-tsc --noEmit`
Expected: PASS. If an error like `'auto' is not assignable to ThemePreference` appears, confirm `ThemePreference` from Task 1 is imported in `configs/app.ts` is NOT needed (it's a plain string literal validated by the `satisfies` clause).

- [ ] **Step 4: Commit**

```bash
git add packages/app/definitions/app.ts packages/app/configs/app.ts
git commit -m "feat(theme): split resolved theme from persisted preference in AppState"
```

---

## Task 3: Mock `window.matchMedia` in the test setup (prerequisite)

`tests/setup.ts` registers `createSUI()` globally, so once `useColorMode` is wired into `createSUI` (Task 5), every unit test will call `window.matchMedia` via `usePreferredDark`. `happy-dom` does not guarantee `matchMedia`, so add a mock now.

**Files:**
- Modify: `packages/app/tests/setup.ts`

- [ ] **Step 1: Add the mock**

`packages/app/tests/setup.ts` currently reads:

```ts
import { config } from '@vue/test-utils'
import { createSUI } from '@/app/modules'

// use this if common setup is needed
config.global.plugins = [createSUI()]
```

Replace it with:

```ts
import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { createSUI } from '@/app/modules'

// happy-dom does not implement matchMedia; useColorMode (via usePreferredDark) needs it.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false, // default: OS prefers light
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

// use this if common setup is needed
config.global.plugins = [createSUI()]
```

- [ ] **Step 2: Verify existing tests still pass**

Run: `cd packages/app && npx vitest run --project unit tests/services/appService.test.tsx`
Expected: PASS (the mock is inert until Task 5 wires `useColorMode`, but adding it now must not break anything).

- [ ] **Step 3: Commit**

```bash
git add packages/app/tests/setup.ts
git commit -m "test(theme): mock window.matchMedia in unit setup"
```

---

## Task 4: Create the global `useColorMode` helper

Theme is intentionally global across the page — a single `useColorMode` instance, a single `localStorage['sui-theme']` key, a single `<html data-theme>` attribute. Multiple SUI app instances share theme by design. The helper is a module-level singleton created inside a detached `effectScope` (to avoid "no active instance" warnings and to live for the page's lifetime). A `WeakSet<AppState>` deduplicates per-`appState` mirror bindings so each app's install hook registers its store at most once. Project ESLint forbids `@typescript-eslint/no-non-null-assertion`, so `scope.run(...)` is cast rather than `!`-asserted; TypeScript widens `UseColorModeReturn`'s generic to `ThemePreference` because `initialValue` is typed that way (runtime semantics unchanged — `.value` is still always resolved `'light'|'dark'`).

**Files:**
- Create: `packages/app/helpers/themeColorMode.ts`
- Modify: `packages/app/helpers/index.ts`
- Test: `packages/app/tests/services/themeService.test.tsx` (covered in Task 7)

- [ ] **Step 1: Write the helper**

Create `packages/app/helpers/themeColorMode.ts`:

```ts
import { effectScope, watchSyncEffect } from 'vue'
import { useColorMode, type UseColorModeReturn } from '@vueuse/core'
import type { AppState } from '@/app/definitions'
import type { AppThemeType, ThemePreference } from '@/app/types'

const STORAGE_KEY = 'sui-theme'

let scope: ReturnType<typeof effectScope> | null = null
let colorMode: UseColorModeReturn<ThemePreference> | null = null
let boundStates = new WeakSet<AppState>()

/**
 * Returns the single, global useColorMode instance, creating it on first call.
 * Theme is intentionally global across all SUI app instances on the page — they
 * share one persisted preference (`localStorage['sui-theme']`) and one DOM hook
 * (`<html data-theme>`).
 *
 * When `appState` is provided and has not already been bound, a synchronous
 * effect mirrors the resolved color mode into `appState.theme` (always
 * `'light' | 'dark'`) and the persisted preference into `appState.themePreference`.
 * Each app's install hook passes its store once; subsequent retrievals (e.g.
 * from `useThemeService`) omit `appState`.
 *
 * The instance lives in a detached effect scope for the page's lifetime.
 */
export const getThemeColorMode = (
  appState?: AppState,
  initialValue: ThemePreference = 'auto',
): UseColorModeReturn<ThemePreference> => {
  if (!scope || !colorMode) {
    scope = effectScope(true)
    colorMode = scope.run(() =>
      useColorMode({
        selector: 'html',
        attribute: 'data-theme',
        storageKey: STORAGE_KEY,
        initialValue,
      }),
    ) as UseColorModeReturn<ThemePreference>
  }

  if (appState && !boundStates.has(appState)) {
    boundStates.add(appState)
    const mode = colorMode

    scope.run(() => {
      watchSyncEffect(() => {
        appState.theme = mode.value as AppThemeType
        appState.themePreference = mode.store.value as ThemePreference
      })
    })
  }

  return colorMode
}

/** Test-only: stop the scope and reset singleton + bound-state tracking. */
export const __resetThemeColorModeRegistry = () => {
  scope?.stop()
  scope = null
  colorMode = null
  boundStates = new WeakSet<AppState>()
}
```

- [ ] **Step 2: Export from helpers barrel**

In `packages/app/helpers/index.ts`, add the export. The file currently is:

```ts
export * from './createAppStore'
export * from './display'
export * from './themeHelpers'
export * from './tableHelpers'
export * from './autocompleteHelpers'
export * from './selectItemHelpers'
```

Add the new line after `./themeHelpers`:

```ts
export * from './createAppStore'
export * from './display'
export * from './themeHelpers'
export * from './themeColorMode'
export * from './tableHelpers'
export * from './autocompleteHelpers'
export * from './selectItemHelpers'
```

- [ ] **Step 3: Verify typecheck**

Run: `cd packages/app && npx vue-tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add packages/app/helpers/themeColorMode.ts packages/app/helpers/index.ts
git commit -m "feat(theme): add useColorMode registry helper with appState mirror"
```

---

## Task 5: Wire `useColorMode` into `createSUI`

Extract the `theme` option as the initial *preference*, and bind the color mode in `install` (runs client-side at `app.use(...)`).

**Files:**
- Modify: `packages/app/modules/sUI.ts`

- [ ] **Step 1: Update `createSUI`**

Replace the entire contents of `packages/app/modules/sUI.ts` with:

```ts
import { type InjectionKey, type Plugin } from 'vue'
import { resize, scroll } from '@/app/directives'
import { createAppStore } from '@/app/helpers/createAppStore'
import { getThemeColorMode } from '@/app/helpers/themeColorMode'
import { listenDisplayChange } from '@/app/helpers/display'
import type { AppState, AppStateOptions } from '@/app/definitions'
import { getPluginName } from '@/app/lib/getPluginName'

export const createSUI = <T extends string = 'sui'>(options?: AppStateOptions, name?: T) => {
  const appName = getPluginName<T>(name)
  // `theme` is the user's *preference* (may be 'auto'); it must not populate the
  // resolved `appState.theme`. Route it to useColorMode as the initial value.
  const { theme: themePreference = 'auto', ...restOptions } = options ?? {}
  const store = createAppStore<T>(appName, restOptions)

  const plugin: Plugin = {
    install: (app) => {
      if (app.config.globalProperties[`$${appName}`]) {
        console.error(`${appName} is already exist. app may not work properly`)

        return
      }

      app.config.globalProperties[`$${appName}`] = store
      app.provide(appName as unknown as InjectionKey<AppState<T>>, store as unknown as AppState<T>)

      app.directive('scroll', scroll)
      app.directive('resize', resize)
      listenDisplayChange()

      // Reactive color mode (global singleton): persists to localStorage, follows
      // OS in 'auto', writes <html data-theme>, and mirrors the resolved value
      // into store.theme.
      getThemeColorMode(store as unknown as AppState, themePreference)
    },
  }

  return plugin
}
```

- [ ] **Step 2: Verify typecheck**

Run: `cd packages/app && npx vue-tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Verify existing app/theme test still passes**

Run: `cd packages/app && npx vitest run --project unit tests/services/appService.test.tsx`
Expected: PASS. (`setTheme` is rewritten in Task 6, but the existing test only mounts via `mountWithApp`/global `createSUI` and calls the current `setTheme`. After Task 6 it uses the new one. This step confirms wiring `useColorMode` into install does not crash setup with the matchMedia mock in place.)

- [ ] **Step 4: Commit**

```bash
git add packages/app/modules/sUI.ts
git commit -m "feat(theme): wire useColorMode into createSUI install"
```

---

## Task 6: Rewrite `useThemeService`

New surface: `{ theme, preference, setTheme }`. `theme` stays a computed of the resolved `appState.theme`. `setTheme` writes to the shared color mode (`null` → `'auto'`).

**Files:**
- Modify: `packages/app/services/themeService.ts`

- [ ] **Step 1: Rewrite the service**

Replace the entire contents of `packages/app/services/themeService.ts` with:

```ts
import { computed } from 'vue'
import { getThemeColorMode } from '@/app/helpers/themeColorMode'
import { useAppProviderRepository } from '@/app/repositories/core/appProviderRepository'
import type { ThemePreference } from '@/app/types'

export const useThemeService = (appName?: string | symbol) => {
  const { appState } = useAppProviderRepository(appName)
  const colorMode = getThemeColorMode(appState)

  /** Resolved theme actually applied ('light' | 'dark'). */
  const theme = computed(() => appState.theme)

  /** The user's persisted preference ('auto' | 'light' | 'dark'). */
  const preference = computed(() => appState.themePreference)

  /** Set the color-mode preference. `null` resets to 'auto' (follow OS). */
  const setTheme = (value: ThemePreference | null) => {
    colorMode.value = value ?? 'auto'
  }

  return {
    theme,
    preference,
    setTheme,
  }
}
```

- [ ] **Step 2: Verify typecheck**

Run: `cd packages/app && npx vue-tsc --noEmit`
Expected: PASS. Note `useAppProviderRepository` injects `ProviderName.app` with a fallback to `getPluginName(appName)`, matching how `colorService` resolves `appState`.

- [ ] **Step 3: Verify existing app/theme test still passes**

Run: `cd packages/app && npx vitest run --project unit tests/services/appService.test.tsx`
Expected: PASS. `setTheme(AppTheme.light)` sets `colorMode.value = 'light'`, the sync effect mirrors `appState.theme = 'light'` immediately, and `theme` reads it back synchronously. `app.vm.config.theme = AppTheme.dark` still updates the computed getter directly.

- [ ] **Step 4: Commit**

```bash
git add packages/app/services/themeService.ts
git commit -m "feat(theme): useTheme returns { theme, preference, setTheme }"
```

---

## Task 7: Unit tests for `useThemeService`

**Files:**
- Create: `packages/app/tests/services/themeService.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `packages/app/tests/services/themeService.test.tsx`:

```tsx
import { defineComponent } from 'vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useTheme } from '@/app/index'
import { __resetThemeColorModeRegistry } from '@/app/helpers/themeColorMode'
import { mountWithApp } from '@/app/tests/_helpers'

const mountTheme = () =>
  mountWithApp(
    defineComponent({
      setup: () => {
        const { theme, preference, setTheme } = useTheme()

        return { theme, preference, setTheme }
      },
      template: `<div></div>`,
    }),
  )

describe('useThemeService', () => {
  beforeEach(() => {
    localStorage.clear()
    __resetThemeColorModeRegistry()
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('defaults to auto preference, resolving to light when OS prefers light', () => {
    const app = mountTheme()

    expect(app.vm.preference).toBe('auto')
    expect(app.vm.theme).toBe('light') // matchMedia mock: matches=false
  })

  it('setTheme("dark") forces dark and updates the resolved theme synchronously', () => {
    const app = mountTheme()

    app.vm.setTheme('dark')

    expect(app.vm.preference).toBe('dark')
    expect(app.vm.theme).toBe('dark')
  })

  it('setTheme persists the preference to localStorage', () => {
    const app = mountTheme()

    app.vm.setTheme('dark')

    expect(localStorage.getItem('sui-theme')).toBe('dark')
  })

  it('setTheme(null) resets the preference to auto', () => {
    const app = mountTheme()

    app.vm.setTheme('dark')
    app.vm.setTheme(null)

    expect(app.vm.preference).toBe('auto')
  })

  it('never lets the resolved theme become "auto"', () => {
    const app = mountTheme()

    app.vm.setTheme('auto')

    expect(app.vm.preference).toBe('auto')
    expect(['light', 'dark']).toContain(app.vm.theme)
  })

  it('writes the resolved value to <html data-theme>', () => {
    const app = mountTheme()

    app.vm.setTheme('dark')

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
```

- [ ] **Step 2: Run to verify they pass**

Run: `cd packages/app && npx vitest run --project unit tests/services/themeService.test.tsx`
Expected: PASS (all 6). If `data-theme` assertion fails, confirm Task 4 uses `attribute: 'data-theme'` and no `modes` override (default maps `light`→`'light'`, `dark`→`'dark'`).

- [ ] **Step 3: Commit**

```bash
git add packages/app/tests/services/themeService.test.tsx
git commit -m "test(theme): cover useTheme preference/resolved/persistence/attribute"
```

---

## Task 8: Deprecate `getBrowserTheme`

**Files:**
- Modify: `packages/app/helpers/themeHelpers.ts`

- [ ] **Step 1: Add the deprecation notice**

Replace the contents of `packages/app/helpers/themeHelpers.ts` with:

```ts
import { AppTheme } from '@/app/constants'
import { getWindow } from '@/app/lib'
import type { AppThemeType } from '@/app/types'

/**
 * @deprecated Use `useTheme()` instead. This performs a one-shot, non-reactive
 * read of the OS preference. `useTheme().theme` is reactive and persisted, and
 * `setTheme('auto')` follows the OS live.
 */
export const getBrowserTheme = (): AppThemeType => {
  const window = getWindow()

  return window?.matchMedia?.('(prefers-color-scheme: dark)').matches ? AppTheme.dark : AppTheme.light
}
```

- [ ] **Step 2: Verify typecheck (deprecation must not break callers)**

Run: `cd packages/app && npx vue-tsc --noEmit`
Expected: PASS. `.storybook/preview.ts` still imports and uses `getBrowserTheme`; `@deprecated` is a lint/IDE hint, not a removal.

- [ ] **Step 3: Commit**

```bash
git add packages/app/helpers/themeHelpers.ts
git commit -m "refactor(theme): deprecate getBrowserTheme in favor of useTheme"
```

---

## Task 9: Add `getThemeHeadScript` head-script helper

Pure function returning an inline `<script>` body that sets `data-theme` before hydration. Reads the global `localStorage['sui-theme']` key that `useColorMode` writes.

**Files:**
- Create: `packages/app/helpers/themeHeadScript.ts`
- Modify: `packages/app/helpers/index.ts`
- Modify: `packages/app/index.ts`
- Test: `packages/app/tests/helpers/themeHeadScript.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/app/tests/helpers/themeHeadScript.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getThemeHeadScript } from '@/app/index'

describe('getThemeHeadScript', () => {
  it('reads the global sui-theme storage key', () => {
    const script = getThemeHeadScript()

    expect(script).toContain("localStorage.getItem('sui-theme')")
  })

  it('resolves auto via prefers-color-scheme and sets data-theme', () => {
    const script = getThemeHeadScript()

    expect(script).toContain('prefers-color-scheme: dark')
    expect(script).toContain("setAttribute('data-theme'")
  })

  it('is wrapped in a self-invoking try/catch IIFE', () => {
    const script = getThemeHeadScript()

    expect(script.trim().startsWith('(function()')).toBe(true)
    expect(script).toContain('try')
    expect(script).toContain('catch')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd packages/app && npx vitest run --project unit tests/helpers/themeHeadScript.test.ts`
Expected: FAIL with module/export not found for `getThemeHeadScript`.

- [ ] **Step 3: Write the helper**

Create `packages/app/helpers/themeHeadScript.ts`:

```ts
/**
 * Returns an inline `<script>` body that applies the persisted color mode to
 * `<html data-theme>` before hydration, preventing a flash of the wrong theme.
 *
 * Inject the returned string into `<head>` (e.g. a Nuxt `app.head` script child,
 * or a raw `<script>` in `index.html`). It reads the global localStorage key
 * that `useColorMode` writes (`sui-theme`) and resolves `'auto'` via matchMedia.
 *
 * @example
 * // index.html
 * <script>{{ getThemeHeadScript() }}</script>
 */
export const getThemeHeadScript = (): string => {
  return `(function(){try{var p=localStorage.getItem('sui-theme');var m=(p&&p!=='auto')?p:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){}})();`
}
```

- [ ] **Step 4: Export from helpers barrel and root index**

In `packages/app/helpers/index.ts`, add after `./themeColorMode`:

```ts
export * from './themeColorMode'
export * from './themeHeadScript'
```

`packages/app/index.ts` already re-exports all helpers via `export * from './helpers'` (line 6), so `getThemeHeadScript` is exported automatically. No edit to `index.ts` is required for the helper; verify in the next step.

- [ ] **Step 5: Run to verify it passes**

Run: `cd packages/app && npx vitest run --project unit tests/helpers/themeHeadScript.test.ts`
Expected: PASS (all 4).

- [ ] **Step 6: Commit**

```bash
git add packages/app/helpers/themeHeadScript.ts packages/app/helpers/index.ts packages/app/tests/helpers/themeHeadScript.test.ts
git commit -m "feat(theme): add getThemeHeadScript anti-flash helper"
```

---

## Task 10: Add the root `[data-theme]` CSS layer (C2-root)

Make the page background + text correct at first paint for the resolved theme.

**Files:**
- Create: `packages/app/styles/generic/_theme.scss`
- Modify: `packages/app/styles/generic/index.scss`

- [ ] **Step 1: Write the SCSS layer**

Create `packages/app/styles/generic/_theme.scss`:

```scss
@use '../tools';
@use '../variables';

// C2-root: set page background + text from the resolved theme so the dominant
// full-viewport flash is gone before hydration. Per-component colors still
// settle via appState.theme. `data-theme` is written by useColorMode and by
// getThemeHeadScript() before paint.
@each $themeName in variables.$s_themeNames {
  html[data-theme='#{$themeName}'] {
    background-color: tools.s_getThemeColor('background', $themeName);
    color: tools.s_getThemeColor('text', $themeName);
  }
}
```

- [ ] **Step 2: Register the partial**

`packages/app/styles/generic/index.scss` currently is:

```scss
@use './reset';
@use './common';
@use './transitions';
```

Add the theme layer last so it can override resets if needed:

```scss
@use './reset';
@use './common';
@use './transitions';
@use './theme';
```

- [ ] **Step 3: Verify the styles build**

Run: `cd packages/app && npm run build`
Expected: build succeeds with no SCSS errors. (If the project has a faster style-only build/lint script, the implementer may use it; otherwise the full build validates the SCSS compiles and `s_getThemeColor`/`$s_themeNames` resolve.)

- [ ] **Step 4: Commit**

```bash
git add packages/app/styles/generic/_theme.scss packages/app/styles/generic/index.scss
git commit -m "feat(theme): root [data-theme] background/text layer for SSR anti-flash"
```

---

## Task 11: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Typecheck the whole package**

Run: `cd packages/app && npx vue-tsc --noEmit`
Expected: PASS, no errors.

- [ ] **Step 2: Run the full unit test project**

Run: `cd packages/app && npx vitest run --project unit`
Expected: PASS, including `appService.test.tsx`, `themeService.test.tsx`, and `themeHeadScript.test.ts`.

- [ ] **Step 3: Lint**

Run: `cd packages/app && npx eslint . --ext .ts,.tsx,.vue` (or the project's configured lint script, e.g. `npm run lint`)
Expected: PASS (no errors in changed files).

- [ ] **Step 4: Build**

Run: `cd packages/app && npm run build`
Expected: build succeeds (validates SCSS + type emit + bundling of new exports).

- [ ] **Step 5: Final commit (only if any verification fix was needed)**

```bash
git add -A
git commit -m "chore(theme): verification fixes for useColorMode integration"
```

---

## Manual / visual verification (post-merge, not automated)

- In Storybook (`storybook/stories/features/theme.stories.ts`), toggle theme via the existing `SToggleButtonGroup` and confirm components recolor and the choice persists across reloads (localStorage key `sui-theme`).
- Change the OS appearance while preference is `auto`; confirm the app follows live (reactive `usePreferredDark`).
- For an SSR consumer (e.g. Nuxt), inject `getThemeHeadScript()` into `<head>` and confirm the page background no longer flashes on first load.

## Out of scope (per spec)

- C2-full: refactoring every component to key styling off the global `[data-theme]` attribute.
- Multi-app contention over the single global `data-theme` attribute (documented limitation).
