# Component Default Props — Development Plan

## Goal

Allow users to configure global default props per component when creating the SUI plugin:

```ts
app.use(createSUI({
  components: {
    SSelect: { outlined: true },
    SButton: { color: 'primary', size: 'small' },
    SInput:  { underlined: true },
  }
}))
```

Any prop set here acts as the default for every instance of that component across the app, but can still be overridden by the explicit prop on the element.

---

## Difficulty: Medium

The core mechanism is straightforward — inject defaults from the store, merge with local props inside a composable. The bulk of the work is updating every component to use the composable, and getting the TypeScript types right.

---

## Architecture

### The Core Problem: Distinguishing "not passed" from "passed"

Vue's `defineProps` assigns declared defaults at compile time, so inside a component you cannot tell whether the user passed `outlined` or Vue filled it in from the default. There are two viable approaches:

**Option A — Remove per-prop `default:` from `defineProps`, resolve all defaults in a composable.**
- Clean, composable owns all default logic.
- Breaking change to any code that reads `props.x` expecting the Vue default.

**Option B — Keep Vue prop defaults as `undefined`, resolve in a composable layered on top.**
- Declare all prop defaults as `undefined` (or omit them).
- Composable merges: `componentDefault ?? undefined`.
- Non-breaking, easier incremental rollout.
- **Recommended.**

With Option B, the merge priority is:

```
explicit prop value  >  component-level default (from createSUI)  >  built-in fallback
```

---

## Step-by-Step Plan

### Step 1 — Type definitions

**File:** `definitions/app.ts`

Add a `ComponentsOption` type and extend `AppStateOptions`:

```ts
// Loose type — each component's defaults are a plain object.
// Could be tightened per-component later (see Step 6).
export type ComponentsOption = {
  [ComponentName: string]: Record<string, unknown>
}

export interface AppStateOptions {
  theme?: AppThemeType
  display?: DisplayOptions
  themes?: { ... }
  components?: ComponentsOption   // ← new
}

export interface AppState<T extends string = 'sui'> extends Required<AppStateOptions> {
  // ...
  components: ComponentsOption    // ← new (defaults to {})
}
```

---

### Step 2 — Store

**File:** `configs/app.ts` (wherever `defaultAppConfig` lives)

Add `components: {}` to the default config so it is always present after the merge in `createAppStore`.

---

### Step 3 — No new injection key needed

`useAppProviderRepository` (`repositories/core/appProviderRepository.ts`) already injects the full `AppState` via `ProviderName.app`. Since `components` will live on `AppState`, there is nothing extra to provide — Step 3 and Step 4 from the original draft are eliminated.

---

### Step 4 — `useComponentDefaults` composable

**File:** `services/core/useComponentDefaults.ts`

```ts
import { useAppProviderRepository } from '@/app/repositories/core/appProviderRepository'

/**
 * Returns a merged props view for a component.
 * Explicit props win; undefined props fall back to the component-level default
 * configured via createSUI({ components: { SSelect: { outlined: true } } }).
 *
 * @param componentName - e.g. 'SSelect'
 * @param props         - the raw props object from defineProps
 */
export function useComponentDefaults<P extends object>(
  componentName: string,
  props: P,
): P {
  const { appState } = useAppProviderRepository()
  const componentDefaults = (appState.components?.[componentName] ?? {}) as Partial<P>

  // Proxy is transparent — components keep using props.x unchanged.
  return new Proxy(props, {
    get(target, key: string) {
      const value = target[key as keyof P]
      if (value === undefined && key in componentDefaults) {
        return componentDefaults[key as keyof P]
      }
      return value
    },
  }) as P
}
```

> Because `appState` is already reactive (returned by `useAppProviderRepository`), changes to `appState.components` propagate automatically.

---

### Step 5 — Update components

For each component that should respect global defaults:

1. Ensure any prop that should be overridable has `default: undefined` in its `defineProps` (not a hardcoded value).
2. Call the composable at the top of `<script setup>`:

```ts
// Before
const props = defineProps<PropsSelect>()

// After — defineProps must stay standalone (it's a compiler macro)
const rawProps = defineProps<PropsSelect>()
const props = useComponentDefaultsService('SSelect', rawProps)
```

Everything else in the component (`props.outlined`, `props.color`, etc.) stays the same.

**Rollout order (suggested):**
1. Form inputs: `SInput`, `SSelect`, `SAutocomplete`, `SSwitch`
2. Display: `SButton`, `SChip`, `SCard`
3. Remaining components as needed

---

### Step 6 — TypeScript strictness (optional, Phase 2)

The `ComponentsOption` type above is loose (`Record<string, unknown>`). To get full autocomplete and type safety:

```ts
import type { PropsSelect } from './definitions/props/propsSelect'
import type { PropsButton }  from './definitions/props/propsButton'
// ...

export type ComponentsOption = {
  SSelect?:      Partial<PropsSelect>
  SButton?:      Partial<PropsButton>
  SInput?:       Partial<PropsInput>
  // ...all components
}
```

This is purely additive — the runtime behavior is identical.

---

### Step 7 — Tests

For each updated component, add a test:

```ts
it('uses component-level default prop when prop is not set', () => {
  const wrapper = mountWithDefaults(SSelect, {
    components: { SSelect: { outlined: true } }
  })
  expect(wrapper.classes()).toContain('s-select--outlined')
})

it('explicit prop overrides component-level default', () => {
  const wrapper = mountWithDefaults(SSelect, {
    components: { SSelect: { outlined: true } }
  }, { outlined: false })
  expect(wrapper.classes()).not.toContain('s-select--outlined')
})
```

---

## File Summary

| File | Change |
|------|--------|
| `definitions/app.ts` | Add `ComponentsOption`, extend `AppStateOptions` + `AppState` |
| `configs/app.ts` | Add `components: {}` to `defaultAppConfig` |
| `services/core/useComponentDefaults.ts` | New composable — reads from `useAppProviderRepository` |
| Each component `.vue` | Use `useComponentDefaults` + ensure props default to `undefined` |
| `definitions/app.ts` (Phase 2) | Strict per-component typing for `ComponentsOption` |

No changes needed to `modules/sUI.ts` or the provider setup — `useAppProviderRepository` already handles injection.

---

## Open Questions

1. **Should this cascade through slots?**
   e.g. does `SFormField` → `SInput` inherit the `SInput` defaults automatically? Probably yes — since injection is inherited by all child components.

2. **Should defaults be reactive (changeable at runtime)?**
   The current plan stores them in the reactive `AppState`, so yes — changing `store.components.SButton.color` at runtime would propagate. Decide whether to expose a setter.

3. **Boolean props (`outlined: false` vs not passed)**
   Vue's `defineProps` coerces absent boolean props to `false`. To make them overridable, declare them as `boolean | undefined` instead of `boolean`. Worth a global audit before starting.
