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

| Component | Notes | Examples |
|-----------|--------|----------|
| **SButton** | `color`, `variant` (fab\|text\|icon), `size`, `loading`, `block`, `rounded`, `outlined`, `disabled`, `href`, `to` | [examples.md](./examples.md#sbutton) |
| **SCard** | `SCardTitle`, `SCardSubtitle`, `SCardText`, `SCardActions`; use `SSpacer` in actions for right-align | [examples.md](./examples.md#scard) |
| **SDialog** | `v-model`, `#activator`, `location` (bottom sheet), `fullscreen`, `persistent` | [examples.md](./examples.md#sdialog) |
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
| **SToggleButtonGroup** | `v-model`, `multiple`; `SToggleButton value="..."` | [examples.md](./examples.md#stogglebuttongroup) |

---

When answering: use [examples.md](./examples.md) for the exact snippet; give a complete, idiomatic example for the user's use case.
