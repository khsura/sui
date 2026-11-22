# SDefaultsProvider

**Import:** `import { SDefaultsProvider } from '@khsura/sui'` (since 1.22.0; on older releases set `size` on each component)

Scopes component defaults (typed like `createSUI({ defaults })`) to a subtree: a dense filter bar or toolbar without `size="small"` on every component. Renderless: it renders only its slot, no wrapper element.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsDefaultsProvider.d.ts`

Docs: https://sui.surakh.com/?path=/docs/ui-components-defaultsprovider--docs

<!-- generated:api:start SDefaultsProvider -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SDefaultsProvider props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `defaults` | `ComponentDefaultsOptions` | — | no | — | Component defaults for everything inside, typed like `createSUI({ defaults })`: per component (`{ SButton: { size: 'small' } }`) and `global`. Merged onto the nearest outer layer (an outer `SDefaultsProvider` or the app-level defaults): inner wins per prop, explicit props still win over both. |

**SDefaultsProvider slots**

| Slot | Slot props |
| --- | --- |
| `default` | `any` |

**SDefaultsProvider events**

None.

<!-- generated:api:end SDefaultsProvider -->

**SDefaultsProvider notes**

- Resolution: explicit prop > nearest provider (merged onto outer providers and app defaults) > built-in default.
- Merges per component and per prop; `global` merges too. A component default from any layer beats `global` from any layer.
- `global` values only reach components that take that prop on the same scale (see the `component-defaults` guide).
- Reactive: changing `defaults` re-renders the subtree and nested providers.

## Usage

```vue
<SDefaultsProvider :defaults="{ global: { size: 'small' }, SInput: { dense: true }, SSelect: { dense: true } }">
  <SFormRow>
    <SInput v-model="query" label="Search" placeholder="Search orders" hide-details />
    <SSelect v-model="status" label="Status" placeholder="Any status" :items="statuses" hide-details />
    <SButton type="submit" color="primary">Apply</SButton>
  </SFormRow>
</SDefaultsProvider>
```

Recipe: `get_recipe('dense-toolbar')`.

## Gotchas

| ❌ | ✅ |
|----|----|
| `size="small"` repeated on every button and input of a toolbar | One `<SDefaultsProvider :defaults="{ global: { size: 'small' } }">` around it |
| `<SDefaultsProvider class="toolbar" style="display: flex">` (no element to style) | Put the flex container inside the provider |
| `:defaults="{ SButton: { size: undefined } }"` to drop an outer default | Set the value you want: `{ SButton: { size: 'default' } }` |
| `:defaults="{ size: 'small' }"` (top-level prop) | `:defaults="{ global: { size: 'small' } }"` or `{ SButton: { size: 'small' } }` |
| Wrapping the whole app in a provider | `createSUI({ defaults })` for app-wide defaults |
| `global: { size: 'small' }` and expecting `SSelect` to shrink (it has no `size`) | Add `SSelect: { dense: true }, SInput: { dense: true }` |
