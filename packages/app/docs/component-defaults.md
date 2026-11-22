# Component defaults

Set a prop once for the whole app instead of repeating it at every call site:

```ts
app.use(createSUI({
  defaults: {
    global: { size: 'small', density: 'compact' }, // styling props for every component that has them
    SButton: { variant: 'text', elevation: 0 },  // per component, typed against PropsButton
    SSelect: { outlined: true },
  },
}))
```

## Resolution order

For every prop read inside a component:

1. **Explicit prop** on the element — always wins (detected from the raw vnode props, camelCase or kebab-case, so `:outlined="false"` beats a configured `true`).
2. **Component default** — `defaults.SButton`, then the deprecated untyped `components.SButton`.
3. **`defaults.global`** — only for a prop the component declares *and* is listed as a target for (see below).
4. **Built-in default** — the component's own `withDefaults` / prop default.

A configured value of `undefined` counts as "not set" and falls through to the next layer. With nothing configured, components behave exactly as before.

## `global`

`GlobalComponentDefaults` takes `size` (`'mini' | 'small' | 'default' | 'large' | 'extra'`), `borderRadius`, `rounded`, `elevation`, `color` and `density` (`'default' | 'comfortable' | 'compact'`, see [density.md](./density.md)). `variant` is per component only, because its values differ per component.

A global value only reaches the components listed for that prop in `globalComponentDefaultTargets` (`configs/componentDefaults.ts`). The list is checked at compile time with `satisfies GlobalComponentDefaultTargets`: a component whose prop is missing or cannot take the global value's type is a type error. Left out on purpose:

- `size`: `SCheckbox` (`'default' | 'large'`), `SProgressCircular` / `SProgressLinear` (pixel dimensions).
- `color`: surfaces and text (`SAppBar`, `SCard`, `SSheet`, `SToolbar`, `SFooter`, `SContainer`, `SList`, `SAlert`, `SIcon`, titles…), so a global accent color never repaints backgrounds; `SCheckbox` (preset colors only).

To opt one component out, set it on that component: `{ global: { size: 'small' }, SIcon: { size: 'default' } }`.

## Scoped defaults (`SDefaultsProvider`)

`<SDefaultsProvider :defaults="…">` takes the same `ComponentDefaultsOptions` and applies it to its subtree only, such as a dense filter bar or toolbar. Its layer is merged onto the nearest outer layer (an outer provider, else `createSUI({ defaults })`) per component and per prop, with `global` merged the same way; the inner value wins. The resolution order above then runs against the merged layer, so a component default from any layer still beats a `global` value. See [components/defaults-provider.md](./components/defaults-provider.md).

## Typing

`defaults` is `ComponentDefaultsOptions`: one optional `Partial<Props…>` per entry of `ComponentPropsMap` (`definitions/componentDefaults.ts`) plus `global`. Misspelled component names, props or values fail type-checking. The older `components` option stays as an untyped alias; `defaults` wins when both set the same prop.

## Implementation

- `useComponentDefaultsService(name, rawProps)` (`services/componentDefaultsService.ts`) wraps the props in a Proxy that resolves each read with `resolveComponentDefault` (`lib/componentDefaults.ts`).
- The layer comes from `useComponentDefaultsRepository()`: a scoped layer provided under `ProviderName.componentDefaults` (a ref, getter or plain object, already merged with its parent) replaces the app-level `appState.defaults`. `SDefaultsProvider` provides one: `mergeComponentDefaults(outer, props.defaults)` (`lib/componentDefaults.ts`), where `outer` is the layer it injects itself, so nested providers merge per component and per prop (`global` too) instead of replacing each other.
- Defaults live in the reactive app store, so changing them at runtime re-renders affected components.
- Tests: `tests/services/componentDefaultsService.test.ts`, `tests/lib/componentDefaults.test.ts`.

## Adding a component

Call `useComponentDefaultsService('SX', rawProps)`, add `SX: PropsX` to `ComponentPropsMap`, and add `SX` to the matching `globalComponentDefaultTargets` lists if it has a preset-scale `size`, `borderRadius`, `rounded`, `elevation`, accent `color` or a `density` it renders (`useDensityService`).
