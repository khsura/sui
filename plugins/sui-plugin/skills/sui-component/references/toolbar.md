# SToolbar

**Import:** `import { SToolbar, SToolbarTitle, SSpacer } from '@khsura/sui'`

Toolbar / app bar with an optional extension row. `SToolbarItem` is also exported but renders an empty element (see Gotchas).

Types: `node_modules/@khsura/sui/@types/definitions/props/propsToolbar.d.ts`, `propsToolbarTitle.d.ts`

---

## SToolbar

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Background color (preset or CSS). Child `SButton`s and `SToolbarTitle` adapt to it |
| `colorThreshold` | `number` | `undefined` | Contrast threshold for the dark/light text decision |
| `elevation` | `0–24` | `undefined` | Shadow depth |
| `density` | `'default' \| 'comfortable' \| 'compact'` | `undefined` | Reduces the main row by 0 / 8 / 16 px and the extension by 0 / 4 / 8 px |
| `height` | `number \| string` | `64` | Main row height |
| `extended` | `boolean` | `false` | Show the extension row |
| `extensionHeight` | `number \| string` | `48` | Extension row height |
| `extensionClass` | `string \| Record<string, boolean>` | `undefined` | Class for the extension row |
| `extensionStyle` | `Record<string, string>` | `undefined` | Style for the extension row |
| `contentClass` / `contentStyle` | class / style | `undefined` | Class/style for the main content row |
| `position` | `'static' \| 'fixed' \| 'absolute' \| 'relative' \| 'sticky'` | `undefined` | CSS position |
| `outlined` / `underlined` | `boolean` | `undefined` | Border styles |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Border radius |
| `tag` | `string` | `'div'` | Root HTML element |

`title` is declared but **never rendered**. Use `SToolbarTitle`.

### Slots

| Slot | Description |
|------|-------------|
| `default` | Main row content (horizontal flex) |
| `prepend` | Separate **row above** the main row |
| `append` | Separate **row below** the main row (and below the extension) |
| `extension` | Extension row. Only shown with `extended` |

The toolbar root is a column flexbox, so `prepend` / `append` are rows, **not** left/right items.

No events.

---

## SToolbarTitle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string \| null` | `undefined` | Title text (if no slot) |
| `tag` | `string` | `'div'` | Root element |

| Slot | Description |
|------|-------------|
| `default` | Title content |
| `text` | Alternative to the default slot |

Renders nothing when it has no slot content and no `text`. Its color comes from the parent toolbar.

---

## Usage

```vue
<template>
  <SToolbar color="primary">
    <SButton variant="icon" @click="toggleDrawer"><SIcon icon="mdi-menu" /></SButton>
    <SToolbarTitle>Dashboard</SToolbarTitle>
    <SSpacer />
    <SButton variant="icon"><SIcon icon="mdi-account" /></SButton>
  </SToolbar>

  <!-- Extension row with tabs -->
  <SToolbar color="primary" extended>
    <SToolbarTitle text="Page title" />
    <template #extension>
      <STabs v-model="tab" style="width: 100%">
        <STab :tab="0">Tab 1</STab>
        <STab :tab="1">Tab 2</STab>
      </STabs>
    </template>
  </SToolbar>

  <SToolbar color="surface" density="compact" outlined>
    <SToolbarTitle>Compact bar</SToolbarTitle>
  </SToolbar>
</template>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SToolbar title="Dashboard">` | `<SToolbarTitle>Dashboard</SToolbarTitle>` |
| `#prepend` / `#append` for left/right icons | Put items in the default slot and use `<SSpacer />` to push right |
| `#extension` without `extended` | Add `extended`, or the row is not rendered |
| `<SToolbarItem><SButton/></SToolbarItem>` | `SToolbarItem` has no slot, so its children are dropped. Place items directly |
| `tag` default `'header'` assumed | Default is `div`. Pass `tag="header"` for semantics |
