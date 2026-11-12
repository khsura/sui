# SMenu

**Import:** `import { SMenu } from '@khsura/sui'`

Floating popup menu anchored to an activator element. Clicking the activator toggles it; clicking outside closes it. Supports list content, cards, and any custom content.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `location` | `string \| string[]` | `undefined` | `'top'`, `'bottom'`, `'left'`, `'right'` (combinable, e.g. `'bottom right'`). **Unset = the menu opens over its activator** — pass `location="bottom"` for a dropdown |
| `closeOnContentClick` | `boolean` | `false` | Close menu when its content is clicked |
| `closeOnScroll` | `boolean` | `false` | Close menu on window scroll |
| `closeOnClick` | `boolean` | — | Declared in the type but has no effect — outside clicks always close the menu |
| `position` | `'fixed' \| 'absolute' \| ...` | `undefined` | `'fixed'` positions relative to the viewport (use inside fixed/scrolling containers) |
| `offsetX` | `number \| null` | `undefined` | Extra horizontal offset (px) |
| `offsetY` | `number \| null` | `undefined` | Extra vertical offset (px) |
| `screenPadding` | `number \| null` | `undefined` | Shift the menu left by this many px when it would overflow the right edge |
| `contentClass` | `string \| string[] \| Record<string, boolean>` | `undefined` | Classes on the content element |
| `contentStyle` | `StyleValue` | `undefined` | Styles on the content element |
| `preventCloseOnClick` | `boolean` | `false` | Activator click only opens, never closes |
| `disabled` | `boolean` | `false` | Passed to the activator via `attrs` (disables the trigger element) |
| `width` / `height` | `string \| number` | `undefined` | Menu dimensions |
| `maxWidth` / `maxHeight` | `string \| number` | `undefined` | Max dimensions |
| `minWidth` / `minHeight` | `string \| number` | `undefined` | Min dimensions (min-width defaults to the activator's width) |

## Model

`v-model` — `boolean` controlling open/closed state (optional; the menu also works uncontrolled). The position is computed only when the model turns `true`.

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `activator` | `{ on, attrs }` | Trigger element — bind `v-on="on"` and `v-bind="attrs"` |
| `default` | — | Menu content |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Emitted whenever the model changes to `false` |

## Usage

```vue
<!-- Menu with list items, closes on item click -->
<SMenu location="bottom" close-on-content-click>
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Actions</SButton>
  </template>
  <SList>
    <SListItem link @click="edit">Edit</SListItem>
    <SListItem link @click="remove">Delete</SListItem>
  </SList>
</SMenu>

<!-- Controlled via v-model -->
<SMenu v-model="menuOpen" location="bottom">
  <template #activator="{ on, attrs }">
    <SButton variant="icon" v-on="on" v-bind="attrs">
      <SIcon icon="mdi-dots-vertical" />
    </SButton>
  </template>
  <SList>
    <SListItem>Option A</SListItem>
    <SListItem>Option B</SListItem>
  </SList>
</SMenu>

<!-- Stays open while interacting with the content (the default) -->
<SMenu location="bottom">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Filter</SButton>
  </template>
  <SCard :width="250" :elevation="2">
    <SCardText>…form controls…</SCardText>
  </SCard>
</SMenu>

<!-- Top position -->
<SMenu location="top">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Up</SButton>
  </template>
  <SList><SListItem>Item</SListItem></SList>
</SMenu>
```

## Notes

- Always bind `v-on="on"` AND `v-bind="attrs"` to the activator for proper accessibility.
- Always set `location` (e.g. `location="bottom"`); without it the menu covers its activator.
- `closeOnContentClick` defaults to `false` — add `close-on-content-click` for action menus that should close when an item is clicked.
- The position is computed only when `v-model` turns `true`; opening with `:model-value="true"` on first render is not positioned — open it after mount.
- The app must be wrapped in `<SApp>` (menus teleport into its overlay container).
- `position="fixed"` is useful when the activator is inside a fixed or scrollable container.
