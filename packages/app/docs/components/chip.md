# SChip

**Import:** `import { SChip } from '@khsura/sui'`

Small pill-shaped element for tags, filters, or selections. Supports closable, link, and outlined variants.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Background color — preset name or CSS color |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |
| `label` | `boolean` | `false` | Square (label) style instead of pill shape |
| `closable` | `boolean` | `false` | Show a close/dismiss button |
| `link` | `boolean` | `false` | Make chip clickable with hover effects |
| `disabled` | `boolean` | `false` | Disable interactions |
| `outlined` | `boolean` | `false` | Outlined style (transparent background) |
| `underlined` | `boolean` | `false` | Underlined style |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Custom border radius |
| `colorThreshold` | `number` | `undefined` | Auto text contrast threshold |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Emitted when the close button is clicked |
| `click` | `Event` | Emitted when chip is clicked (requires `link` prop) |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Chip label text |
| `close` | Custom close icon (replaces default ✕ icon) |

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
  <template #close>
    <SIcon icon="mdi-close-circle" size="small" />
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

- The `close` slot receives no scoped data; use it to render a custom icon inside the close button area.
- `closable` and `link` can be combined — the chip is both clickable and dismissible.
