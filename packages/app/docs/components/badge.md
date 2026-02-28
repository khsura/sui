# SBadge / SBadgeContent

**Import:** `import { SBadge } from '@khsura/sui'`

Overlays a small notification indicator on top of another element. Supports number count, dot, and icon modes.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `boolean` | `true` | Show or hide the badge |
| `content` | `string \| number` | `undefined` | Text/number displayed inside the badge |
| `icon` | `MaterialDesignIcon` | `undefined` | MDI icon inside the badge (replaces `content`) |
| `label` | `string` | `undefined` | Accessible label |
| `color` | `string` | `undefined` | Badge background color |
| `dot` | `boolean` | `false` | Dot mode — tiny circle without content |
| `overlap` | `boolean` | `false` | Overlap the child element edges |
| `inline` | `boolean` | `false` | Render inline (not overlapping) |
| `bottom` | `boolean` | `false` | Position badge at the bottom |
| `left` | `boolean` | `false` | Position badge on the left |
| `tile` | `boolean` | `false` | Square badge (no border-radius) |
| `offsetX` | `string \| number` | `undefined` | Horizontal position offset |
| `offsetY` | `string \| number` | `undefined` | Vertical position offset |
| `transitionName` | `STransition` | `undefined` | Named transition for badge appearance |
| `colorThreshold` | `number` | `undefined` | Auto text contrast threshold |

## Slots

| Slot | Description |
|------|-------------|
| `default` | The element the badge wraps |
| `badge` | Custom badge content (overrides `content`/`icon` props) |

## Events

None.

## Usage

```vue
<!-- Number badge on an icon -->
<SBadge :content="cartCount" color="error" overlap>
  <SIcon icon="mdi-cart" />
</SBadge>

<!-- Dot badge -->
<SBadge dot color="success" overlap>
  <SIcon icon="mdi-bell" />
</SBadge>

<!-- Hidden badge -->
<SBadge :value="hasNotifications" :content="count" color="error">
  <SButton variant="icon"><SIcon icon="mdi-bell" /></SButton>
</SBadge>

<!-- Custom badge content via slot -->
<SBadge overlap>
  <template #badge>
    <SIcon icon="mdi-check" size="mini" />
  </template>
  <SImage src="avatar.jpg" />
</SBadge>

<!-- Bottom-right position -->
<SBadge :content="3" bottom color="primary" overlap>
  <SIcon icon="mdi-account" size="large" />
</SBadge>

<!-- Inline (no overlap) -->
<SBadge inline :content="5" color="secondary">
  Messages
</SBadge>
```

## Notes

- By default, the badge appears in the top-right corner of the wrapped element.
- Use `overlap` to make the badge visually sit on the edge of the child.
- `dot` and `content` are mutually exclusive — `dot` takes precedence.
- When `value` is `false` the badge is hidden but still rendered in DOM.
