# SBadge

**Import:** `import { SBadge } from '@khsura/sui'`

Overlays a small notification indicator on top of another element. Supports number/text, dot, and icon modes. The inner `SBadgeContent` is internal and not exported.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `boolean` | `false` | Show the badge. **A badge without `value` stays hidden** |
| `content` | `string \| number` | `undefined` | Text/number displayed inside the badge. Falsy values (`0`, `''`) render an empty pill |
| `icon` | `MaterialDesignIcon` | `undefined` | MDI icon inside the badge (wins over `content`) |
| `label` | `string` | `undefined` | `aria-label` of the badge (it has `role="status"`, `aria-live="polite"`) |
| `color` | `string` | `undefined` | Preset name or CSS color for the badge background (falls back to primary) |
| `colorThreshold` | `number` | `undefined` | Auto text contrast threshold |
| `theme` | `AppThemeType` | `undefined` | Per-component theme override |
| `dot` | `boolean` | `false` | Dot mode — 9px circle; ignores `content`/`icon` |
| `overlap` | `boolean` | `false` | Pull the badge further onto the child's corner |
| `inline` | `boolean` | `false` | Render next to the content instead of absolutely positioned |
| `bottom` | `boolean` | `false` | Position badge at the bottom |
| `left` | `boolean` | `false` | Position badge on the left (with `inline`, the badge renders before the content) |
| `tile` | `boolean` | `false` | Square badge (no border-radius) |
| `offsetX` | `string \| number` | `undefined` | Horizontal offset (replaces the built-in spacer) |
| `offsetY` | `string \| number` | `undefined` | Vertical offset (replaces the built-in spacer) |
| `transitionName` | `STransition` | `undefined` | Named transition for badge show/hide |

## Slots

| Slot | Description |
|------|-------------|
| `default` | The element the badge wraps |
| `badge` | Custom badge content (overrides `content`/`icon`/`dot` content) |

## Events

None.

## Usage

```vue
<!-- Number badge on an icon -->
<SBadge :value="cartCount > 0" :content="cartCount" color="error" overlap>
  <SIcon icon="mdi-cart" />
</SBadge>

<!-- Dot badge -->
<SBadge value dot color="success" overlap>
  <SIcon icon="mdi-bell" />
</SBadge>

<!-- Toggle visibility -->
<SBadge :value="hasNotifications" :content="count" color="error">
  <SButton variant="icon"><SIcon icon="mdi-bell" /></SButton>
</SBadge>

<!-- Custom badge content via slot -->
<SBadge value overlap>
  <template #badge>
    <SIcon icon="mdi-check" />
  </template>
  <SImage src="avatar.jpg" />
</SBadge>

<!-- Bottom-right position -->
<SBadge value :content="3" bottom color="primary" overlap>
  <SIcon icon="mdi-account" />
</SBadge>

<!-- Inline (no overlap) -->
<SBadge value inline :content="5" color="secondary">
  Messages
</SBadge>
```

## Notes

- `value` defaults to `false`: always pass `value` (or `:value="..."`) or nothing is shown.
- To show a zero count pass a string (`:content="String(count)"`) — `0` is falsy and renders an empty pill.
- By default, the badge appears in the top-right corner of the wrapped element.
- Use `overlap` to make the badge visually sit on the edge of the child.
- `dot` and `content`/`icon` are mutually exclusive — `dot` takes precedence.
- When `value` is falsy the badge is removed from the DOM (`v-if`).
- Changing `content`/`icon` briefly re-mounts the badge, replaying `transitionName`.
