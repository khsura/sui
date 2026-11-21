# SChip

**Import:** `import { SChip } from '@khsura/sui'`

Small pill for tags, filters or selections. Supports closable, clickable (`link`) and outlined styles.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsChip.d.ts`

<!-- generated:api:start SChip -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SChip props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `borderRadius` | `` number \| "tile" \| "rounded" \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}%` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — |
| `closable` | `boolean` | — | no | — |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `label` | `boolean` | — | no | — |
| `link` | `boolean` | — | no | — |
| `outlined` | `boolean \| null` | — | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `size` | `SizePropertyType` | — | no | `default`, `extra`, `large`, `mini`, `small` |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |
| `underlined` | `boolean \| null` | — | no | — |

**SChip slots**

| Slot | Slot props |
| --- | --- |
| `close` | `{ on: { close: () => void; }; }` |
| `default` | `any` |

**SChip events**

| Event | Payload |
| --- | --- |
| `click` | `[_: Event]` |
| `close` | `[]` |

<!-- generated:api:end SChip -->

**SChip notes**

- `color`: Preset name or CSS color
- `colorThreshold`: Luminance threshold for automatic light/dark text
- `size`: Preset size
- `label`: Square "label" shape instead of a pill
- `closable`: Show a close icon (`mdi-close`)
- `link`: Clickable styling; required for `click` to be emitted
- `disabled`: Disabled styling
- `outlined`: Border style, text-colored
- `underlined`: Underlined style
- `borderRadius`: Custom radius
- `close` (event): Close icon clicked (or `on.close()` called from the `close` slot)
- `click` (event): Chip clicked — **only emitted when `link` is set**
- `default` (slot): Chip text
- `close` (slot): Replaces the whole close icon, including its click handler. Only rendered when `closable`

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
