# SDivider

**Import:** `import { SDivider } from '@khsura/sui'`

A simple horizontal or vertical rule for visually separating content.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `vertical` | `boolean` | `false` | Render as a vertical divider |

## Slots

None.

## Events

None.

## Usage

```vue
<!-- Horizontal divider (default) -->
<SDivider />

<!-- Vertical divider -->
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
```
