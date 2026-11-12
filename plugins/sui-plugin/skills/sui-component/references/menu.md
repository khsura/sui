# SMenu

**Import:** `import { SMenu } from '@khsura/sui'`

Floating popup anchored to an activator. Clicking the activator toggles it; clicking outside closes it.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsMenu.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `location` | `string \| string[]` | `undefined` | `'bottom'`, `'top'`, `'left'`, `'right'` (combinable, e.g. `'bottom right'`). **Unset = opens over the activator** |
| `closeOnContentClick` | `boolean` | `false` | Close when the menu content is clicked |
| `closeOnScroll` | `boolean` | `false` | Close on window scroll |
| `position` | `'fixed' \| 'absolute' \| ...` | `undefined` | `'fixed'` positions relative to the viewport (use inside fixed containers) |
| `offsetX` / `offsetY` | `number \| null` | `undefined` | Extra offset in px |
| `screenPadding` | `number \| null` | `undefined` | Shift left by this many px when the menu would overflow the right edge |
| `contentClass` | `string \| string[] \| Record<string, boolean>` | `undefined` | Classes on the content element |
| `contentStyle` | `StyleValue` | `undefined` | Styles on the content element |
| `preventCloseOnClick` | `boolean` | `false` | Activator click only opens, never closes |
| `disabled` | `boolean` | `false` | Passed to the activator via `attrs` (disables the trigger) |
| `width` / `height` / `min*` / `max*` | `string \| number` | `undefined` | Content dimensions (min-width defaults to activator width) |

## Model

`v-model: boolean` — optional; the menu works uncontrolled too.

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `activator` | `{ on, attrs }` | Trigger. Bind **both** `v-on="on"` and `v-bind="attrs"` |
| `default` | — | Menu content |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Emitted whenever the model changes to `false` |

## Usage

```vue
<SMenu location="bottom" close-on-content-click>
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Actions</SButton>
  </template>
  <SList>
    <SListItem @click="edit">Edit</SListItem>
    <SListItem @click="remove">Delete</SListItem>
  </SList>
</SMenu>

<!-- Filters: stays open while interacting (default) -->
<SMenu v-model="filtersOpen" location="bottom">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Filter</SButton>
  </template>
  <SCard :width="250"><SCardText>…form controls…</SCardText></SCard>
</SMenu>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SMenu>` without `location` | `location="bottom"` — otherwise the menu covers its activator |
| Expecting a click on an item to close the menu | Add `close-on-content-click` (it defaults to off) |
| `v-on="on"` only | Bind both `v-on="on"` and `v-bind="attrs"` |
| `:model-value="true"` on first render | Position is computed only when the model flips to `true`; open it after mount |

- The app must be wrapped in `<SApp>` (menus teleport into its overlay container).
- `closeOnClick` exists in the prop types but has no effect; outside clicks always close the menu.
