# SSheet

**Import:** `import { SSheet } from '@khsura/sui'`

A styled surface/container component. Similar to a card but without built-in structure — use it as a flexible colored or elevated surface.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Background color — preset name or CSS color |
| `elevation` | `0–24` | `undefined` | Box shadow depth |
| `outlined` | `boolean` | `false` | Border instead of elevation |
| `underlined` | `boolean` | `false` | Bottom border only |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Custom border radius |
| `tag` | `string` | `'div'` | Root HTML element |
| `width` / `height` | `string \| number` | `undefined` | Dimensions |
| `maxWidth` / `maxHeight` | `string \| number` | `undefined` | Max dimensions |
| `minWidth` / `minHeight` | `string \| number` | `undefined` | Min dimensions |
| `colorThreshold` | `number` | `undefined` | Auto text contrast threshold |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Sheet content |

## Events

None.

## Usage

```vue
<!-- Colored surface -->
<SSheet color="primary" :elevation="2" class="s_pa__4">
  Content on a colored surface
</SSheet>

<!-- Outlined -->
<SSheet outlined class="s_pa__4">
  Outlined sheet
</SSheet>

<!-- Fixed size panel -->
<SSheet :width="320" :height="200" :elevation="4" class="s_pa__4">
  Fixed size surface
</SSheet>

<!-- Tile (no border radius) -->
<SSheet color="secondary" border-radius="tile">
  Tile sheet
</SSheet>

<!-- As section element -->
<SSheet tag="section" :elevation="1">
  <h2>Section heading</h2>
  <p>Section content</p>
</SSheet>
```

## Notes

- `SSheet` is the base surface primitive — `SCard` builds on top of it with structured slots (title, text, actions).
- Use `SSheet` when you need a plain colored/elevated container without the card structure.
