# SMenu

**Import:** `import { SMenu } from '@khsura/sui'`

Floating popup anchored to an activator. Clicking the activator toggles it; clicking outside closes it.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsMenu.d.ts`

<!-- generated:api:start SMenu -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SMenu props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activator` | `string \| HTMLElement \| ComponentPublicInstance \| null` | — | no | — |
| `closeOnClick` | `boolean` | — | no | — |
| `closeOnContentClick` | `boolean` | — | no | — |
| `closeOnScroll` | `boolean` | — | no | — |
| `contentClass` | `string \| string[] \| Record<string, boolean>` | — | no | — |
| `contentStyle` | `StyleValue` | — | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `height` | `string \| number \| null` | — | no | — |
| `location` | `LocationRaw` | — | no | — |
| `maxHeight` | `string \| number \| null` | — | no | — |
| `maxWidth` | `string \| number \| null` | — | no | — |
| `minHeight` | `string \| number \| null` | — | no | — |
| `minWidth` | `string \| number \| null` | — | no | — |
| `modelValue` | `boolean` | — | no | — |
| `offsetX` | `number \| null` | — | no | — |
| `offsetY` | `number \| null` | — | no | — |
| `position` | `Position` | — | no | `absolute`, `fixed`, `relative`, `static`, `sticky` |
| `preventCloseOnClick` | `boolean` | — | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `screenPadding` | `number \| null` | — | no | — |
| `width` | `string \| number \| null` | — | no | — |

**SMenu slots**

| Slot | Slot props |
| --- | --- |
| `activator` | `{ on: { click: () => void; }; attrs: Partial<PropsRequired<{ disabled: boolean \| null \| undefined; readonly: boolean \| null \| undefined; }>>; }` |
| `default` | `{}` |

**SMenu events**

| Event | Payload |
| --- | --- |
| `close` | `[]` |
| `update:modelValue` | `[value: boolean \| undefined]` |

<!-- generated:api:end SMenu -->

**SMenu notes**

- `location`: `'bottom'`, `'top'`, `'left'`, `'right'` (combinable, e.g. `'bottom right'`). **Unset = opens over the activator**
- `closeOnContentClick`: Close when the menu content is clicked
- `closeOnScroll`: Close on window scroll
- `position`: `'fixed'` positions relative to the viewport (use inside fixed containers)
- `offsetX` / `offsetY`: Extra offset in px
- `screenPadding`: Shift left by this many px when the menu would overflow the right edge
- `contentClass`: Classes on the content element
- `contentStyle`: Styles on the content element
- `preventCloseOnClick`: Activator click only opens, never closes
- `disabled`: Passed to the activator via `attrs` (disables the trigger)
- `width` / `height` / `min*` / `max*`: Content dimensions (min-width defaults to activator width)
- `activator` (slot): Trigger. Bind **both** `v-on="on"` and `v-bind="attrs"`
- `default` (slot): Menu content
- `close` (event): Emitted whenever the model changes to `false`

## Model

`v-model: boolean` — optional; the menu works uncontrolled too.

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
