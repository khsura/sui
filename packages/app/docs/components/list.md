# List Components

**Import:** `import { SList, SListItem, SListItemTitle, SListItemSubtitle, SListItemIcon, SListItemAction, SListItemContent, SListItemGroup } from '@khsura/sui'`

Flexible list/menu layout components for navigation, options, and data display.

---

## SList

Root list container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `divided` | `boolean` | `false` | Render a border between items |
| `lines` | `number \| null` (1–6) | `undefined` | Line clamp for `SListItemSubtitle` (the subtitle clamps to 2 lines when unset) |
| `outlined` | `boolean` | `false` | Outlined border style; `color` then sets the text color |
| `dense` | `boolean` | `false` | Compact list (40px rows, dense title/icon/action) |
| `link` | `boolean` | `false` | Hover style + pointer cursor on every item |
| `inset` | `boolean` | `false` | Declared, but has no styling (no visible effect) |
| `text` | `boolean` | `false` | `color` sets the text color instead of the background |
| `color` | `string` | `undefined` | Background color (text color with `outlined` / `text`) |
| `colorThreshold` | `number` | `undefined` | Contrast threshold for custom colors |
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
| `lines` | `number \| null` (1–6) | `undefined` | Subtitle line clamp for this item (overrides the list's `lines`) |
| `selectable` | `boolean` | `false` | Only sets `cursor: pointer` — it does **not** add selected styling |
| `link` | `boolean` | `false` | Hover background + pointer (automatic when `href`/`to` is set) |
| `disabled` | `boolean` | `false` | Disabled state |
| `href` | `string` | `undefined` | Render as `<a>` |
| `to` | `RouteLocationRaw \| null` | `undefined` | Render as `router-link` |
| `target` / `rel` | `string` | `undefined` | Link attributes |
| `tag` | `'li' \| 'div'` | `'div'` | Root element (when not a link) |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Item content (use sub-components below) |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `Event` | Item clicked |

---

## SListItemContent

Wraps the title and subtitle. No props. **Must be inside an `SListItem`** (throws otherwise).

**Slot:** `default`

---

## SListItemTitle

Primary text line of an item. No props. **Must be inside an `SList`** (throws otherwise).

**Slot:** `default`

---

## SListItemSubtitle

Secondary text line below the title, clamped to 2 lines by default (see `lines`). No props. **Must be inside both an `SList` and an `SListItem`** (throws otherwise).

**Slot:** `default`

---

## SListItemIcon / SListItemAction

Leading icon area and trailing action area (buttons/icons).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alignCenter` | `boolean` | `false` | Vertically center the content |
| `dense` | `boolean` | `false` | Dense sizing (the parent list's `dense` takes precedence) |

**Slot:** `default`

---

## SListItemGroup

A collapsible sub-list — it expands and collapses; it is **not** a selection group. By default it renders a clickable header row (title, subtitle, chevron); the children render in a nested `SList` that inherits the parent list's props. **Must be inside an `SList`.**

| Prop / Model | Type | Default | Description |
|--------------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Expanded state |
| `title` | `string \| null` | `null` | Header title |
| `subtitle` | `string \| null` | `null` | Header subtitle |

| Slot | Description |
|------|-------------|
| `activator` | Replaces the default header row (no slot props — toggle `v-model` yourself) |
| `default` | Items shown when expanded |

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

<!-- Router-linked items (hover styling is automatic) -->
<SList>
  <SListItem :to="{ name: 'dashboard' }">
    <SListItemContent><SListItemTitle>Dashboard</SListItemTitle></SListItemContent>
  </SListItem>
  <SListItem :to="{ name: 'profile' }">
    <SListItemContent><SListItemTitle>Profile</SListItemTitle></SListItemContent>
  </SListItem>
</SList>

<!-- Collapsible group -->
<SList>
  <SListItemGroup v-model="settingsOpen" title="Settings">
    <SListItem link @click="openProfile">
      <SListItemContent><SListItemTitle>Profile</SListItemTitle></SListItemContent>
    </SListItem>
  </SListItemGroup>
</SList>
```

## Notes

- `SList` with `link` prop applies hover styles to all items globally. Set `link` on individual `SListItem`s for selective hover behavior.
- `SListItemContent` should wrap `SListItemTitle` / `SListItemSubtitle` when using icons or actions alongside text.
- `SListItemTitle` / `SListItemSubtitle` throw when used outside an `SList` (e.g. directly in a card).
- `selectable` only changes the cursor — track and style the active item yourself.
- `SListItemGroup` only expands/collapses; it does not track selection.
- Inside `SMenu`, wrap content in `SList dense` for standard menu appearance.
