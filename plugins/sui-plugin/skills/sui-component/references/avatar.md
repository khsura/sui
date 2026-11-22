# SAvatar

**Import:** `import { SAvatar } from '@khsura/sui'`

A round picture of a person or thing. It shows the `image`; when there is no image or it fails to load, the `text` initials; without those, the `icon` (`mdi-account` by default). Use it instead of a hand-built `<div>` + `<img>`. For overlapping avatars with a "+N", see [avatar-group.md](avatar-group.md).

Types: `node_modules/@khsura/sui/@types/definitions/props/propsAvatar.d.ts`

Docs: https://sui.surakh.com/?path=/docs/ui-components-avatar--docs

<!-- generated:api:start SAvatar -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SAvatar props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `alt` | `string` | — | no | — | Accessible name of the avatar, usually the person's name. Used as the image `alt` and as the `aria-label`. Leave it empty for a decorative avatar. |
| `borderRadius` | `` number \| "tile" \| "rounded" \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}%` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — | — |
| `color` | `string` | — | no | — | — |
| `colorThreshold` | `number` | — | no | — | — |
| `icon` | `string` | — | no | — | Material Design icon shown when there is neither an image nor text. Defaults to `mdi-account`. |
| `image` | `string` | — | no | — | Image URL. When it is missing or fails to load, the avatar shows `text`, then `icon`. Do not put an `<img>` in the slot. |
| `outlined` | `boolean \| null` | — | no | — | — |
| `size` | `SizePropertyUnionType` | — | no | — | — |
| `text` | `string` | — | no | — | Initials shown when there is no image or it fails to load. Keep it to 1–3 characters, such as `JD`, not a full name. |
| `theme` | `AppThemeType` | — | no | `dark`, `light` | — |

**SAvatar slots**

| Slot | Slot props |
| --- | --- |
| `default` | `any` |

**SAvatar events**

None.

<!-- generated:api:end SAvatar -->

**SAvatar notes**

- `size`: a preset (`mini` 24 px, `small` 32, `default` 40, `large` 48, `extra` 56) or any length (`64`, `'4rem'`). In an `SAvatarGroup` the group's size is the default.
- `borderRadius`: round by default; `rounded` gives rounded corners, `tile` square ones.
- `outlined`: a border in `color` and no background.
- `alt` sets `role="img"` and `aria-label`; without it the avatar is decorative and its initials are read as text.

## Usage

```vue
<!-- Photo, falling back to initials, then the account icon -->
<SAvatar :image="user.photoUrl" :text="user.initials" :alt="user.name" color="primary" />

<SAvatar text="JD" color="secondary" size="small" />
<SAvatar icon="mdi-domain" outlined color="primary" />

<!-- Leading item of a list item, chip or card title: sized and spaced for you -->
<SListItem>
  <SAvatar :image="user.photoUrl" :alt="user.name" />
  <SListItemContent><SListItemTitle>{{ user.name }}</SListItemTitle></SListItemContent>
</SListItem>
<SChip><SAvatar text="JD" color="primary" /> Jane Doe</SChip>
<SCardTitle><SAvatar :image="user.photoUrl" :alt="user.name" /> {{ user.name }}</SCardTitle>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SAvatar><img :src="url" /></SAvatar>` (no fallback when it fails) | `<SAvatar :image="url" :text="initials" :alt="name" />` |
| `<SAvatar :src="url" />` (Vuetify / Quasar name) | `<SAvatar :image="url" />` |
| `<SAvatar text="Jane Doe" />` (clipped to "JA") | `<SAvatar text="JD" alt="Jane Doe" />` |
| `<SAvatar style="width: 64px; height: 64px">` (font and icon keep the old size) | `<SAvatar :size="64">` |
| `<SAvatar rounded="0">` / `tile` (Vuetify props) | `<SAvatar border-radius="tile">` |
| `<SImage … style="border-radius: 50%">` for a user picture | `<SAvatar :image="url" :alt="name" />` |
| `<div class="avatar" style="border-radius:50%;background:…">JD</div>` | `<SAvatar text="JD" color="primary" />` |
