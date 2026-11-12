# SChip

**Import:** `import { SChip } from '@khsura/sui'`

Small pill-shaped element for tags, filters, or selections. Supports closable, link, and outlined variants.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Background color — preset name or CSS color (text color with `outlined`/`underlined`) |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |
| `label` | `boolean` | `false` | Square (label) style instead of pill shape |
| `closable` | `boolean` | `false` | Show a close/dismiss button |
| `link` | `boolean` | `false` | Clickable styling with hover effects; required for `click` to be emitted |
| `disabled` | `boolean` | `false` | Disabled styling |
| `outlined` | `boolean \| null` | `undefined` | Outlined style (transparent background) |
| `underlined` | `boolean \| null` | `undefined` | Underlined style |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Custom border radius |
| `colorThreshold` | `number` | `undefined` | Auto text contrast threshold |
| `theme` | `AppThemeType` | `undefined` | Per-component theme override |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Emitted when the close icon is clicked (or `on.close()` is called from the `close` slot) |
| `click` | `Event` | Emitted when the chip is clicked — **only when `link` is set** |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | — | Chip label text |
| `close` | `{ on: { close } }` | Replaces the whole close icon, including its click handler. Only rendered when `closable` |

## Usage

```vue
<!-- Basic chip -->
<SChip>Category</SChip>

<!-- Colored chip -->
<SChip color="primary">Primary</SChip>

<!-- Outlined -->
<SChip outlined color="secondary">Outlined</SChip>

<!-- Closable chip -->
<SChip closable @close="removeTag(tag)">{{ tag }}</SChip>

<!-- Closable with custom close icon -->
<SChip closable @close="remove">
  Tag
  <template #close="{ on }">
    <SIcon icon="mdi-close-circle" @click.stop="on.close" />
  </template>
</SChip>

<!-- Clickable chip -->
<SChip link @click="selectFilter">Filter</SChip>

<!-- Label style (square) -->
<SChip label color="primary">Label</SChip>

<!-- Rendering a list of tags -->
<SChip
  v-for="tag in tags"
  :key="tag"
  closable
  outlined
  @close="tags = tags.filter(t => t !== tag)"
>
  {{ tag }}
</SChip>
```

## Notes

- The `close` slot replaces the built-in close icon *and* its click handler — call `on.close` yourself or `close` is never emitted.
- Without `link`, `click` is never emitted.
- The chip root stops click propagation, so a parent's click handler does not fire when a chip is clicked.
- There is no `icon` prop — nest an `SIcon` in the default slot. The default close icon is an `SIcon` and needs `@mdi/font` loaded by the app.
- `closable` and `link` can be combined — the chip is both clickable and dismissible.
