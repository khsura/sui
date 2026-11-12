# SSheet

**Import:** `import { SSheet } from '@khsura/sui'`

A plain surface with the app `card` background. It supports color, elevation, border, and size, and has no internal structure or padding. Use it for colored or elevated containers. For title/text/actions structure, use `SCard` ([cards.md](./cards.md)).

Types: `node_modules/@khsura/sui/@types/definitions/props/propsSheet.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Background: preset/app color name or CSS color |
| `colorThreshold` | `number` | `undefined` | Luminance threshold used to pick light/dark text on a custom color |
| `theme` | `'light' \| 'dark'` | `undefined` | Force light/dark text styling |
| `elevation` | `0`–`24` (number or numeric string) | `undefined` (no shadow) | Shadow depth |
| `outlined` | `boolean` | `false` | Border |
| `underlined` | `boolean` | `false` | Bottom border only |
| `borderRadius` | `'tile' \| 'rounded' \| number \| '<n>px' \| '<n>rem' \| '<n>%' \| …` | `undefined` | Border radius |
| `tag` | `string` (HTML tag) | `'div'` | Root element |
| `width` / `height` | `string \| number` | `undefined` | Dimensions |
| `maxWidth` / `maxHeight` | `string \| number` | `undefined` | Max dimensions |
| `minWidth` / `minHeight` | `string \| number` | `undefined` | Min dimensions |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Sheet content |

## Events

None.

## Usage

```vue
<SSheet color="primary" :elevation="2" class="s_pa__4">
  Content on a colored surface
</SSheet>

<SSheet outlined class="s_pa__4">Outlined sheet</SSheet>

<SSheet :width="320" :height="200" :elevation="4" class="s_pa__4">
  Fixed size surface
</SSheet>

<SSheet color="secondary" border-radius="tile">Tile sheet</SSheet>

<SSheet tag="section" :elevation="1">
  <h2>Section heading</h2>
</SSheet>
```

## Gotchas

- SSheet has no padding. Add it yourself (e.g. the `s_pa__4` utility class).
- SSheet has no `href`/`to`. For a clickable surface, use `SCard` with `to`/`href`.
