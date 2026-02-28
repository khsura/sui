# Toolbar Components

**Import:** `import { SToolbar, SToolbarTitle, SToolbarItem } from '@khsura/sui'`

Application bar / toolbar with optional extension area.

---

## SToolbar

Main toolbar container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Background color |
| `elevation` | `0–24` | `undefined` | Box shadow depth |
| `density` | `ToolbarDensityType` | `'default'` | Height density: `'default'`, `'comfortable'`, `'compact'` |
| `extended` | `boolean` | `false` | Enable extension area below toolbar |
| `extensionHeight` | `number \| string` | `undefined` | Height of extension area |
| `extensionStyle` | `Record<string, string>` | `undefined` | Inline styles for extension |
| `extensionClass` | `string \| Record<string, boolean>` | `undefined` | CSS class for extension |
| `height` | `number \| string` | `undefined` | Override toolbar height |
| `title` | `string` | `undefined` | Quick title (shorthand for `SToolbarTitle`) |
| `tag` | `string` | `'header'` | Root HTML element |
| `outlined` | `boolean` | `false` | Bottom border style |
| `underlined` | `boolean` | `false` | Underlined style |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Border radius |
| `colorThreshold` | `number` | `undefined` | Auto text contrast threshold |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Main toolbar content |
| `prepend` | Left-side content (before title) |
| `append` | Right-side content (after title) |
| `extension` | Extension area below main toolbar (requires `extended`) |

---

## SToolbarTitle

Toolbar heading text.

### Slots

| Slot | Description |
|------|-------------|
| `default` | Title text |

---

## SToolbarItem

Toolbar action item wrapper.

### Slots

| Slot | Description |
|------|-------------|
| `default` | Content (typically `SButton` or `SIcon`) |

---

## Usage

```vue
<!-- Basic app toolbar -->
<SToolbar color="primary">
  <SToolbarTitle>My Application</SToolbarTitle>
  <SSpacer />
  <SButton variant="icon">
    <SIcon icon="mdi-magnify" />
  </SButton>
  <SButton variant="icon">
    <SIcon icon="mdi-dots-vertical" />
  </SButton>
</SToolbar>

<!-- With prepend/append slots -->
<SToolbar color="primary">
  <template #prepend>
    <SButton variant="icon" @click="toggleDrawer">
      <SIcon icon="mdi-menu" />
    </SButton>
  </template>
  <SToolbarTitle>Dashboard</SToolbarTitle>
  <template #append>
    <SButton variant="icon">
      <SIcon icon="mdi-account" />
    </SButton>
  </template>
</SToolbar>

<!-- With extension (e.g., tabs) -->
<SToolbar color="primary" extended>
  <SToolbarTitle>Page Title</SToolbarTitle>
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
- Use `SSpacer` (from layout) to push elements to the right.
- `extended` + `#extension` slot is the pattern for toolbars with tabs or search bars below the main row.
