# List Components

**Import:** `import { SList, SListItem, SListItemTitle, SListItemSubtitle, SListItemIcon, SListItemAction, SListItemContent, SListItemGroup } from '@khsura/sui'`

Flexible list/menu layout components for navigation, options, and data display.

---

## SList

Root list container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `divided` | `boolean` | `false` | Render dividers between items |
| `lines` | `number \| null` | `null` | Line-clamp for item text |
| `outlined` | `boolean` | `false` | Outlined border style |
| `dense` | `boolean` | `false` | Compact item height |
| `link` | `boolean` | `false` | Apply hover/active states to all items |
| `inset` | `boolean` | `false` | Inset dividers (indent from left) |
| `text` | `boolean` | `false` | Text-only color mode |
| `color` | `string` | `undefined` | Background color |
| `tag` | `'ul' \| 'ol' \| 'div'` | `'div'` | Root HTML element |

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SListItem` elements and `SListItemGroup` |

---

## SListItem

Single row in the list.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lines` | `number \| null` | `null` | Line-clamp override for this item |
| `selectable` | `boolean` | `false` | Highlight as selected |
| `link` | `boolean` | `false` | Hover/active styling |
| `disabled` | `boolean` | `false` | Disabled state |
| `href` | `string \| null` | `null` | Render as anchor |
| `to` | `RouteLocationRaw \| null` | `null` | Vue Router link |
| `tag` | `'li' \| 'div'` | `'div'` | Root element |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Item content (use sub-components below) |

---

## SListItemContent

Wraps the main text area within an item.

**Slot:** `default`

---

## SListItemTitle

Primary text line of an item.

**Slot:** `default`

---

## SListItemSubtitle

Secondary text line below the title.

**Slot:** `default`

---

## SListItemIcon

Icon area (left or right of content).

**Slot:** `default`

---

## SListItemAction

Action area (right side of item, for buttons/icons).

**Slot:** `default`

---

## SListItemGroup

Groups list items with optional selection.

---

## Usage

```vue
<!-- Basic list -->
<SList>
  <SListItem>Item 1</SListItem>
  <SListItem>Item 2</SListItem>
  <SListItem>Item 3</SListItem>
</SList>

<!-- With title and subtitle -->
<SList>
  <SListItem v-for="user in users" :key="user.id">
    <SListItemContent>
      <SListItemTitle>{{ user.name }}</SListItemTitle>
      <SListItemSubtitle>{{ user.email }}</SListItemSubtitle>
    </SListItemContent>
  </SListItem>
</SList>

<!-- With icons -->
<SList>
  <SListItem link @click="goHome">
    <SListItemIcon>
      <SIcon icon="mdi-home" />
    </SListItemIcon>
    <SListItemContent>
      <SListItemTitle>Home</SListItemTitle>
    </SListItemContent>
  </SListItem>
  <SListItem link @click="goSettings">
    <SListItemIcon>
      <SIcon icon="mdi-cog" />
    </SListItemIcon>
    <SListItemContent>
      <SListItemTitle>Settings</SListItemTitle>
    </SListItemContent>
  </SListItem>
</SList>

<!-- Divided list -->
<SList divided>
  <SListItem>Section 1</SListItem>
  <SListItem>Section 2</SListItem>
  <SListItem>Section 3</SListItem>
</SList>

<!-- Dense + outlined (used in menus) -->
<SList dense outlined>
  <SListItem link>Action 1</SListItem>
  <SListItem link>Action 2</SListItem>
  <SListItem link disabled>Disabled</SListItem>
</SList>

<!-- With action buttons -->
<SList>
  <SListItem v-for="file in files" :key="file.id">
    <SListItemIcon>
      <SIcon icon="mdi-file" />
    </SListItemIcon>
    <SListItemContent>
      <SListItemTitle>{{ file.name }}</SListItemTitle>
    </SListItemContent>
    <SListItemAction>
      <SButton variant="icon" @click="deleteFile(file)">
        <SIcon icon="mdi-delete" />
      </SButton>
    </SListItemAction>
  </SListItem>
</SList>

<!-- Router-linked items -->
<SList>
  <SListItem :to="{ name: 'dashboard' }" link>
    <SListItemTitle>Dashboard</SListItemTitle>
  </SListItem>
  <SListItem :to="{ name: 'profile' }" link>
    <SListItemTitle>Profile</SListItemTitle>
  </SListItem>
</SList>
```

## Notes

- `SList` with `link` prop applies hover styles to all items globally. Set `link` on individual `SListItem`s for selective hover behavior.
- `SListItemContent` should wrap `SListItemTitle` / `SListItemSubtitle` when using icons or actions alongside text.
- Inside `SMenu`, wrap content in `SList dense` for standard menu appearance.
