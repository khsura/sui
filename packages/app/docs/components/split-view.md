# Split View Components

**Import:** `import { SSplitView, SSplitViewItem } from '@khsura/sui'`

Resizable split panel layout — divides space between two or more panels with a draggable divider.

---

## SSplitView

Root split view container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `vertical` | `boolean` | `false` | Stack panels vertically (top/bottom) instead of horizontally |
| `height` | `string \| number` | `undefined` | Container height |
| `width` | `string \| number` | `undefined` | Container width |
| `maxHeight` | `string \| number` | `undefined` | Max height |
| `maxWidth` | `string \| number` | `undefined` | Max width |
| `minHeight` | `string \| number` | `undefined` | Min height |
| `minWidth` | `string \| number` | `undefined` | Min width |

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SSplitViewItem` components |

---

## SSplitViewItem

Individual panel inside the split view.

### Slots

| Slot | Description |
|------|-------------|
| `default` | Panel content |

---

## Usage

```vue
<!-- Horizontal split (side-by-side) -->
<SSplitView height="500px">
  <SSplitViewItem>
    <div class="s_pa__4">
      <h3>Left Panel</h3>
      <p>File browser or navigation</p>
    </div>
  </SSplitViewItem>
  <SSplitViewItem>
    <div class="s_pa__4">
      <h3>Right Panel</h3>
      <p>Main content area</p>
    </div>
  </SSplitViewItem>
</SSplitView>

<!-- Vertical split (top/bottom) -->
<SSplitView vertical height="600px">
  <SSplitViewItem>
    <div class="s_pa__4">Code editor</div>
  </SSplitViewItem>
  <SSplitViewItem>
    <div class="s_pa__4">Terminal / output</div>
  </SSplitViewItem>
</SSplitView>

<!-- Three-panel layout -->
<SSplitView height="400px">
  <SSplitViewItem>Panel 1</SSplitViewItem>
  <SSplitViewItem>Panel 2</SSplitViewItem>
  <SSplitViewItem>Panel 3</SSplitViewItem>
</SSplitView>
```

## Notes

- Panels are separated by a draggable divider handle that users can resize.
- Set an explicit `height` (or `width` for vertical) on `SSplitView` for the resize to work correctly.
- Content inside each `SSplitViewItem` should handle overflow (use `overflow: auto` if needed).
