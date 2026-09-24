---
name: sui-utilities
description: Reference for SUI utility classes (s_*), Vue directives (v-scroll, etc.), and SCSS helpers (s_getPresetColor, s_getAppColor, mixins). Use when the user asks about CSS classes, breakpoints, spacing, display, flex, directives, SCSS functions/mixins, or how to restyle a SUI component from @khsura/sui.
argument-hint: [classes | directives | helpers | or a specific topic]
---

Answer questions about SUI utility classes, directives, and SCSS helpers with the reference files bundled in this skill.

## Reference files

- **Utility classes** (spacing, display, flex, grid, typography, colors, etc.): [docs/classes.md](docs/classes.md)
- **Vue directives** (v-scroll, etc.): [docs/directives.md](docs/directives.md)
- **SCSS helpers** (functions, mixins, variables): [docs/helpers.md](docs/helpers.md)

When the user asks about:
- **CSS utility classes** (e.g. `s_pa__4`, `s_display__flex`, breakpoints, spacing) → read [docs/classes.md](docs/classes.md)
- **Directives** (e.g. `v-scroll`, `v-scroll.self`) → read [docs/directives.md](docs/directives.md)
- **SCSS** (e.g. `s_getPresetColor`, `s_getAppColor`, mixins) → read [docs/helpers.md](docs/helpers.md)

## Imports

| What | Import | Notes |
|---|---|---|
| Utility classes + component styles | `import '@khsura/sui/base.css'` (or `@khsura/sui/style.scss`) | Loaded automatically by the Nuxt module |
| SCSS functions / mixins | `@use '@khsura/sui/helpers.scss' as *;` | Emits no CSS; keep the `.scss` extension |

## Restyling SUI components — try these before `:deep(.s_*)`

Overriding internal classes (`:deep(.s_input__input)`, `.s_button { … !important }`) is the most common source of breakage after a SUI update, because internal class names and structure are not a public API. In order of preference:

1. **A prop** — `color`, `size`, `dense`, `outlined` / `underlined` / `borderRadius`, `elevation`, `width` / `maxWidth`, `inputBackground` / `placeholderBackground` (SInput, STextarea).
2. **An app-wide default** — `createSUI({ components: { SInput: { dense: true } } })` (see **sui-getting-started**).
3. **Theme colors** — change `themes.light/dark.presetColors` / `appColors` instead of recoloring elements one by one.
4. **Utility classes** on the component root — spacing, display, typography from [docs/classes.md](docs/classes.md).
5. Only then a scoped `:deep()` override. Keep it narrow, use `s_getPresetColor` / `s_getAppColor` for colors, never hard-code hex values or use `!important`. Add a comment naming the missing prop so it can become a library feature.

Built-in state styling you should not re-implement: focus outlines, disabled colors, and the red error frame on form inputs (shown even with `hideError` / `hideDetails`).
