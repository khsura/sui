# Toolbar Components

**Import:** `import { SToolbar, SToolbarTitle, SToolbarItem } from '@khsura/sui'`

Toolbar / app bar with an optional extension row.

---

## SToolbar

Main toolbar container. The root is a column flexbox: the main row, then the optional extension row.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Background color (preset or CSS). Child `SButton`s and `SToolbarTitle` adapt to it |
| `colorThreshold` | `number` | `undefined` | Auto text contrast threshold |
| `elevation` | `0–24` | `undefined` | Box shadow depth |
| `density` | `'default' \| 'comfortable' \| 'compact'` | `undefined` (acts as `'default'`) | Reduces the main row by 0 / 8 / 16 px and the extension by 0 / 4 / 8 px |
| `height` | `number \| string` | `64` | Main row height |
| `extended` | `boolean` | `false` | Show the extension row |
| `extensionHeight` | `number \| string` | `48` | Height of extension row |
| `extensionStyle` | `Record<string, string>` | `undefined` | Inline styles for the extension row |
| `extensionClass` | `string \| Record<string, boolean>` | `undefined` | CSS class for the extension row |
| `contentClass` / `contentStyle` | class / style | `undefined` | Class/style for the main content row |
| `position` | `'static' \| 'fixed' \| 'absolute' \| 'relative' \| 'sticky'` | `undefined` | CSS position |
| `tag` | `HtmlTagName` | `'div'` | Root HTML element (pass `tag="header"` for semantics) |
| `outlined` | `boolean \| null` | `undefined` | Outlined border style |
| `underlined` | `boolean \| null` | `undefined` | Underlined border style |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Border radius |

`title` is declared on the type but **never rendered** — use `SToolbarTitle`.

### Slots

| Slot | Description |
|------|-------------|
| `default` | Main row content (horizontal flex) |
| `prepend` | Separate **row above** the main row (not a left-side item) |
| `append` | Separate **row below** the main row and the extension (not a right-side item) |
| `extension` | Extension row below the main row (only shown with `extended`) |

### Events

None.

---

## SToolbarTitle

Toolbar heading text. Its color comes from the parent toolbar. Renders nothing when it has no slot content and no `text`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string \| null` | `undefined` | Title text (used when no slot is given) |
| `tag` | `HtmlTagName` | `'div'` | Root HTML element |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Title content |
| `text` | Alternative to the default slot |

---

## SToolbarItem

Exported, but it has no slot: it renders an empty element and **drops its children**. Place items directly in the toolbar's default slot instead.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `HtmlTagName` | `'div'` | Root HTML element |

---

## Usage

```vue
<!-- Basic app toolbar -->
<SToolbar color="primary" tag="header">
  <SButton variant="icon" @click="toggleDrawer">
    <SIcon icon="mdi-menu" />
  </SButton>
  <SToolbarTitle>My Application</SToolbarTitle>
  <SSpacer />
  <SButton variant="icon">
    <SIcon icon="mdi-magnify" />
  </SButton>
  <SButton variant="icon">
    <SIcon icon="mdi-dots-vertical" />
  </SButton>
</SToolbar>

<!-- With extension (e.g., tabs) -->
<SToolbar color="primary" extended>
  <SToolbarTitle text="Page Title" />
  <template #extension>
    <STabs v-model="activeTab" style="width: 100%">
      <STab :tab="0">Tab 1</STab>
      <STab :tab="1">Tab 2</STab>
    </STabs>
  </template>
</SToolbar>

<!-- Compact toolbar -->
<SToolbar color="surface" density="compact" outlined>
  <SToolbarTitle>Compact Bar</SToolbarTitle>
</SToolbar>

<!-- Inside SCard as header -->
<SCard>
  <SToolbar color="primary" density="comfortable">
    <SToolbarTitle>Card Header</SToolbarTitle>
    <SSpacer />
    <SButton variant="icon" @click="close">
      <SIcon icon="mdi-close" />
    </SButton>
  </SToolbar>
  <SCardText>Content</SCardText>
</SCard>
```

## Notes

- Buttons inside `SToolbar` automatically adapt their text color to contrast against the toolbar background.
- Use `SSpacer` (from layout) to push elements to the right; put left/right items in the default slot, not in `prepend`/`append` (those stack as rows).
- `extended` + `#extension` slot is the pattern for toolbars with tabs or search bars below the main row — without `extended` the extension row is not rendered.
- `tag` defaults to `div`, not `header`.
