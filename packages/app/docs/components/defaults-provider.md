# SDefaultsProvider

**Import:** `import { SDefaultsProvider } from '@khsura/sui'`

Scopes component defaults to a subtree, so a filter bar or a dense table toolbar can change size or variant without a prop on every component. It is renderless: it renders only its default slot, with no wrapper element and no role.

Live examples: [SDefaultsProvider in Storybook](https://sui.surakh.com/?path=/docs/ui-components-defaultsprovider--docs)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaults` | `ComponentDefaultsOptions` | `undefined` | Defaults for everything inside, typed like `createSUI({ defaults })`: per component (`{ SButton: { size: 'small' } }`) and `global` |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | — | The subtree the defaults apply to |

## Events

None.

## Usage

```vue
<!-- every SUI component inside that takes a preset size becomes small -->
<SDefaultsProvider :defaults="{ global: { size: 'small' } }">
  <SFormRow>
    <SInput label="Search" placeholder="Search orders" hide-details />
    <SButton color="primary">Apply</SButton>
  </SFormRow>
</SDefaultsProvider>

<!-- per component: only the buttons change -->
<SDefaultsProvider :defaults="{ SButton: { size: 'small', variant: 'text' } }">
  <div style="display: flex; gap: 8px">
    <SButton>Edit</SButton>
    <SButton>Archive</SButton>
  </div>
</SDefaultsProvider>
```

## How the layers merge

Resolution, for every prop a component reads:

1. an explicit prop on the component (`<SButton size="large">`) always wins;
2. the nearest `SDefaultsProvider`, already merged onto every provider above it and onto `createSUI({ defaults })`;
3. the component's built-in default.

Merging is per component and per prop, and `global` merges the same way:

```vue
<!-- createSUI({ defaults: { SButton: { variant: 'text' }, global: { color: 'primary' } } }) -->
<SDefaultsProvider :defaults="{ SButton: { size: 'large' }, global: { size: 'small' } }">
  <SDefaultsProvider :defaults="{ SButton: { size: 'mini' } }">
    <!-- size 'mini' (inner), variant 'text' (app), color 'primary' (app global) -->
    <SButton>Save</SButton>
  </SDefaultsProvider>
</SDefaultsProvider>
```

A component default (`defaults.SButton.size`) from any layer wins over a `global` value from any layer, as with `createSUI`. `global` values only reach the components listed for that prop (see [component-defaults.md](../component-defaults.md)). The provider is reactive: when `defaults` changes, the subtree and every nested provider re-render.

## Accessibility

Nothing to announce: it adds no element, role or focus stop. Smaller controls must still meet the 24 × 24 px target size (WCAG 2.5.8); `size: 'small'` buttons do, `size: 'mini'` icon buttons may not.

## Notes

- Setting a value to `undefined` does not remove an outer default. Set the value you want (`size: 'default'`) instead.
- It does not wrap its content, so it adds no layout box: put the flex or grid container inside it.
- Use it for a region (toolbar, filter bar, sidebar). For the whole app, use `createSUI({ defaults })`.
- `SSelect` has no `size`; in a dense filter bar add `SInput: { dense: true }, SSelect: { dense: true }` so the fields line up. Full example: the `dense-toolbar` recipe (MCP `get_recipe`).
