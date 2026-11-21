# SSplitView

**Import:** `import { SSplitView, SSplitViewItem } from '@khsura/sui'`

Resizable panes separated by mouse-draggable dividers.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsSplitView.d.ts`

---

## SSplitView

<!-- generated:api:start SSplitView -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SSplitView props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `height` | `string \| number` | `"100%"` | no | — |
| `vertical` | `boolean` | — | no | — |
| `width` | `string \| number` | `"100%"` | no | — |

**SSplitView slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SSplitView events**

None.

<!-- generated:api:end SSplitView -->

**SSplitView notes**

- `vertical`: Stack panes top/bottom instead of side by side
- `height`: Container height (number = px)
- `width`: Container width (number = px)
- `default` (slot): `SSplitViewItem` components

No min/max size props.

No events.

## SSplitViewItem

No props. Renders the pane plus a resize handle after it. The last item's handle is hidden.

<!-- generated:api:start SSplitViewItem -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SSplitViewItem props**

None.

**SSplitViewItem slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SSplitViewItem events**

None.

<!-- generated:api:end SSplitViewItem -->

**SSplitViewItem notes**

- `default` (slot): Pane content

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
