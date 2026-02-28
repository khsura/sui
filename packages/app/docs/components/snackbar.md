# SSnackbar

**Import:** `import { SSnackbar } from '@khsura/sui'`

Brief, non-blocking notification message shown at the top or bottom of the screen.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `timeout` | `number \| null` | `null` | Auto-dismiss delay in milliseconds. `null` = stay until manually closed |
| `location` | `'bottom' \| 'top' \| null` | `'bottom'` | Screen position |
| `multiLine` | `boolean \| null` | `false` | Allow message to wrap to multiple lines |
| `outlined` | `boolean` | `false` | Outlined border style |
| `underlined` | `boolean` | `false` | Underlined style |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Border radius |

## Model

`v-model` — `boolean` controlling visibility.

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `activator` | `{ on, attrs }` | Optional trigger element |
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

- `timeout="null"` keeps the snackbar visible until `v-model` is set to `false`.
- A `timeout` of `4000`–`6000` ms is recommended for most use cases.
- For error messages, prefer no auto-dismiss so users can read the full message.
