# SSnackbar

**Import:** `import { SSnackbar } from '@khsura/sui'`

Brief, non-blocking message fixed to the bottom (default) or top of the screen. Offsets itself above an `SBottomNavigation` / below an `SAppBar` from the layout.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsSnackbar.d.ts`

<!-- generated:api:start SSnackbar -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SSnackbar props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activator` | `string \| ComponentPublicInstance \| HTMLElement \| null` | — | no | — |
| `borderRadius` | `` number \| "rounded" \| "tile" \| `${number}%` \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `location` | `"bottom" \| "top" \| null` | — | no | `bottom`, `top` |
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
    <SButton variant="text" @click="retry">Retry</SButton>
    <SButton variant="icon" @click="offline = false"><SIcon icon="mdi-close" /></SButton>
  </template>
</SSnackbar>

<SSnackbar v-model="error" multi-line>
  A longer message that needs to wrap onto multiple lines.
</SSnackbar>
```

## Gotchas

- No `color` prop — colors come from the theme's `snackbar` color.
- The snackbar is dark (`#424242`) in both themes. Give a `variant="text"` (or `variant="icon"`) action **no** `color`: it takes the snackbar's light text colour, so the readable action is `<SButton variant="text">Undo</SButton>`. Since 1.20.0 a preset `color` (`warning`, `primary`, ...) inside the snackbar uses a variant that reaches 4.5:1 on it, but adds nothing over the default. A CSS colour (`color="#1976d2"`) is used as is, so pick a light one such as `color="#ffffff"`. Before 1.20.0 an action without `color` kept the page's dark text colour (about 1.3:1) and `primary`, `secondary`, `success`, `info` and `error` were below 4.5:1 (`primary` 2.18:1), so use `color="warning"` or a light CSS colour there.
- One snackbar per location: two open at the same `location` overlap. Show one at a time (or one `top`, one bottom); a queue component for stacking is planned.
- `outlined`, `underlined` and `borderRadius` appear in the prop types but are not applied.
- Without `timeout`, provide a close action in `#action`.
- Single-line by default: long text is cut with an ellipsis — use `multi-line`.
- The app must be wrapped in `<SApp>` (the snackbar teleports into its overlay container).
- On an iPhone with `viewport-fit=cover` the snackbar clears the home indicator (or the notch with `location="top"`) by itself.
