# List Components

**Import:** `import { SList, SListItem, SListItemTitle, SListItemSubtitle, SListItemIcon, SListItemAction, SListItemContent, SListItemGroup } from '@khsura/sui'`

List layout for navigation, menus, options, and data rows. `SList` passes its props down to its children through provide/inject, so the sub-components only work inside the right parent (see Gotchas).

Types: `node_modules/@khsura/sui/@types/definitions/props/propsList.d.ts`, `propsListItem.d.ts`, `propsListMediaItem.d.ts`

---

## SList

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `divided` | `boolean` | `false` | Border between items |
| `lines` | `number` (1–6) | `undefined` | Line clamp for `SListItemSubtitle` (the subtitle clamps to 2 lines when this is unset) |
| `outlined` | `boolean` | `false` | Outlined border. `color` then sets the **text** color |
| `dense` | `boolean` | `false` | No list padding, 40px rows, dense title/icon/action |
| `link` | `boolean` | `false` | Hover style + pointer on every item |
| `text` | `boolean` | `false` | `color` sets the text color instead of the background |
| `color` | `string` | `undefined` | Background color (or text color with `outlined`/`text`) |
| `colorThreshold` | `number` | `undefined` | Contrast threshold for custom colors |
| `tag` | `'ul' \| 'ol' \| 'div'` | `'div'` | Root element |
| `inset` | `boolean` | `false` | Declared, but has no styling (no visible effect) |

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SListItem`, `SListItemGroup`, `SDivider`, … |

---

## SListItem

A flex row with a minimum height of 48px (40px when the list is `dense`).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `link` | `boolean` | `false` | Hover background + pointer (automatic when `href`/`to` is set) |
| `selectable` | `boolean` | `false` | Only sets `cursor: pointer`. It does **not** add selected styling |
| `lines` | `number` (1–6) | `undefined` | Subtitle line clamp for this item (overrides the list's `lines`) |
| `disabled` | `boolean` | `false` | Disabled state |
| `href` | `string` | `undefined` | Render as `<a>` |
| `to` | `RouteLocationRaw` | `undefined` | Render as `router-link` |
| `target` / `rel` | `string` | `undefined` | Link attributes |
| `tag` | `'li' \| 'div'` | `'div'` | Root element (when not a link) |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Item content |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `Event` | Item clicked |

---

## SListItemContent / SListItemTitle / SListItemSubtitle

`default` slot only, with no props.

- `SListItemContent` wraps the title and subtitle. It **must be inside an `SListItem`** (it throws otherwise).
- `SListItemTitle` is the primary line. It **must be inside an `SList`** (it throws otherwise).
- `SListItemSubtitle` is the secondary line, clamped to 2 lines by default. It **must be inside both `SList` and `SListItem`**.

## SListItemIcon / SListItemAction

Leading icon area and trailing action area. `default` slot.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alignCenter` | `boolean` | `false` | Vertically center the content |
| `dense` | `boolean` | `false` | Dense sizing (the parent list's `dense` takes precedence) |

---

## SListItemGroup

A collapsible sub-list. By default it renders a clickable header row (title, subtitle, chevron). The children are rendered in a nested `SList` that inherits the parent list's props. **It must be inside an `SList`.**

| Prop / Model | Type | Default | Description |
|--------------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Expanded state |
| `title` | `string \| null` | `null` | Header title |
| `subtitle` | `string \| null` | `null` | Header subtitle |

| Slot | Description |
|------|-------------|
| `activator` | Replaces the default header row (no slot props; toggle `v-model` yourself) |
| `default` | Items shown when expanded |

---

## Usage

```vue
<SList>
  <SListItem v-for="user in users" :key="user.id">
    <SListItemContent>
      <SListItemTitle>{{ user.name }}</SListItemTitle>
      <SListItemSubtitle>{{ user.email }}</SListItemSubtitle>
    </SListItemContent>
  </SListItem>
</SList>

<!-- Icons + actions -->
<SList divided>
  <SListItem v-for="file in files" :key="file.id">
    <SListItemIcon align-center><SIcon icon="mdi-file" /></SListItemIcon>
    <SListItemContent>
      <SListItemTitle>{{ file.name }}</SListItemTitle>
    </SListItemContent>
    <SListItemAction align-center>
      <SButton variant="icon" @click="deleteFile(file)"><SIcon icon="mdi-delete" /></SButton>
    </SListItemAction>
  </SListItem>
</SList>

<!-- Router links (hover styling is automatic) -->
<SList dense>
  <SListItem :to="{ name: 'dashboard' }">
    <SListItemContent><SListItemTitle>Dashboard</SListItemTitle></SListItemContent>
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

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SListItemTitle>` used outside an `SList` (e.g. in a card) | Throws `List props not found`. Use it only inside `SList` |
| `<SListItem><SListItemTitle/></SListItem>` with no content wrapper, then adding a subtitle | Wrap title + subtitle in `SListItemContent` |
| `<SListItem selectable>` expecting a selected highlight | Manage the active state yourself (e.g. a class), since `selectable` only changes the cursor |
| `<SListItemGroup>` used for single/multi selection | It only expands and collapses. Track selection yourself |
| `<SList inset>` | No effect |
