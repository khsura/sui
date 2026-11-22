# SSnackbar

**Import:** `import { SSnackbar } from '@khsura/sui'`

Brief, non-blocking notification message fixed to the bottom (default) or top of the screen. Offsets itself above an `SBottomNavigation` / below an `SAppBar` from the layout. There is **no `color` prop** — colors come from the theme's `snackbar` color.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `timeout` | `number \| null` | `undefined` | Auto-dismiss delay in milliseconds. Unset/`0`/`null` = stays until `v-model` is set to `false` |
| `location` | `'bottom' \| 'top' \| null` | `undefined` (bottom) | Screen edge |
| `multiLine` | `boolean \| null` | `false` | Wrap long text instead of truncating it with an ellipsis |
| `disabled` | `boolean` | `false` | Passed to the activator via `attrs` |
| `outlined` | `boolean` | `false` | Declared in the type but **ignored** |
| `underlined` | `boolean` | `false` | Declared in the type but **ignored** |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Declared in the type but **ignored** |

## Model

`v-model` — `boolean` controlling visibility. The timeout restarts each time it becomes `true`.

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `activator` | `{ on, attrs }` | Optional trigger element; bind both `v-on="on"` and `v-bind="attrs"` |
| `default` | — | Notification message |
| `action` | — | Action button(s) shown alongside the message |

## Events

None (state managed via `v-model`).

## Usage

```vue
<!-- Programmatic snackbar -->
<SButton @click="snackbar = true">Show notification</SButton>

<SSnackbar v-model="snackbar" :timeout="4000">
  Item saved successfully.
</SSnackbar>

<!-- With action button -->
<SSnackbar v-model="snackbar" :timeout="6000">
  Connection lost.
  <template #action>
    <SButton variant="text" color="primary" @click="retry">Retry</SButton>
  </template>
</SSnackbar>

<!-- Top position -->
<SSnackbar v-model="snackbar" location="top" :timeout="3000">
  Profile updated.
</SSnackbar>

<!-- Multi-line -->
<SSnackbar v-model="snackbar" multi-line :timeout="5000">
  This is a longer message that spans
  multiple lines for better readability.
</SSnackbar>

<!-- With close button -->
<SSnackbar v-model="snackbar">
  Changes saved.
  <template #action>
    <SButton variant="icon" @click="snackbar = false">
      <SIcon icon="mdi-close" />
    </SButton>
  </template>
</SSnackbar>
```

## Notes

- Without `timeout` the snackbar stays visible until `v-model` is set to `false` — provide a close action in `#action`.
- Single-line by default: long text is cut with an ellipsis — use `multi-line`.
- No `color` prop; `outlined`, `underlined` and `borderRadius` are not applied.
- Give a `variant="text"` (or `variant="icon"`) action no `color`: it takes the snackbar's light text colour, so it is readable on the dark snackbar. A preset `color` (`warning`, `primary`, ...) inside the snackbar uses a variant that reaches 4.5:1 on the snackbar, not the darker page variant. A CSS colour (`color="#1976d2"`) is used as is, so pick a light one.
- One snackbar per location: two open at the same `location` overlap. Show one at a time; a queue component for stacking is planned.
- The app must be wrapped in `<SApp>` (the snackbar teleports into its overlay container).
- On an iPhone with `viewport-fit=cover`, the snackbar sits above the home indicator (and above a bottom navigation), or below the notch with `location="top"`. Without a safe area the inset is `0px`.
- A `timeout` of `4000`–`6000` ms is recommended for most use cases.
- For error messages, prefer no auto-dismiss so users can read the full message.
