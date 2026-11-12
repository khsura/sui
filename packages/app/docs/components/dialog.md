# SDialog

**Import:** `import { SDialog } from '@khsura/sui'`

Modal/dialog overlay with a scrim. Centered by default; `location="bottom"` gives a bottom sheet; `fullscreen` fills the viewport. Controlled via `v-model`. Background page scroll is locked while open.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `persistent` | `boolean` | `false` | Clicking outside does not close the dialog |
| `scrollable` | `boolean` | `false` | With an `SCard` child: title/actions stay fixed, `SCardText` scrolls |
| `fullscreen` | `boolean` | `false` | Full-screen dialog |
| `borderless` | `boolean` | `false` | Declared, but has no styling (no visible effect) |
| `scrollableBackground` | `boolean` | `false` | Declared, but has no effect — background scroll is always locked |
| `closeOnClick` | `boolean` | `false` | Declared, but has no effect — use `persistent` to stop outside clicks closing it |
| `location` | `string \| string[]` | `undefined` | Only `'bottom'` has an effect (bottom sheet); anything else = centered |
| `zIndex` | `number` | `undefined` | z-index of the overlay layer |
| `elevation` | `0–24` | `undefined` | Box shadow depth of dialog container |
| `disabled` | `boolean` | `false` | Passed to the activator via `attrs` (disables the trigger element) |
| `width` / `height` | `string \| number` | `undefined` | Dialog dimensions |
| `maxWidth` / `maxHeight` | `string \| number` | `undefined` | Max dimensions |
| `minWidth` / `minHeight` | `string \| number` | `undefined` | Min dimensions |

## Model

`v-model` — `boolean` controlling open/closed state.

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `activator` | `{ on, attrs }` | Trigger element — bind `v-on="on"` and `v-bind="attrs"` |
| `default` | — | Dialog content |

## Events

None (state managed via `v-model`).

## Usage

```vue
<!-- With activator slot (self-contained) -->
<SDialog v-model="isOpen">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs" color="primary">Open Dialog</SButton>
  </template>
  <SCard :max-width="480">
    <SCardTitle>Confirm</SCardTitle>
    <SCardText>Are you sure?</SCardText>
    <SCardActions>
      <SButton @click="isOpen = false">Cancel</SButton>
      <SButton color="primary" @click="confirm">OK</SButton>
    </SCardActions>
  </SCard>
</SDialog>

<!-- Programmatic (no activator) -->
<SButton @click="dialog = true">Open</SButton>
<SDialog v-model="dialog">
  <SCard>Dialog content</SCard>
</SDialog>

<!-- Bottom sheet -->
<SDialog v-model="sheet" location="bottom">
  <SCard>
    <SCardText>Bottom sheet content</SCardText>
  </SCard>
</SDialog>

<!-- Fullscreen -->
<SDialog v-model="fullscreen" fullscreen>
  <SCard>
    <SCardTitle>Full Screen</SCardTitle>
    <SCardText>Content…</SCardText>
  </SCard>
</SDialog>

<!-- Scrollable content: title and actions stay fixed, SCardText scrolls -->
<SDialog v-model="scrollDialog" scrollable :max-width="500">
  <SCard>
    <SCardTitle>Long Content</SCardTitle>
    <SCardText>
      <!-- Long content here -->
    </SCardText>
    <SCardActions>
      <SButton @click="scrollDialog = false">Close</SButton>
    </SCardActions>
  </SCard>
</SDialog>

<!-- Persistent (cannot close by clicking outside) -->
<SDialog v-model="persistent" persistent>
  <SCard>
    <SCardText>You must confirm or cancel.</SCardText>
    <SCardActions>
      <SButton @click="persistent = false">Close</SButton>
    </SCardActions>
  </SCard>
</SDialog>
```

## Notes

- Use `location="bottom"` to create a bottom sheet pattern; `'top'`/`'left'`/`'right'` have no effect (the dialog stays centered).
- `persistent` prevents outside clicks from closing — always provide an explicit close action.
- The dialog has no background of its own — wrap content in `SCard` or `SSheet`.
- The app must be wrapped in `<SApp>`: dialogs teleport into the overlay container `SApp` renders.
- There is no Escape-key handling and no `close` event.
- Dialogs can be nested (a dialog opened from inside another dialog).
