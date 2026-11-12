# SDivider

**Import:** `import { SDivider } from '@khsura/sui'`

A thin horizontal or vertical rule. Renders an `<hr role="separator">` with the matching `aria-orientation`.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsDivider.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `vertical` | `boolean` | `false` | Render as a vertical divider (stretches to the parent's height) |

## Slots

None.

## Events

None.

## Usage

```vue
<!-- Horizontal divider (default) -->
<SDivider />

<!-- Vertical divider: parent must be flex and have a height -->
<div style="display: flex; align-items: center; height: 40px;">
  <span>Left</span>
  <SDivider vertical />
  <span>Right</span>
</div>

<!-- Between list items -->
<SList>
  <SListItem>Item 1</SListItem>
  <SDivider />
  <SListItem>Item 2</SListItem>
</SList>
```

## Gotchas

- It is a real `<hr>`, so the browser's auto side margins stay. Inside a flex **column** (`flex-direction: column`, e.g. with `align-items: center`) it collapses to **zero width** and disappears. Give it a width or stretch it.
- A vertical divider takes its height from the parent. If the parent has no height, nothing shows.

| ❌ | ✅ |
|----|----|
| `<div style="display:flex;flex-direction:column;align-items:center"><SDivider /></div>` | `<SDivider style="align-self: stretch" />` or `<SDivider style="width: 100%" />` |
| `<SDivider vertical />` in a parent with no height | Give the flex parent a height, or use `align-items: stretch` |
