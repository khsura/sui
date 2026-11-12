# Card Components

**Import:** `import { SCard, SCardTitle, SCardSubtitle, SCardText, SCardActions } from '@khsura/sui'`

A surface (`card` background, rounded corners, full width) with optional structured sections for title, subtitle, text, and actions.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsCard.d.ts`

---

## SCard

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Background: preset/app color name or CSS color |
| `colorThreshold` | `number` | `undefined` | Luminance threshold used to pick light/dark text on a custom color |
| `theme` | `'light' \| 'dark'` | `undefined` | Force light/dark text styling |
| `elevation` | `0`–`24` | `undefined` (no shadow) | Shadow depth |
| `outlined` | `boolean` | `false` | Border |
| `underlined` | `boolean` | `false` | Bottom border only |
| `borderRadius` | `'tile' \| 'rounded' \| number \| '<n>px' \| …` | `undefined` | Border radius override |
| `tag` | `string` | `'div'` | Root element (ignored when `href`/`to` is set) |
| `href` | `string` | `undefined` | Render as `<a>` |
| `to` | `RouteLocationRaw` | `undefined` | Render as `router-link` (takes precedence over `href`) |
| `target` | `'_blank' \| '_self' \| '_parent' \| '_top'` | `undefined` | Link target |
| `rel` | `string` | `undefined` | Link rel |
| `width` / `height` | `string \| number` | `undefined` | Dimensions |
| `maxWidth` / `maxHeight` | `string \| number` | `undefined` | Max dimensions |
| `minWidth` / `minHeight` | `string \| number` | `undefined` | Min dimensions |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Card content (`SCardTitle`, `SCardSubtitle`, `SCardText`, `SCardActions`, `SImage`, …) |

### Events

None declared. Native listeners such as `@click` fall through to the root element.

---

## SCardTitle / SCardSubtitle / SCardText / SCardActions

Each takes only `tag` (default `'div'`) and a `default` slot. No events.

| Component | Purpose |
|-----------|---------|
| `SCardTitle` | Heading (h6 typography), flex row, padded |
| `SCardSubtitle` | Secondary line under the title, padded |
| `SCardText` | Body text area, full width, padded |
| `SCardActions` | Flex row with vertical centering for buttons. Items are **left-aligned** |

Spacing between adjacent title → subtitle → text is tightened automatically.

---

## Usage

```vue
<SCard :max-width="400" :elevation="2">
  <SCardTitle>Card Title</SCardTitle>
  <SCardSubtitle>Last active 2 hours ago</SCardSubtitle>
  <SCardText>Body content.</SCardText>
  <SCardActions>
    <SSpacer />
    <SButton variant="text">Cancel</SButton>
    <SButton color="primary">Confirm</SButton>
  </SCardActions>
</SCard>

<!-- Image card -->
<SCard :max-width="340" :elevation="2">
  <SImage src="/photo.jpg" :aspect-ratio="16/9" object-fit="cover" />
  <SCardTitle>Photo Title</SCardTitle>
  <SCardText>Description below the image.</SCardText>
</SCard>

<SCard outlined>
  <SCardTitle>Outlined</SCardTitle>
</SCard>

<!-- Whole card is a router link -->
<SCard :to="{ name: 'detail', params: { id } }" :elevation="2">
  <SCardTitle>{{ item.name }}</SCardTitle>
</SCard>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| Expecting a shadow by default | SCard has no shadow by default. Set `:elevation="2"` (or use `outlined`) |
| Expecting `SCardActions` to right-align buttons | Put `<SSpacer />` first to push buttons right |
| Adding `outlined :elevation="0"` "to remove the shadow" | No shadow is the default. `outlined` alone is enough |
