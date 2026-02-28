# SDialog

**Import:** `import { SDialog } from '@khsura/sui'`

Modal/dialog overlay. Supports bottom sheets, centered dialogs, and fullscreen modes. Controlled via `v-model`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `persistent` | `boolean` | `false` | Prevent closing by clicking the scrim |
| `scrollable` | `boolean` | `false` | Allow inner content to scroll independently |
| `fullscreen` | `boolean` | `false` | Full-screen dialog |
| `borderless` | `boolean` | `false` | Remove border/shadow from dialog container |
| `scrollableBackground` | `boolean` | `false` | Allow the background to scroll while dialog is open |
| `closeOnClick` | `boolean` | `true` | Close when the scrim is clicked |
| `location` | `string` | `undefined` | Dialog position: `'top'`, `'bottom'`, `'left'`, `'right'`, or centered (default) |
| `elevation` | `0–24` | `undefined` | Box shadow depth of dialog container |
| `disabled` | `boolean` | `false` | Disable opening the dialog |
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

<!-- Scrollable content -->
<SDialog v-model="scrollDialog" scrollable :max-width="500">
  <SCard>
    <SCardTitle>Long Content</SCardTitle>
    <SCardText style="max-height: 300px; overflow-y: auto;">
      <!-- Long content here -->
    </SCardText>
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

- Use `location="bottom"` to create a bottom sheet pattern.
- `persistent` prevents scrim-click from closing — always provide an explicit close action.
- Dialogs can be nested (a dialog opened from inside another dialog).
