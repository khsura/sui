# SChip

**Import:** `import { SChip } from '@khsura/sui'`

Small pill for tags, filters or selections. Supports closable, clickable (`link`) and outlined styles.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsChip.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Preset name or CSS color |
| `colorThreshold` | `number` | `undefined` | Luminance threshold for automatic light/dark text |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |
| `label` | `boolean` | `false` | Square "label" shape instead of a pill |
| `closable` | `boolean` | `false` | Show a close icon (`mdi-close`) |
| `link` | `boolean` | `false` | Clickable styling; required for `click` to be emitted |
| `disabled` | `boolean` | `false` | Disabled styling |
| `outlined` | `boolean` | `false` | Border style, text-colored |
| `underlined` | `boolean` | `false` | Underlined style |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Custom radius |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Close icon clicked (or `on.close()` called from the `close` slot) |
| `click` | `Event` | Chip clicked — **only emitted when `link` is set** |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | — | Chip text |
| `close` | `{ on: { close } }` | Replaces the whole close icon, including its click handler. Only rendered when `closable` |

## Usage

```vue
<SChip color="primary">Primary</SChip>
<SChip outlined color="secondary">Outlined</SChip>
<SChip label color="primary">Label</SChip>
<SChip link @click="selectFilter">Filter</SChip>

<SChip v-for="tag in tags" :key="tag" closable @close="tags = tags.filter((t) => t !== tag)">
  {{ tag }}
</SChip>

<!-- Custom close icon: you must wire on.close yourself -->
<SChip closable @close="remove">
  Tag
  <template #close="{ on }">
    <SIcon icon="mdi-close-circle" @click.stop="on.close" />
  </template>
</SChip>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SChip @click="fn">` without `link` | Add `link` — otherwise `click` never fires |
| `<template #close><SIcon .../></template>` | Use `#close="{ on }"` and call `on.close` — the slot replaces the built-in handler |
| `<SChip icon="..." />` | No icon prop — nest `<SIcon>` in the default slot |

- The chip root stops click propagation, so a parent's click handler will not fire when a chip is clicked.
- The default close icon is an `SIcon`; it renders nothing unless the app loads `@mdi/font`.
