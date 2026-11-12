# SDialog

**Import:** `import { SDialog } from '@khsura/sui'`

Modal with a scrim, controlled by `v-model`. Centered by default; `location="bottom"` gives a bottom sheet; `fullscreen` fills the viewport. Background page scroll is locked while open.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsDialog.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `persistent` | `boolean` | `false` | Clicking outside does not close the dialog |
| `scrollable` | `boolean` | `false` | With an `SCard` child: title/actions stay fixed, `SCardText` scrolls |
| `fullscreen` | `boolean` | `false` | Fill the viewport |
| `location` | `string \| string[]` | `undefined` | Only `'bottom'` has an effect (bottom sheet); anything else = centered |
| `elevation` | `0–24 \| ''` | `undefined` | Shadow depth (a light shadow is applied by default) |
| `zIndex` | `number` | `undefined` | z-index of the overlay layer |
| `disabled` | `boolean` | `false` | Passed to the activator via `attrs` (disables the trigger) |
| `width` / `height` | `string \| number` | `undefined` | Content dimensions |
| `maxWidth` / `maxHeight` / `minWidth` / `minHeight` | `string \| number` | `undefined` | Constraints (max-height defaults to 90% when not fullscreen) |

## Model

`v-model: boolean` — open/closed.

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `activator` | `{ on, attrs }` | Trigger. Bind **both** `v-on="on"` and `v-bind="attrs"` |
| `default` | — | Dialog content |

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
- There is no Escape-key handling and no `close` event.
- `borderless`, `scrollableBackground` and `closeOnClick` appear in the prop types but currently have no effect — do not rely on them.
