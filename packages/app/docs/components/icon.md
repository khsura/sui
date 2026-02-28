# SIcon

**Import:** `import { SIcon } from '@khsura/sui'`

Renders a Material Design Icon (MDI). Supports sizing, coloring, spin, and rotation.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `MaterialDesignIcon` | **required** | MDI icon name, e.g. `'mdi-home'`, `'mdi-heart-outline'` |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra' \| number \| string` | `'default'` | Icon size |
| `color` | `string` | `undefined` | Text/icon color — preset name or CSS color |
| `spin` | `boolean` | `false` | Continuous rotation animation (useful for loaders) |
| `rotated` | `boolean` | `false` | Rotate 180 degrees |
| `extra` | `Array<string>` | `[]` | Additional CSS classes appended to the icon element |

## Slots

None — SIcon is a self-contained inline element.

## Events

None.

## Usage

```vue
<!-- Basic icon -->
<SIcon icon="mdi-home" />

<!-- Colored -->
<SIcon icon="mdi-heart" color="error" />

<!-- Sized -->
<SIcon icon="mdi-star" size="large" />
<SIcon icon="mdi-star" size="mini" />
<SIcon icon="mdi-star" :size="48" />

<!-- Spinning (loading indicator) -->
<SIcon icon="mdi-loading" :spin="isLoading" />

<!-- Rotated -->
<SIcon icon="mdi-chevron-down" :rotated="isOpen" />

<!-- Inside a button -->
<SButton variant="icon">
  <SIcon icon="mdi-pencil" />
</SButton>
```

## Notes

- Icon names follow the MDI naming convention: `mdi-{icon-name}`.
- The `spin` prop is commonly combined with `mdi-loading` or `mdi-cached` for loading states.
- `rotated` is useful for expand/collapse chevrons — bind to a boolean toggle.
