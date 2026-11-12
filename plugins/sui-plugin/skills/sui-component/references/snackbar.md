# SSnackbar

**Import:** `import { SSnackbar } from '@khsura/sui'`

Brief, non-blocking message fixed to the bottom (default) or top of the screen. Offsets itself above an `SBottomNavigation` / below an `SAppBar` from the layout.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsSnackbar.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `timeout` | `number \| null` | `undefined` | Auto-close after N ms. Unset/`0` = stays until `v-model` is set to `false` |
| `location` | `'bottom' \| 'top' \| null` | `undefined` (bottom) | Screen edge |
| `multiLine` | `boolean \| null` | `false` | Wrap long text instead of truncating with ellipsis |
| `disabled` | `boolean` | `false` | Passed to the activator via `attrs` |

## Model

`v-model: boolean` — visibility. The timeout restarts each time it becomes `true`.

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `activator` | `{ on, attrs }` | Optional trigger; bind both `v-on="on"` and `v-bind="attrs"` |
| `default` | — | Message |
| `action` | — | Buttons on the right |

## Events

None — use `v-model`.

## Usage

```vue
<SButton @click="saved = true">Save</SButton>
<SSnackbar v-model="saved" :timeout="4000">Item saved.</SSnackbar>

<SSnackbar v-model="offline" location="top">
  Connection lost.
  <template #action>
    <SButton variant="text" color="primary" @click="retry">Retry</SButton>
    <SButton variant="icon" @click="offline = false"><SIcon icon="mdi-close" /></SButton>
  </template>
</SSnackbar>

<SSnackbar v-model="error" multi-line>
  A longer message that needs to wrap onto multiple lines.
</SSnackbar>
```

## Gotchas

- No `color` prop — colors come from the theme's `snackbar` color.
- `outlined`, `underlined` and `borderRadius` appear in the prop types but are not applied.
- Without `timeout`, provide a close action in `#action`.
- Single-line by default: long text is cut with an ellipsis — use `multi-line`.
- The app must be wrapped in `<SApp>` (the snackbar teleports into its overlay container).
