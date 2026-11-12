# Card Components

**Import:** `import { SCard, SCardTitle, SCardSubtitle, SCardText, SCardActions } from '@khsura/sui'`

A card surface with structured sections for title, content, and actions. `SCard` is its own component (it is not built on `SSheet`) and has **no shadow by default** — set `elevation` for one.

---

## SCard

Root card container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Background color (preset/app color name or CSS color) |
| `colorThreshold` | `number` | `undefined` | Luminance threshold used to pick light/dark text on a custom color |
| `theme` | `'light' \| 'dark'` | `undefined` | Force light/dark text styling |
| `elevation` | `0–24` | `undefined` (no shadow) | Box shadow depth |
| `outlined` | `boolean` | `false` | Border |
| `underlined` | `boolean` | `false` | Bottom border only |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Border radius override |
| `tag` | `string` | `'div'` | Root HTML element (ignored when `href`/`to` is set) |
| `href` | `string` | `undefined` | Render as `<a>` |
| `to` | `RouteLocationRaw \| null` | `undefined` | Render as `router-link` |
| `target` | `'_blank' \| '_self' \| '_parent' \| '_top'` | `undefined` | Link target |
| `rel` | `string` | `undefined` | Link rel |
| `width` / `height` | `string \| number` | `undefined` | Dimensions |
| `maxWidth` / `maxHeight` | `string \| number` | `undefined` | Max dimensions |
| `minWidth` / `minHeight` | `string \| number` | `undefined` | Min dimensions |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Card content (use `SCardTitle`, `SCardSubtitle`, `SCardText`, `SCardActions`, `SImage`, …) |

### Events

None declared. Native listeners such as `@click` fall through to the root element.

---

## SCardTitle / SCardSubtitle / SCardText / SCardActions

Each takes only `tag` (default `'div'`) and a `default` slot.

| Component | Purpose |
|-----------|---------|
| `SCardTitle` | Heading area, padded |
| `SCardSubtitle` | Secondary line below the title, padded |
| `SCardText` | Body content area with standard padding |
| `SCardActions` | Flex row (vertically centered) for buttons. Items are **left-aligned** |

---

## Usage

```vue
<!-- Basic card -->
<SCard :max-width="400" :elevation="2">
  <SCardTitle>Card Title</SCardTitle>
  <SCardText>
    This is the card body content. Any content can go here.
  </SCardText>
  <SCardActions>
    <SSpacer />
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
<SCard :max-width="340" :elevation="2">
  <SImage src="/photo.jpg" :aspect-ratio="16/9" object-fit="cover" />
  <SCardTitle>Photo Title</SCardTitle>
  <SCardText>Description below the image.</SCardText>
  <SCardActions>
    <SButton variant="text" color="primary">Read More</SButton>
  </SCardActions>
</SCard>

<!-- Outlined card -->
<SCard outlined>
  <SCardTitle>Outlined</SCardTitle>
  <SCardText>No shadow (the default), just a border.</SCardText>
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
- `SCard` has no shadow unless you set `elevation`.
- `SCardActions` left-aligns its items; put `<SSpacer />` first to push buttons to the right.
- Setting `to` or `href` makes the entire card clickable as a link.
