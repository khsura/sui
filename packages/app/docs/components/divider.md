# SDivider

**Import:** `import { SDivider } from '@khsura/sui'`

A simple horizontal or vertical rule for visually separating content. Renders an `<hr role="separator">` with the matching `aria-orientation`.

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

<!-- Inside a list -->
<SList>
  <SListItem>Item 1</SListItem>
  <SDivider />
  <SListItem>Item 2</SListItem>
</SList>

<!-- Inside a flex column: stretch it, or it collapses to zero width -->
<div style="display: flex; flex-direction: column; align-items: center;">
  <span>Above</span>
  <SDivider style="align-self: stretch" />
  <span>Below</span>
</div>
```

## Notes

- It is a real `<hr>`, so the browser's auto side margins stay. Inside a flex **column** (e.g. with `align-items: center`) it collapses to **zero width** and disappears — give it `style="align-self: stretch"` or `style="width: 100%"`.
- A vertical divider takes its height from the parent. If the parent has no height, nothing shows.
