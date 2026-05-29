# Design: VueUse `useColorMode` integration

**Date:** 2026-05-27
**Status:** Approved (pending spec review)
**Package:** `@khsura/sui` — `packages/app`

## Goal

Replace SUI's custom, non-reactive, non-persisted color-mode handling with VueUse
`useColorMode`, while preserving SUI's existing theming architecture (per-component
`s_dark`/`s_light` classes derived from `appState.theme`). Add three things SUI lacks
today: a reactive `auto` (follow-OS) mode, `localStorage` persistence, and SSR
flash prevention for the page background/text.

`@vueuse/core@^14.2.1` is already a dependency (already imported in `colorService.ts`).

## Current state (what we are replacing)

- `AppTheme` enum (`constants/app.ts`): `'light' | 'dark'` only — no `auto`.
- `getBrowserTheme()` (`helpers/themeHelpers.ts`): one-shot `matchMedia('(prefers-color-scheme: dark)')`
  read; **not reactive** (never reacts to live OS theme changes).
- `useThemeService` → exported as `useTheme` (`services/themeService.ts`): reads/writes
  `appState.theme` via `inject`; `setTheme(null)` falls back to `getBrowserTheme()`.
- State lives in a **per-app reactive store** keyed by `appName` (`createAppStore`,
  installed via `createSUI` in `modules/sUI.ts`). Multiple named app instances are supported.
- **No persistence** anywhere — theme resets on reload.
- `appState.theme` is consumed by `colorService.ts` via `appState.themes[appState.theme]`
  (`themes` only has `light`/`dark` keys), producing per-component `s_dark`/`s_light` classes.
  **There is no global DOM theme hook** (no class/attribute on `<html>`).

## Key constraints / findings

1. **`appState.theme` must always resolve to `'light' | 'dark'`.** `colorService` indexes
   `themes[appState.theme]`, and only `light`/`dark` keys exist — it can never hold `'auto'`.
   Therefore preference (`auto|light|dark`) and resolved state (`light|dark`) are two
   distinct values that must be modeled separately.
2. **`emitAuto` is deprecated** in VueUse. Per the docs, use `mode.store` to know when
   `auto` is selected. So: the returned ref stays resolved `light|dark` (feeds `appState.theme`),
   and `mode.store` holds the `auto|light|dark` preference.
3. **SSR flash prevention requires a global DOM hook.** SUI's per-component reactive classes
   cannot be set before hydration. Real flash prevention needs `useColorMode` to write a
   global attribute (`data-theme`) plus a head-script that sets it before first paint, plus
   a thin root CSS layer that responds to it. Scope is **C2-root**: prevent the dominant
   full-viewport (background + text) flash; per-component colors still settle on hydration.

## Design

### 1. Types — `constants/app.ts`, `types/app.ts`

- `AppThemeType = 'light' | 'dark'` — **unchanged**. Remains the resolved theme stored in
  `appState.theme`. `colorService` is untouched.
- Add `ThemePreference = 'light' | 'dark' | 'auto'` — the user's persisted choice.
  (Mirrors VueUse `BasicColorSchema`.)

### 2. State — `definitions/app.ts`, `configs/app.ts`

- `appState.theme: AppThemeType` — kept; now fed the **resolved** value from `useColorMode`.
- Add `appState.themePreference: ThemePreference` — mirrors `mode.store`.
- `AppStateOptions.theme` widened to `ThemePreference` so consumers can configure an initial
  `'auto'`. Default config preference becomes `'auto'` (today hardcoded `light`).
- `AppState.themePreference` is `Required` (defaulted by `defaultAppConfig`).

### 3. The `useColorMode` instance — one global singleton

Theme is intentionally **global** across the page: a single `useColorMode` instance,
a single persisted preference (`localStorage['sui-theme']`), and a single DOM hook
(`<html data-theme>`). Multiple SUI app instances on the same page share theme by
design — they cannot diverge.

Implemented as a module-level singleton (`let colorMode | null`) created on first call
to `getThemeColorMode(appState?, initialValue?)`, inside a detached `effectScope` so
internal watchers have an owner. A `WeakSet<AppState>` deduplicates per-`appState`
bindings, so each app's install hook can register its store exactly once even if it
calls the helper multiple times.

```ts
useColorMode({
  selector: 'html',
  attribute: 'data-theme',     // global hook → <html data-theme="light|dark">
  storageKey: 'sui-theme',      // global, not per-app
  initialValue: options?.theme ?? 'auto',
  // no emitAuto (deprecated); disableTransition defaults to true (good)
})
```

Wire-up happens in `createSUI` install (`modules/sUI.ts`), alongside the existing
`listenDisplayChange()` precedent:

- bind the **resolved** ref → `appState.theme` (synchronously, via `watchSyncEffect`)
- bind `mode.store` → `appState.themePreference`

(On the server the composable returns defaults and registers nothing harmful; on the
client it reads storage + OS and sets the attribute.)

### 4. `useThemeService` / `useTheme` — `services/themeService.ts`

Returns `{ theme, preference, setTheme }`:

- `theme` — resolved `'light' | 'dark'` (computed; **unchanged consumer contract**).
- `preference` — `'auto' | 'light' | 'dark'` (the persisted store value).
- `setTheme(value: ThemePreference | null)` — writes `mode.value` on the shared instance;
  `null` coerces to `'auto'` (kept as a backward-compatible fallback; replaces the old
  `getBrowserTheme()` path).

`useThemeService` obtains the shared instance via `getThemeColorMode()` (no args after
install has bound `appState`) and continues to read `appState.theme` (resolved) for the
`theme` getter.

### 5. SSR flash prevention (C2-root)

- **Head-script helper:** export `getThemeHeadScript()` returning an inline `<script>`
  body (string). Consumers inject it in `<head>` (or Nuxt `app.head`). It reads
  `localStorage['sui-theme']`, resolves `auto` via `matchMedia`, and sets
  `document.documentElement.setAttribute('data-theme', resolved)` **before** hydration.
- **Root CSS layer:** add a thin SCSS rule keyed on `html[data-theme="dark"]` /
  `html[data-theme="light"]` setting page **background + text** color from existing theme
  tokens (`tools.s_getThemeColor('background' | 'text', ...)`). This makes the full-viewport
  background correct at first paint. Per-component colors still settle via `appState.theme`
  on hydration — the documented C2-root boundary.

### 6. Compatibility & intentional design choices

- `getBrowserTheme()` is **kept** (still exported; used in `.storybook/preview.ts`) and
  marked `@deprecated` pointing to `useTheme`. No breaking removal.
- **Theme is global by design.** Multiple SUI apps on the same page share one persisted
  preference (`localStorage['sui-theme']`) and one `<html data-theme>` attribute — they
  cannot diverge. Each app's `appState.theme` is still mirrored independently so per-app
  reactivity works, but the source of truth is the single global color mode.

### 7. Testing (vitest)

- `setTheme('dark' | 'light')` updates `preference`, persists to `localStorage`, and sets
  `appState.theme` to the same value.
- `setTheme('auto')` / `setTheme(null)` sets `preference = 'auto'`; resolved `theme` follows
  mocked `matchMedia` and reacts to a simulated OS change.
- Invariant: `appState.theme` is never `'auto'`.
- `data-theme` attribute on the target element reflects the resolved (`light`/`dark`) value.
- Mock `matchMedia` and `localStorage`.

## Out of scope

- C2-full: refactoring every component to key styling off the global `[data-theme]` attribute
  (true zero-flash for all widgets). Separate, much larger effort.
- Per-app independent themes (the design intentionally makes theme global; see §6).

## Affected files (anticipated)

- `constants/app.ts`, `types/app.ts` — add `ThemePreference`.
- `definitions/app.ts`, `configs/app.ts` — add `themePreference`, widen options, default `auto`.
- `helpers/` — new `getThemeColorMode` registry helper; `getThemeHeadScript` helper;
  `themeHelpers.ts` deprecate `getBrowserTheme`.
- `modules/sUI.ts` — instantiate + wire `useColorMode` in install.
- `services/themeService.ts` — new `{ theme, preference, setTheme }` surface.
- `styles/` — new root `[data-theme]` CSS layer (background + text).
- `index.ts` — export `ThemePreference`, `getThemeHeadScript`.
- `tests/` — theme service + integration tests.
