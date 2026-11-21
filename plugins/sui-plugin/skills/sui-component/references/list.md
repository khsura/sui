# List Components

**Import:** `import { SList, SListItem, SListItemTitle, SListItemSubtitle, SListItemIcon, SListItemAction, SListItemContent, SListItemGroup } from '@khsura/sui'`

List layout for navigation, menus, options, and data rows. `SList` passes its props down to its children through provide/inject, so the sub-components only work inside the right parent (see Gotchas).

Types: `node_modules/@khsura/sui/@types/definitions/props/propsList.d.ts`, `propsListItem.d.ts`, `propsListMediaItem.d.ts`

---

## SList

<!-- generated:api:start SList -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SList props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `dense` | `boolean \| null` | — | no | — |
| `divided` | `boolean` | — | no | — |
| `inset` | `boolean \| null` | — | no | — |
| `lines` | `number \| null` | — | no | — |
| `link` | `boolean \| null` | — | no | — |
| `outlined` | `boolean \| null` | — | no | — |
| `tag` | `"div" \| "ol" \| "ul" \| null` | — | no | `div`, `ol`, `ul` |
| `text` | `boolean \| null` | — | no | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |

**SList slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SList events**

None.

<!-- generated:api:end SList -->

**SList notes**

- `divided`: Border between items
- `lines`: Line clamp for `SListItemSubtitle` (the subtitle clamps to 2 lines when this is unset)
- `outlined`: Outlined border. `color` then sets the **text** color
- `dense`: No list padding, 40px rows, dense title/icon/action
- `link`: Hover style + pointer on every item
- `text`: `color` sets the text color instead of the background
- `color`: Background color (or text color with `outlined`/`text`)
- `colorThreshold`: Contrast threshold for custom colors
- `tag`: Root element (default: `'div'`)
- `inset`: Declared, but has no styling (no visible effect)
- `default` (slot): `SListItem`, `SListItemGroup`, `SDivider`, …

---

## SListItem

A flex row with a minimum height of 48px (40px when the list is `dense`).

<!-- generated:api:start SListItem -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SListItem props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean \| null` | — | no | — |
| `href` | `string` | — | no | — |
| `lines` | `number \| null` | — | no | — |
| `link` | `boolean \| null` | — | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `rel` | `string` | — | no | — |
| `selectable` | `boolean \| null` | — | no | — |
| `tag` | `"div" \| "li" \| null` | — | no | `div`, `li` |
| `target` | `"_blank" \| "_self" \| "_parent" \| "_top"` | — | no | `_blank`, `_parent`, `_self`, `_top` |
| `to` | `LinkLocation \| null` | — | no | — |

**SListItem slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SListItem events**

| Event | Payload |
| --- | --- |
| `click` | `[value: Event]` |

<!-- generated:api:end SListItem -->

**SListItem notes**

- `link`: Hover background + pointer (automatic when `href`/`to` is set)
- `selectable`: Only sets `cursor: pointer`. It does **not** add selected styling
- `lines`: Subtitle line clamp for this item (overrides the list's `lines`)
- `disabled`: Disabled state
- `href`: Render as `<a>`
- `to`: Render as `router-link` (plain `<a href>` without vue-router)
- `target` / `rel`: Link attributes
- `tag`: Root element (when not a link) (default: `'div'`)
- `default` (slot): Item content
- `click` (event): Item clicked

---

## SListItemContent / SListItemTitle / SListItemSubtitle

`default` slot only, with no props.

- `SListItemContent` wraps the title and subtitle. It **must be inside an `SListItem`** (it throws otherwise).
- `SListItemTitle` is the primary line. It **must be inside an `SList`** (it throws otherwise).
- `SListItemSubtitle` is the secondary line, clamped to 2 lines by default. It **must be inside both `SList` and `SListItem`**.

<!-- generated:api:start SListItemContent -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SListItemContent props**

None.

**SListItemContent slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SListItemContent events**

None.

<!-- generated:api:end SListItemContent -->

<!-- generated:api:start SListItemTitle -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SListItemTitle props**

None.

**SListItemTitle slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SListItemTitle events**

None.

<!-- generated:api:end SListItemTitle -->

<!-- generated:api:start SListItemSubtitle -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SListItemSubtitle props**

None.

**SListItemSubtitle slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SListItemSubtitle events**

None.

<!-- generated:api:end SListItemSubtitle -->

## SListItemIcon / SListItemAction

Leading icon area and trailing action area. `default` slot.

`SListItemContent` keeps a minimum width of `min(40%, 160px)`. When the icon and the actions leave less room than that (two text buttons on a phone), the list item moves the `SListItemAction` onto its own line below the text, aligned to the right edge, instead of squeezing the title to one letter. (Older versions squeezed it.)

<!-- generated:api:start SListItemIcon -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SListItemIcon props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `alignCenter` | `boolean \| null` | — | no | — |
| `dense` | `boolean \| null` | — | no | — |

**SListItemIcon slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SListItemIcon events**

None.

<!-- generated:api:end SListItemIcon -->

**SListItemIcon notes**

- `alignCenter`: Vertically center the content
- `dense`: Dense sizing (the parent list's `dense` takes precedence)

<!-- generated:api:start SListItemAction -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SListItemAction props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `alignCenter` | `boolean \| null` | — | no | — |
| `dense` | `boolean \| null` | — | no | — |

**SListItemAction slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SListItemAction events**

None.

<!-- generated:api:end SListItemAction -->

---

## SListItemGroup

A collapsible sub-list. By default it renders a clickable header row (title, subtitle, chevron). The children are rendered in a nested `SList` that inherits the parent list's props. **It must be inside an `SList`.**

<!-- generated:api:start SListItemGroup -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SListItemGroup props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | no | — |
| `subtitle` | `string \| null` | `null` | no | — |
| `title` | `string \| null` | `null` | no | — |

**SListItemGroup slots**

| Slot | Slot props |
| --- | --- |
| `activator` | `{}` |
| `default` | `{}` |

**SListItemGroup events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: boolean]` |

<!-- generated:api:end SListItemGroup -->

**SListItemGroup notes**

- `v-model`: Expanded state
- `title`: Header title
- `subtitle`: Header subtitle
- `activator` (slot): Replaces the default header row (no slot props; toggle `v-model` yourself)
- `default` (slot): Items shown when expanded

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
| Shrinking the actions (or the title's font) so two text buttons fit next to a long title on a phone | Not needed: the actions move below the text when it would get narrower than `min(40%, 160px)` |
