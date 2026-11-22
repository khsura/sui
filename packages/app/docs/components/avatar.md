# SAvatar

**Import:** `import { SAvatar } from '@khsura/sui'`

A round picture of a person or thing. It renders a `<div class="s_avatar">` that shows, in this order: the `image`, or the `text` initials when there is no image or it fails to load, or the `icon` (`mdi-account` by default). Use it instead of a hand-built `<div>` + `<img>`: that breaks when the image is missing.

To show several avatars that overlap, with a "+N" for the rest, wrap them in [`SAvatarGroup`](./avatar-group.md).

Live examples: [SAvatar in Storybook](https://sui.surakh.com/?path=/docs/ui-components-avatar--docs)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `string` | `undefined` | Image URL. When it is missing or fails to load, the avatar shows `text`, then `icon` |
| `alt` | `string` | `undefined` | Accessible name, usually the person's name. Sets `role="img"` and `aria-label`. Leave it empty for a decorative avatar |
| `text` | `string` | `undefined` | Initials, 1–3 characters (`JD`), shown when there is no image. Not a full name |
| `icon` | `string` | `'mdi-account'` | Material Design icon shown when there is neither an image nor text |
| `color` | `string` | `undefined` | Background color — preset name or CSS color (text and border color with `outlined`) |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra' \| number \| string` | `undefined` | Preset (24, 32, 40, 48, 56 px) or a custom size (`64`, `'4rem'`). Inside an `SAvatarGroup` the group's size is the default |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Shape. Round by default; `rounded` gives rounded corners, `tile` square corners |
| `outlined` | `boolean \| null` | `undefined` | A border in the current color and no background |
| `colorThreshold` | `number` | `undefined` | Auto text contrast threshold |
| `theme` | `AppThemeType` | `undefined` | Per-component theme override |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | — | Custom content. Replaces the image, text and icon, so the fallback no longer works |

## Events

None.

## Usage

```vue
<!-- A photo that falls back to the initials, then to the account icon -->
<SAvatar :image="user.photoUrl" :text="user.initials" :alt="user.name" color="primary" />

<!-- Initials only -->
<SAvatar text="JD" color="secondary" />

<!-- An icon -->
<SAvatar icon="mdi-domain" outlined color="primary" />

<!-- Sizes and shapes -->
<SAvatar size="small" text="S" />
<SAvatar :size="64" text="XL" />
<SAvatar border-radius="rounded" :image="logoUrl" alt="Acme" />

<!-- At the start of a list item, a chip or a card title: no extra classes needed -->
<SListItem>
  <SAvatar :image="user.photoUrl" :alt="user.name" />
  <SListItemContent>
    <SListItemTitle>{{ user.name }}</SListItemTitle>
  </SListItemContent>
</SListItem>

<SChip>
  <SAvatar text="JD" color="primary" />
  Jane Doe
</SChip>

<SCardTitle>
  <SAvatar :image="user.photoUrl" :alt="user.name" />
  {{ user.name }}
</SCardTitle>
```

## Accessibility

- With `alt`, the avatar has `role="img"` and `aria-label` set to `alt`, and its image or initials are hidden from screen readers. Set `alt` when the avatar is the only place the name appears.
- Without `alt`, the image has `alt=""` (decorative) and the initials are read as text. That is right when the name is next to the avatar, as in a list item.
- The avatar is not interactive and takes no focus. To make it clickable, put it in an `SButton` or a link.
- `useColorService` picks a text color with 4.5:1 contrast on `color`, so do not hard-code white text.

## Notes

- Do not put an `<img>` (or `SImage`) in the default slot: use `image`. A slotted image has no fallback when it fails to load.
- `text` is shown as given, in capitals and clipped to the circle, so pass initials (`JD`), not `Jane Doe`.
- The avatar never shrinks in a flex row, and it keeps its size in a list item and a card title. In an `SChip` it fits the chip height (with a 4 px inset) at every chip size.
- `size` takes a preset or any CSS length; avoid sizing it with a class or `style="width: …"`, which leaves the font and icon at the old size.
