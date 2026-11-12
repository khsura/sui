# SIcon

**Import:** `import { SIcon } from '@khsura/sui'`

Renders a Material Design Icon (MDI) by class name as `<span aria-hidden="true" class="s_icon mdi mdi-home …">`. Supports sizing, coloring, spin, and rotation.

> **Required setup:** SIcon only adds CSS classes. `@khsura/sui` does **not** ship or load the MDI font — the app must load `@mdi/font` itself, otherwise every SIcon renders blank:
>
> ```ts
> // npm i @mdi/font, then in main.ts
> import '@mdi/font/css/materialdesignicons.css'
> ```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `MaterialDesignIcon` | **required** | Full MDI class name including the `mdi-` prefix, e.g. `'mdi-home'`, `'mdi-heart-outline'` |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra' \| number \| string` | `undefined` (default size) | Preset name → size class; a number or CSS length → inline `font-size` |
| `color` | `string` | `undefined` | Text/icon color — preset name or CSS color |
| `theme` | `'light' \| 'dark'` | `undefined` | Force light/dark styling (ignored when `color` is a preset) |
| `spin` | `boolean` | `false` | Continuous rotation animation (useful for loaders) |
| `rotated` | `boolean` | `false` | Rotate 180 degrees |
| `extra` | `Array<string>` | `undefined` | Additional CSS classes appended to the icon element (e.g. `'mdi-flip-h'`) |

## Slots

None — SIcon is a self-contained inline element.

## Events

None. SIcon is `aria-hidden="true"`; wrap it in a button for click handling.

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

- Icon names follow the MDI naming convention: `mdi-{icon-name}` — the `mdi-` prefix is required.
- Load `@mdi/font/css/materialdesignicons.css` once at app entry (Nuxt: add it to `css` in `nuxt.config.ts`).
- The `spin` prop is commonly combined with `mdi-loading` or `mdi-cached` for loading states.
- `rotated` is useful for expand/collapse chevrons — bind to a boolean toggle.
