---
name: sui-docs
description: Reference for SUI utility classes (s_*), Vue directives (v-scroll, etc.), and SCSS helpers (s_getPresetColor, s_getAppColor, mixins). Use when the user asks about CSS classes, breakpoints, spacing, display, flex, directives, or SCSS functions/mixins from @khsura/sui.
argument-hint: [classes | directives | helpers | or a specific topic]
---

Use the SUI documentation files in this project to answer questions about utility classes, directives, and SCSS helpers.

## Documentation files

- **Utility classes** (spacing, display, flex, grid, typography, colors, etc.): [docs/classes.md](docs/classes.md)
- **Vue directives** (v-scroll, etc.): [docs/directives.md](docs/directives.md)
- **SCSS helpers** (functions, mixins, variables): [docs/helpers.md](docs/helpers.md)

When the user asks about:
- **CSS utility classes** (e.g. `s_pa__4`, `s_display__flex`, breakpoints, spacing) → read and use [docs/classes.md](docs/classes.md)
- **Directives** (e.g. `v-scroll`, `v-scroll.self`) → read and use [docs/directives.md](docs/directives.md)
- **SCSS** (e.g. `s_getPresetColor`, `s_getAppColor`, mixins) → read and use [docs/helpers.md](docs/helpers.md)

All utilities are from `@khsura/sui`. Import base styles with `import '@khsura/sui/base.css'` or `import '@khsura/sui/style.scss'`; use `@use '@khsura/sui/helpers' as *` for SCSS helpers.
