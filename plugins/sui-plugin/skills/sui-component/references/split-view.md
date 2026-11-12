# SSplitView

**Import:** `import { SSplitView, SSplitViewItem } from '@khsura/sui'`

Resizable panes separated by mouse-draggable dividers.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsSplitView.d.ts`

---

## SSplitView

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `vertical` | `boolean` | `false` | Stack panes top/bottom instead of side by side |
| `height` | `string \| number` | `'100%'` | Container height (number = px) |
| `width` | `string \| number` | `'100%'` | Container width (number = px) |

No min/max size props.

| Slot | Description |
|------|-------------|
| `default` | `SSplitViewItem` components |

No events.

## SSplitViewItem

No props. Renders the pane plus a resize handle after it. The last item's handle is hidden.

| Slot | Description |
|------|-------------|
| `default` | Pane content |

---

## Usage

```vue
<template>
  <SSplitView :height="500">
    <SSplitViewItem><nav>File browser</nav></SSplitViewItem>
    <SSplitViewItem><main>Editor</main></SSplitViewItem>
  </SSplitView>

  <SSplitView vertical height="600px">
    <SSplitViewItem>Code</SSplitViewItem>
    <SSplitViewItem>Terminal</SSplitViewItem>
  </SSplitView>
</template>
```

## Gotchas

- ❌ `max-height`, `min-width`, `max-width`, `min-height` props: they don't exist. Constrain with CSS on a wrapper.
- The default `height: '100%'` collapses when the parent has no height. Give the split view or its parent an explicit height.
- Resizing works with the mouse only (no touch). Dragging a handle resizes the pane before it.
- `SSplitViewItem` has two root elements, so `class` / `style` on it are not applied. Style an inner element instead.
- Panes already scroll vertically (`overflow-y: auto`). Horizontal overflow is yours to handle.
