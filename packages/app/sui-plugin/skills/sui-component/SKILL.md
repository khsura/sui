---
name: sui-component
description: Look up and use any SUI component from @khsura/sui. Use when the user asks how to use a specific SUI component, needs a code example, or wants to know the props/slots/events for a component.
argument-hint: [component name or description of what you need]
---

Help the user use this SUI component: $ARGUMENTS

If the component name is unclear, ask. Then provide the correct import, key props, and a working example.

All imports come from `@khsura/sui`.

## Additional resources

- **Code examples** (all components, full snippets): [examples.md](./examples.md)
- **Skills docs**: [Extend Claude with skills](https://code.claude.com/docs/en/skills)

---

## Critical pattern: Activator slot

**SDialog, SMenu, STooltip, SSnackbar** use `#activator`. Always bind **both** `v-on` and `v-bind` on the trigger element:

```vue
<template #activator="{ on, attrs }">
  <SButton v-on="on" v-bind="attrs" color="primary">Open</SButton>
</template>
```

Full examples: [examples.md](./examples.md) (Activator, SDialog, SMenu, STooltip).

---

## Component index

## Non-existent components — do NOT use

These components do not exist in `@khsura/sui`. Using them will cause a runtime error. Verify every component name against the index below before writing code.

| Name | Status | Correct alternative |
|------|--------|---------------------|
| `SAlert` | Does NOT exist in `@khsura/sui` | Use `CoreAlert` (see below) |
| `SSkeletonLoader` | Does NOT exist in `@khsura/sui` | Use `SProgressCircular` with `indeterminate` prop, wrapped in a centered div |
| `SNavigationDrawer` | App-shell only — never in feature components | Use `SDialog` with `location="end"` for feature-level panels (see below) |
| `STextField` | Does NOT exist in `@khsura/sui` | Use `STextarea` (multi-line) or `SInput` (single-line) |

---

## SCSS color — invalid CSS variables

These CSS custom properties do **NOT** exist in `@khsura/sui`. Using them produces invisible/broken styles.

| ❌ Invalid | ✅ Correct SUI equivalent |
|---|---|
| `var(--s-color-on-surface)` | `s_getAppColor('text')` |
| `rgba(var(--s-color-on-surface), 0.6)` | `color-mix(in srgb, #{s_getAppColor('text')} 60%, transparent)` |
| `rgb(var(--s-color-primary))` | `s_getPresetColor('primary')` |
| `rgba(var(--s-color-warning), 0.1)` | `color-mix(in srgb, #{s_getPresetColor('warning')} 10%, transparent)` |
| `var(--s-color-outline)` | `s_getAppColor('border')` |
| `var(--s-color-surface-variant)` | `s_getAppColor('hover')` |
| `var(--s-color-on-primary)` | `s_getPresetColor('primary', true)` |
| `var(--s-onSurfaceVariant)` | `color-mix(in srgb, #{s_getAppColor('text')} 60%, transparent)` |

**Available `s_getPresetColor` keys:** `primary`, `secondary`, `error`, `warning`, `success`, `info`
**Available `s_getAppColor` keys:** `text`, `background`, `card`, `border`, `button`, `hover`, `disabled`, `snackbar`, `switch`

Use `color-mix(in srgb, #{fn()} N%, transparent)` for any opacity variant.

### CoreAlert — project component for alert/banner messages

`CoreAlert` is auto-imported from `apps/onetab/app/components/core/Alert.vue`.

```vue
<CoreAlert color="warning">
  Overlapping absence detected for this period.
</CoreAlert>
```

- **Props:** `color: 'warning' | 'error' | 'success' | 'info'`
- **Default slot:** all message content
- No `variant`, `icon`, or `title` props

---

## SNavigationDrawer — app-shell only

`SNavigationDrawer` may only be used at the **app shell level** (layout files). There is exactly one drawer per app.

**Do NOT use `SNavigationDrawer` inside feature components.** For feature-level slide-in panels, use `SDialog` instead:

```vue
<SDialog v-model="drawerOpen" location="end" :width="480">
  <!-- panel content -->
</SDialog>
```

---

## Component index

| Component | Notes | Examples |
|-----------|--------|----------|
| **SButton** | `color`, `variant` (fab\|text\|icon only — `outlined` is NOT a valid variant), `size`, `loading`, `block`, `rounded`, `disabled`, `href`, `to`. Use `color` prop for visual differentiation, not `outlined`. | [examples.md](./examples.md#sbutton) |
| **SCard** | `SCardTitle`, `SCardSubtitle`, `SCardText`, `SCardActions`; use `SSpacer` in actions for right-align | [examples.md](./examples.md#scard) |
| **SDialog** | `v-model`, `#activator`, `location` (bottom sheet), `fullscreen`, `persistent`. **ALWAYS wrap dialog content in `SCard` or `SSheet`** — SDialog has no background color, so unwrapped content appears transparent/broken. | [examples.md](./examples.md#sdialog) |
| **SMenu** | `#activator` + `SList` / `SListItem` | [examples.md](./examples.md#smenu) |
| **STooltip** | `text` prop, `#activator` | [examples.md](./examples.md#stooltip) |
| **SSnackbar** | `v-model`, `timeout`, `#action` slot | [examples.md](./examples.md#ssnackbar) |
| **SList** | `SListItem`, `SListItemIcon`, `SListItemContent`, `SListItemTitle`, `SListItemSubtitle`, `SListItemAction`; `link`, `:to` | [examples.md](./examples.md#slist) |
| **STabs + SWindow** | `v-model` ties tab value to `SWindowItem value` | [examples.md](./examples.md#stabs--swindow) |
| **SExpansionPanels** | `v-model` = `number[]` (open panel indexes) | [examples.md](./examples.md#sexpansionpanels) |
| **SChip / SBadge** | `SChip`: `closable`, `@click:close`; `SBadge`: wraps content, `content` badge text | [examples.md](./examples.md#schip--sbadge) |
| **SProgressLinear / SProgressCircular** | `model-value`, `indeterminate`, `color`, `size` (circular) | [examples.md](./examples.md#sprogresslinear--sprogresscircular) |
| **SDatePicker** | `v-model` string: `YYYY-MM-DD` (date) or `YYYY-MM` (month); `type="date"` \| `"month"` | [examples.md](./examples.md#sdatepicker) |
| **SBreadcrumbs** | `:items="[{ text, to?, disabled? }]"` | [examples.md](./examples.md#sbreadcrumbs) |
| **SStepper** | `SStepperStep` with `:step`, `:complete` | [examples.md](./examples.md#sstepper) |
| **SToggleButtonGroup / SToggleButton** | Group: `v-model` (array), `multiple`, `mandatory`, `dense`, `bordered`, `variant="inset"`, `selectedColor`, `outlined`, `underlined`, `borderRadius`; Button: uses **index** as primary identifier, `key` as fallback — **no `value` prop** | [examples.md](./examples.md#stogglebuttongroup) |

---

When answering: use [examples.md](./examples.md) for the exact snippet; give a complete, idiomatic example for the user's use case.
