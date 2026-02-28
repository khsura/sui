# Card Components

**Import:** `import { SCard, SCardTitle, SCardSubtitle, SCardText, SCardActions } from '@khsura/sui'`

Elevated surface with structured slots for title, content, and actions.

---

## SCard

Root card container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Background color |
| `elevation` | `0–24` | `2` | Box shadow depth |
| `outlined` | `boolean` | `false` | Border instead of shadow |
| `underlined` | `boolean` | `false` | Bottom border only |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Border radius override |
| `tag` | `string` | `'div'` | Root HTML element |
| `href` | `string \| null` | `null` | Render as anchor |
| `to` | `RouteLocationRaw \| null` | `null` | Vue Router link |
| `width` / `height` | `string \| number` | `undefined` | Dimensions |
| `maxWidth` / `maxHeight` | `string \| number` | `undefined` | Max dimensions |
| `minWidth` / `minHeight` | `string \| number` | `undefined` | Min dimensions |
| `colorThreshold` | `number` | `undefined` | Auto text contrast |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Card content (use `SCardTitle`, `SCardText`, `SCardActions`) |

---

## SCardTitle

Styled heading area for the card.

**Slot:** `default` — title text/content.

---

## SCardSubtitle

Secondary heading below the title.

**Slot:** `default` — subtitle text/content.

---

## SCardText

Body content area with standard padding.

**Slot:** `default` — any content.

---

## SCardActions

Bottom action bar, typically containing buttons.

**Slot:** `default` — buttons and actions.

---

## Usage

```vue
<!-- Basic card -->
<SCard :max-width="400">
  <SCardTitle>Card Title</SCardTitle>
  <SCardText>
    This is the card body content. Any content can go here.
  </SCardText>
  <SCardActions>
    <SButton variant="text">Cancel</SButton>
    <SButton color="primary">Confirm</SButton>
  </SCardActions>
</SCard>

<!-- Card with subtitle -->
<SCard>
  <SCardTitle>User Profile</SCardTitle>
  <SCardSubtitle>Last active 2 hours ago</SCardSubtitle>
  <SCardText>Profile details...</SCardText>
</SCard>

<!-- Card with image -->
<SCard :max-width="340">
  <SImage src="/photo.jpg" :aspect-ratio="16/9" object-fit="cover" />
  <SCardTitle>Photo Title</SCardTitle>
  <SCardText>Description below the image.</SCardText>
  <SCardActions>
    <SButton variant="text" color="primary">Read More</SButton>
  </SCardActions>
</SCard>

<!-- Outlined card -->
<SCard outlined :elevation="0">
  <SCardTitle>Outlined</SCardTitle>
  <SCardText>No shadow, just border.</SCardText>
</SCard>

<!-- Colored card -->
<SCard color="primary" :elevation="4">
  <SCardTitle>Colored Card</SCardTitle>
  <SCardText>Text auto-contrasts against the background.</SCardText>
</SCard>

<!-- Clickable card (router link) -->
<SCard :to="{ name: 'detail', params: { id } }" :elevation="2">
  <SCardTitle>{{ item.name }}</SCardTitle>
  <SCardText>Click to view details</SCardText>
</SCard>
```

## Notes

- Always use `SCardText` to wrap body text — it provides correct padding and typography.
- `SCardActions` right-aligns buttons by default; use `SSpacer` to push buttons to specific sides.
- Setting `to` or `href` makes the entire card clickable as a link.
