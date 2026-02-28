# SMenu

**Import:** `import { SMenu } from '@khsura/sui'`

Floating popup menu anchored to an activator element. Supports list content, cards, and any custom content.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `closeOnContentClick` | `boolean` | `true` | Close menu when its content is clicked |
| `closeOnScroll` | `boolean` | `false` | Close menu on page scroll |
| `closeOnClick` | `boolean` | `true` | Close menu when clicking outside |
| `location` | `string` | `'bottom'` | Anchor position: `'top'`, `'bottom'`, `'left'`, `'right'` |
| `position` | `'fixed' \| 'absolute'` | `'absolute'` | CSS positioning strategy |
| `offsetX` | `number \| null` | `null` | Horizontal offset from anchor (px) |
| `offsetY` | `number \| null` | `null` | Vertical offset from anchor (px) |
| `screenPadding` | `number \| null` | `null` | Minimum distance from viewport edge (px) |
| `disabled` | `boolean` | `false` | Prevent menu from opening |
| `width` / `height` | `string \| number` | `undefined` | Menu dimensions |
| `maxWidth` / `maxHeight` | `string \| number` | `undefined` | Max dimensions |
| `minWidth` / `minHeight` | `string \| number` | `undefined` | Min dimensions |

## Model

`v-model` — `boolean` controlling open/closed state.

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `activator` | `{ on, attrs }` | Trigger element — bind `v-on="on"` and `v-bind="attrs"` |
| `default` | — | Menu content |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Emitted when menu closes |

## Usage

```vue
<!-- Menu with list items -->
<SMenu>
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Actions</SButton>
  </template>
  <SList>
    <SListItem @click="edit">Edit</SListItem>
    <SListItem @click="remove">Delete</SListItem>
  </SList>
</SMenu>

<!-- Controlled via v-model -->
<SMenu v-model="menuOpen">
  <template #activator="{ on, attrs }">
    <SIcon icon="mdi-dots-vertical" v-on="on" v-bind="attrs" />
  </template>
  <SList>
    <SListItem>Option A</SListItem>
    <SListItem>Option B</SListItem>
  </SList>
</SMenu>

<!-- Keep open after content click -->
<SMenu :close-on-content-click="false">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Filter</SButton>
  </template>
  <SCard :width="250">
    <SCardText>
      <SCheckbox v-model="filter1" label="Option 1" />
      <SCheckbox v-model="filter2" label="Option 2" />
    </SCardText>
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
- Set `close-on-content-click="false"` for menus containing forms, checkboxes, or multi-step content.
- `position="fixed"` is useful when the activator is inside a scrollable container.
