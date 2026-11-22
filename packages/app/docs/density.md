# Density

One switch for a tighter (admin) look, instead of overriding heights and paddings per call site:

```ts
app.use(createSUI({ defaults: { global: { density: 'compact' } } }))
```

| Density       | Field / button height | List row | Table row | SToolbar   |
| ------------- | --------------------- | -------- | --------- | ---------- |
| `default`     | 36px (today's look)   | 48px     | 48px      | 64px       |
| `comfortable` | 32px                  | 44px     | 44px      | 56px       |
| `compact`     | 28px                  | 40px     | 40px      | 48px       |

One step removes 4px (`$s_density__step`); SToolbar keeps its own 8px steps. Density never makes a component larger
than `default` (the Vuetify / Material scale).

## Components

`density` is a prop of SInput, STextarea, SNumberInput, SFileInput, SSelect, SAutocomplete, SButton, SChip, SList,
SListItem, STable (body and header rows) and SToolbar. `defaults.global.density` reaches exactly these
(`globalComponentDefaultTargets` in `configs/componentDefaults.ts`). Fields and SButton shrink by the same amount, so
a field and a button in one SFormRow stay level at every density. SListItem follows its SList unless it sets its own
`density`; SSelect and SAutocomplete pass theirs to their dropdown list. A dropzone SFileInput and bottom-navigation
buttons ignore density.

## Precedence

1. An explicit `density` prop on the element.
2. `defaults.SButton.density` (component default).
3. `defaults.global.density`.
4. `default`.

The older `dense` boolean props keep working unchanged and are independent of `density`: `dense` alone renders
exactly as before. With both, the tighter rule wins where they overlap (a `dense` SSelect, list item or table cell
keeps its own height; SInput's `dense` still only narrows the horizontal padding while `density` lowers the height).

## Implementation

- `useDensityService(props)` (`services/densityService.ts`) returns the resolved `density` and `classListDensity`.
  `default` adds no class, so none of the density CSS applies and the default look is byte-for-byte the old one.
- The `s_density()` SCSS mixin (`styles/mixins/_density.scss`) scopes rules to `.s_density--comfortable` /
  `.s_density--compact` and sets `--s-density-offset` (-4px / -8px) for them.
- Stories: `UI Components/Density/Stress` (compact and comfortable next to a default reference, with a play that
  checks the heights and SFormRow alignment). Tests: `tests/services/densityService.test.ts`.
