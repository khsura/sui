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
| `height` | `string \| number` | `'100%'` | Container height (number = px) |
| `width` | `string \| number` | `'100%'` | Container width (number = px) |

There are no `min*` / `max*` size props — constrain the size with CSS on a wrapper.

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SSplitViewItem` components |

---

## SSplitViewItem

Individual panel inside the split view. No props. Renders the panel plus a resize handle after it; the last item's handle is hidden.

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

- Panels are separated by a divider handle that users drag with the mouse (no touch support). Dragging a handle resizes the panel before it.
- The default `height: '100%'` collapses when the parent has no height — give `SSplitView` or its parent an explicit height.
- `SSplitViewItem` has two root elements, so `class` / `style` set on it are not applied. Style an inner element instead.
- Panels already scroll vertically (`overflow-y: auto`); horizontal overflow is up to you.
