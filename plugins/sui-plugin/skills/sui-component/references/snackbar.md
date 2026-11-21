# SSnackbar

**Import:** `import { SSnackbar } from '@khsura/sui'`

Brief, non-blocking message fixed to the bottom (default) or top of the screen. Offsets itself above an `SBottomNavigation` / below an `SAppBar` from the layout.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsSnackbar.d.ts`

<!-- generated:api:start SSnackbar -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SSnackbar props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activator` | `string \| HTMLElement \| ComponentPublicInstance \| null` | — | no | — |
| `borderRadius` | `` number \| "tile" \| "rounded" \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}%` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `location` | `"top" \| "bottom" \| null` | — | no | `bottom`, `top` |
| `modelValue` | `boolean` | — | no | — |
| `multiLine` | `boolean \| null` | — | no | — |
| `outlined` | `boolean \| null` | — | no | — |
| `preventCloseOnClick` | `boolean` | — | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `timeout` | `number \| null` | — | no | — |
| `underlined` | `boolean \| null` | — | no | — |

**SSnackbar slots**

| Slot | Slot props |
| --- | --- |
| `action` | `{}` |
| `activator` | `{ on: { click: () => void; }; attrs: Partial<PropsRequired<{ disabled: boolean \| null \| undefined; readonly: boolean \| null \| undefined; }>>; }` |
| `default` | `{}` |

**SSnackbar events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: boolean \| undefined]` |

<!-- generated:api:end SSnackbar -->

**SSnackbar notes**

- `timeout`: Auto-close after N ms. Unset/`0` = stays until `v-model` is set to `false`
- `location`: Screen edge (default: `undefined` (bottom))
- `multiLine`: Wrap long text instead of truncating with ellipsis
- `disabled`: Passed to the activator via `attrs`
- `activator` (slot): Optional trigger; bind both `v-on="on"` and `v-bind="attrs"`
- `default` (slot): Message
- `action` (slot): Buttons on the right

## Model

`v-model: boolean` — visibility. The timeout restarts each time it becomes `true`.

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
