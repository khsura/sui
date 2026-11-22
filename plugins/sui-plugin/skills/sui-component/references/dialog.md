# SDialog

**Import:** `import { SDialog } from '@khsura/sui'`

Modal with a scrim, controlled by `v-model`. Centered by default; `location="bottom"` gives a bottom sheet; `fullscreen` fills the viewport. Background page scroll is locked while open.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsDialog.d.ts`

<!-- generated:api:start SDialog -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SDialog props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activator` | `string \| ComponentPublicInstance \| HTMLElement \| null` | — | no | — |
| `borderless` | `boolean` | — | no | — |
| `closeOnClick` | `boolean` | — | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `elevation` | `"" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| "13" \| "14" \| "15" \| "16" \| "17" \| "18" \| "19" \| "20" \| "21" \| "22" \| "23" \| "24" \| 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| 13 \| 14 \| 15 \| 16 \| 17 \| 18 \| 19 \| 20 \| 21 \| 22 \| 23 \| 24 \| null` | — | no | — |
| `fullscreen` | `boolean` | — | no | — |
| `height` | `number \| string \| null` | — | no | — |
| `location` | `LocationRaw` | — | no | — |
| `maxHeight` | `number \| string \| null` | — | no | — |
| `maxWidth` | `number \| string \| null` | — | no | — |
| `minHeight` | `number \| string \| null` | — | no | — |
| `minWidth` | `number \| string \| null` | — | no | — |
| `modelValue` | `boolean` | — | no | — |
| `offsetX` | `number \| null` | — | no | — |
| `offsetY` | `number \| null` | — | no | — |
| `persistent` | `boolean` | — | no | — |
| `preventCloseOnClick` | `boolean` | — | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `scrollable` | `boolean` | — | no | — |
| `scrollableBackground` | `boolean` | — | no | — |
| `width` | `number \| string \| null` | — | no | — |
| `zIndex` | `number` | — | no | — |

**SDialog slots**

| Slot | Slot props |
| --- | --- |
| `activator` | `{ on: { click: () => void; }; attrs: Partial<PropsRequired<{ disabled: boolean \| null \| undefined; readonly: boolean \| null \| undefined; }>>; }` |
| `default` | `{}` |

**SDialog events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: boolean \| undefined]` |

<!-- generated:api:end SDialog -->

**SDialog notes**

- `persistent`: Clicking outside does not close the dialog
- `scrollable`: With an `SCard` child: title/actions stay fixed, `SCardText` scrolls
- `fullscreen`: Fill the viewport
- `location`: Only `'bottom'` has an effect (bottom sheet); anything else = centered
- `elevation`: Shadow depth (a light shadow is applied by default)
- `zIndex`: z-index of the overlay layer
- `disabled`: Passed to the activator via `attrs` (disables the trigger)
- `width` / `height`: Content dimensions
- `maxWidth` / `maxHeight` / `minWidth` / `minHeight`: Constraints (max-height defaults to 90% when not fullscreen). `width`, `maxWidth` and `maxHeight` are capped at the viewport, so `:max-width="420"` still leaves a 12px gutter on a phone
- `activator` (slot): Trigger. Bind **both** `v-on="on"` and `v-bind="attrs"`
- `default` (slot): Dialog content

## Model

`v-model: boolean` — open/closed.

## Events

None — use `v-model`.

## Usage

```vue
<SDialog v-model="isOpen" :max-width="480">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs" color="primary">Open</SButton>
  </template>
  <SCard>
    <SCardTitle>Confirm</SCardTitle>
    <SCardText>Are you sure?</SCardText>
    <SCardActions>
      <SButton variant="text" @click="isOpen = false">Cancel</SButton>
      <SButton color="primary" @click="confirm">OK</SButton>
    </SCardActions>
  </SCard>
</SDialog>

<!-- Programmatic -->
<SButton @click="sheet = true">Open sheet</SButton>
<SDialog v-model="sheet" location="bottom">
  <SCard><SCardText>Bottom sheet</SCardText></SCard>
</SDialog>

<!-- Long content -->
<SDialog v-model="terms" scrollable :max-width="500">
  <SCard>
    <SCardTitle>Terms</SCardTitle>
    <SCardText>…long text…</SCardText>
    <SCardActions><SButton @click="terms = false">Close</SButton></SCardActions>
  </SCard>
</SDialog>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SDialog title="Confirm">` | No `title` prop — use `SCardTitle` inside an `SCard` |
| Plain text / `<div>` as the only child | The dialog has **no background** — wrap content in `SCard` or `SSheet` |
| `v-on="on"` only | Bind both `v-on="on"` and `v-bind="attrs"` |
| `persistent` with no close button | Always provide an explicit close action |

- The app must be wrapped in `<SApp>`: dialogs teleport into the overlay container `SApp` renders.
- Keyboard and screen readers are handled: the content has `role="dialog"` and `aria-modal="true"`, focus moves into the dialog on open, Tab stays inside it, Esc closes it (not when `persistent`), and focus returns to the activator on close. Esc with a menu open inside the dialog closes only the menu. There is no `close` event — watch `v-model`.
- A `fullscreen` dialog pads by the iPhone safe-area insets on all sides and fills them with the card colour (needs `viewport-fit=cover`, see the getting-started skill). Don't add your own `env(safe-area-inset-*)` padding to it.
- `borderless`, `scrollableBackground` and `closeOnClick` appear in the prop types but currently have no effect — do not rely on them.
