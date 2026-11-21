# SBadge

**Import:** `import { SBadge } from '@khsura/sui'`

Overlays a small notification indicator on another element. Supports number/text, dot, and icon modes. (The inner `SBadgeContent` is internal — not exported, not importable from `@khsura/sui`.)

Types: `node_modules/@khsura/sui/@types/definitions/props/propsBadge.d.ts`

<!-- generated:api:start SBadge -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SBadge props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `bottom` | `boolean` | — | no | — |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `content` | `string \| number` | — | no | — |
| `dot` | `boolean` | — | no | — |
| `icon` | `string` | — | no | — |
| `inline` | `boolean` | — | no | — |
| `label` | `string` | — | no | — |
| `left` | `boolean` | — | no | — |
| `offsetX` | `string \| number` | — | no | — |
| `offsetY` | `string \| number` | — | no | — |
| `overlap` | `boolean` | — | no | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |
| `tile` | `boolean` | — | no | — |
| `transitionName` | `STransition` | — | no | — |
| `value` | `boolean` | — | no | — |

**SBadge slots**

| Slot | Slot props |
| --- | --- |
| `badge` | `{}` |
| `default` | `{}` |

**SBadge events**

None.

<!-- generated:api:end SBadge -->

**SBadge notes**

- `value`: Show the badge. **No default — the badge is hidden unless you pass `value`** (default: `undefined` (falsy))
- `content`: Text/number inside the badge. Falsy values (`0`, `''`) render an empty badge
- `icon`: MDI icon inside the badge (wins over `content`)
- `label`: `aria-label` of the badge (`role="status"`, `aria-live="polite"`)
- `color`: Preset name or CSS color for the badge background (default: `undefined` (primary))
- `colorThreshold`: Contrast threshold for auto text color
- `theme`: Per-component theme override
- `dot`: Dot mode — 9px circle, ignores `content`/`icon`
- `overlap`: Pull the badge further onto the child's corner
- `inline`: Render next to the content instead of absolutely positioned
- `bottom`: Position at the bottom
- `left`: Position on the left (with `inline`, badge renders before the content)
- `tile`: Square corners
- `offsetX`: Horizontal offset (replaces the built-in spacer)
- `offsetY`: Vertical offset
- `transitionName`: Named transition for show/hide
- `default` (slot): The element the badge wraps
- `badge` (slot): Custom badge content — overrides `content`, `icon` and `dot` content

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
