# SEmptyState

**Import:** `import { SEmptyState } from '@khsura/sui'`

The "nothing here yet" block: an icon or illustration, a short title, a sentence that says why it is empty or what to do next, and an optional action button, centred in a column. It renders a plain `<div class="s_emptyState">` with no role, so it reads as ordinary text; the icon and image are decorative. Use it on an empty page or card, in the `#noData` slot of `STable`, and in the `#noData` slot of `SSelect` and `SAutocomplete`.

Live examples: [SEmptyState in Storybook](https://sui.surakh.com/?path=/docs/ui-components-emptystate--docs)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `MaterialDesignIcon` | `undefined` | Icon above the title, such as `mdi-inbox-outline`. Ignored when `image` is set |
| `image` | `string` | `undefined` | Illustration URL above the title. Wins over `icon`. Decorative (`alt=""`) |
| `title` | `string` | `undefined` | Short headline, such as `No orders yet`. Plain text, not a heading element |
| `text` | `string` | `undefined` | Supporting sentence under the title |
| `actionText` | `string` | `undefined` | Label of the built-in primary button. The button only renders when this is set |
| `color` | `string` | `undefined` | Colour of the icon only (preset or CSS colour). There is no background colour |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` (`default`) | Scales the padding, icon, image, title and text, and the action button |
| `theme` | `'light' \| 'dark'` | `undefined` | Per-component theme override |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `action` | `Event` | The built-in action button was clicked |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `media` | — | Replaces the icon or image, such as an illustration component. Keep it decorative |
| `title` | — | Replaces `title` |
| `text` | — | Replaces `text` |
| `default` | — | Extra content between the text and the actions |
| `actions` | — | Replaces the built-in button, such as two `SButton`s or a link |

Each part renders only when its prop or slot is set, so an `SEmptyState` with just a `title` is a single line.

## Usage

```vue
<SEmptyState
  icon="mdi-inbox-outline"
  title="No orders yet"
  text="Orders you create appear here."
  action-text="Create order"
  @action="openNewOrder"
/>

<!-- Two actions -->
<SEmptyState icon="mdi-account-multiple-outline" title="No members">
  <template #actions>
    <SButton color="primary" @click="invite">Invite</SButton>
    <SButton variant="text" to="/help/members">Learn more</SButton>
  </template>
</SEmptyState>

<!-- In a table's no-data row; without the slot the row keeps its plain noDataText -->
<STable :headers="headers" :items="[]">
  <template #noData>
    <SEmptyState size="small" icon="mdi-cart-outline" title="No orders yet" />
  </template>
</STable>

<!-- In a select or an autocomplete menu: opt-in, an empty menu stays blank without it -->
<SSelect label="Warehouse" :items="[]">
  <template #noData>
    <SEmptyState size="mini" icon="mdi-warehouse" title="No warehouses" />
  </template>
</SSelect>
<SAutocomplete :items="items" no-data-text="No match" />
```

## Responsive sizing

The block takes the full width of its parent and never grows wider: the title and text wrap (also an unbroken word or URL), stay under `32rem`, and the image shrinks to the width it has. The padding and the icon are capped by the viewport width (`6vw` and `20vw`), so on a 375px phone even `size="extra"` fits. Use `size="small"` or `"mini"` inside a table cell or a menu. The sizes come from `!default` SCSS maps (`$s_emptyState--paddings`, `$s_emptyState__icon--fontSizes`, `$s_emptyState__image--widths`, `$s_emptyState__title--fontSizes`, `$s_emptyState__text--fontSizes`).

## Accessibility

- No role and no Tab stop of its own: screen readers read the title and text in order. The only interactive part is the action button, a native `<button>` (Tab, Enter and Space) with the usual focus ring.
- The icon (`aria-hidden`) and the image (`alt=""`) are decorative, so put the meaning in `title` and `text`, not in the picture.
- The title is not a heading, so it does not break the page outline inside a table cell or a menu. When the empty state is the main content of a page and needs a heading, put one in the `title` slot: `<template #title><h2>No orders yet</h2></template>`.
- In `SSelect` and `SAutocomplete` the no-data content sits outside the listbox in a `role="status"` element, so it is announced but never offered as an option.
- The title uses the `text` colour and the text the `secondaryText` colour, which keep 4.5:1 contrast in the light and the dark theme.

## Notes

- There is no `headline`, `bgColor`, `justify`, `textWidth`, `href` or `to` prop (Vuetify's `VEmptyState` has them). Put a link in the `actions` slot, and give the parent the background.
- `color` colours the icon, not a background.
- `action-text` without an `@action` listener renders a button that does nothing. For navigation use the `actions` slot with `<SButton to="…">`.
- An `image` wins over `icon`; set one, not both.
