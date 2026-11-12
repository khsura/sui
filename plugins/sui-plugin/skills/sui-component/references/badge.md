# SBadge

**Import:** `import { SBadge } from '@khsura/sui'`

Overlays a small notification indicator on another element. Supports number/text, dot, and icon modes. (The inner `SBadgeContent` is internal — not exported, not importable from `@khsura/sui`.)

Types: `node_modules/@khsura/sui/@types/definitions/props/propsBadge.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `boolean` | `undefined` (falsy) | Show the badge. **No default — the badge is hidden unless you pass `value`** |
| `content` | `string \| number` | `undefined` | Text/number inside the badge. Falsy values (`0`, `''`) render an empty badge |
| `icon` | `MaterialDesignIcon` | `undefined` | MDI icon inside the badge (wins over `content`) |
| `label` | `string` | `undefined` | `aria-label` of the badge (`role="status"`, `aria-live="polite"`) |
| `color` | `string` | `undefined` (primary) | Preset name or CSS color for the badge background |
| `colorThreshold` | `number` | `undefined` | Contrast threshold for auto text color |
| `theme` | `AppThemeType` | `undefined` | Per-component theme override |
| `dot` | `boolean` | `undefined` | Dot mode — 9px circle, ignores `content`/`icon` |
| `overlap` | `boolean` | `undefined` | Pull the badge further onto the child's corner |
| `inline` | `boolean` | `undefined` | Render next to the content instead of absolutely positioned |
| `bottom` | `boolean` | `undefined` | Position at the bottom |
| `left` | `boolean` | `undefined` | Position on the left (with `inline`, badge renders before the content) |
| `tile` | `boolean` | `undefined` | Square corners |
| `offsetX` | `string \| number` | `undefined` | Horizontal offset (replaces the built-in spacer) |
| `offsetY` | `string \| number` | `undefined` | Vertical offset |
| `transitionName` | `STransition` | `undefined` | Named transition for show/hide |

## Slots

| Slot | Description |
|------|-------------|
| `default` | The element the badge wraps |
| `badge` | Custom badge content — overrides `content`, `icon` and `dot` content |

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

<!-- Custom badge content via slot -->
<SBadge value overlap>
  <template #badge>
    <SIcon icon="mdi-check" />
  </template>
  <SImage src="avatar.jpg" />
</SBadge>

<!-- Bottom-right -->
<SBadge value :content="3" bottom color="primary" overlap>
  <SIcon icon="mdi-account" />
</SBadge>

<!-- Inline (no overlap) -->
<SBadge value inline :content="5" color="secondary">Messages</SBadge>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SBadge :content="3">` — nothing shows | `<SBadge value :content="3">` (or `:value="true"`) |
| `:content="0"` to show a zero count | `:content="String(count)"` — `0` is falsy and renders an empty pill |
| Expecting a hidden badge to stay in the DOM | Hidden badge is removed (`v-if`) |

- Default position is top-right of the wrapped element; `overlap` moves it onto the edge.
- Changing `content`/`icon` briefly re-mounts the badge (re-plays `transitionName`).
