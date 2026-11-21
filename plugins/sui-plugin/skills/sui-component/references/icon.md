# SIcon

**Import:** `import { SIcon } from '@khsura/sui'`

> **Required setup: load the MDI font yourself.** SIcon only adds CSS classes (`s_icon mdi mdi-<name>`) to an empty `<span>`. `@khsura/sui` does **not** ship or load the Material Design Icons font. Without it, every SIcon renders **nothing**: no error, just blank space.
>
> ```bash
> npm i @mdi/font
> ```
> ```ts
> // main.ts (Vite / Vue)
> import '@mdi/font/css/materialdesignicons.css'
> ```
> ```ts
> // nuxt.config.ts
> export default defineNuxtConfig({ css: ['@mdi/font/css/materialdesignicons.css'] })
> ```

Renders a Material Design Icon (MDI) by class name as `<span aria-hidden="true" class="s_icon mdi mdi-home …">`. Supports size, color, spin, and 180° rotation.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsIcon.d.ts`

<!-- generated:api:start SIcon -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SIcon props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `color` | `string \| null` | — | no | — |
| `extra` | `string[] \| null` | — | no | — |
| `icon` | `string` | — | yes | — |
| `rotated` | `boolean \| null` | — | no | — |
| `size` | `SizePropertyUnionType` | — | no | — |
| `spin` | `boolean` | — | no | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |

**SIcon slots**

None.

**SIcon events**

None.

<!-- generated:api:end SIcon -->

**SIcon notes**

- `icon`: Full MDI class name including the `mdi-` prefix, e.g. `'mdi-home'`, `'mdi-heart-outline'` (default: **required**)
- `size`: Preset name → size class. A number or CSS length → inline `font-size` (default: `undefined` (default size))
- `color`: Text color: preset/app color name or any CSS color
- `theme`: Force light/dark styling (ignored when `color` is a preset)
- `spin`: Continuous rotation animation
- `rotated`: Rotate 180° (animated)
- `extra`: Extra classes added to the span, e.g. MDI helpers `'mdi-flip-h'`, `'mdi-rotate-90'`

## Events

None. SIcon has `aria-hidden="true"`. Wrap it in a button for click handling.

## Usage

```vue
<SIcon icon="mdi-home" />
<SIcon icon="mdi-heart" color="error" />
<SIcon icon="mdi-star" size="large" />
<SIcon icon="mdi-star" :size="48" />
<SIcon icon="mdi-loading" spin />
<SIcon icon="mdi-chevron-down" :rotated="isOpen" />
<SIcon icon="mdi-arrow-right" :extra="['mdi-flip-h']" />
```

## Gotchas

| ❌ | ✅ |
|----|----|
| Using SIcon without loading `@mdi/font` CSS | Import `@mdi/font/css/materialdesignicons.css` once at app entry |
| `<SIcon icon="home" />` | `<SIcon icon="mdi-home" />`. The `mdi-` prefix is required |
| `<SIcon icon="mdi-x" @click="close" />` for an action | Put the icon in a button (it is `aria-hidden`) |
