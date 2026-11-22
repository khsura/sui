# SImage

**Import:** `import { SImage } from '@khsura/sui'`

An `<img>` inside a wrapper `<div>`. Supports aspect ratio, object-fit, size limits, and an overlay slot. The image always uses native lazy loading (`loading="lazy"`).

Types: `node_modules/@khsura/sui/@types/definitions/props/propsImage.d.ts`

<!-- generated:api:start SImage -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SImage props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `alt` | `string \| null` | — | no | — |
| `aspectRatio` | `number \| null` | — | no | — |
| `height` | `number \| string \| null` | — | no | — |
| `lazyLoad` | `LazyLoad \| null` | — | no | — |
| `maxHeight` | `number \| string \| null` | — | no | — |
| `maxWidth` | `number \| string \| null` | — | no | — |
| `minHeight` | `number \| string \| null` | — | no | — |
| `minWidth` | `number \| string \| null` | — | no | — |
| `objectFit` | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down"` | — | no | `contain`, `cover`, `fill`, `none`, `scale-down` |
| `src` | `string \| null` | — | yes | — |
| `width` | `number \| string \| null` | — | no | — |

**SImage slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SImage events**

None.

<!-- generated:api:end SImage -->

**SImage notes**

- `src`: Image URL. When it is falsy, no `<img>` is rendered (the slot still renders) (default: **required**)
- `alt`: Alt text (default: `''`)
- `objectFit`: CSS `object-fit` for the `<img>`
- `aspectRatio`: Width/height ratio applied to the wrapper (e.g. `16/9`, `1`)
- `lazyLoad`: Declared but **currently ignored**: `loading` is always `lazy`
- `width` / `height`: Wrapper dimensions (the wrapper is `100%` × `100%` otherwise)
- `maxWidth` / `maxHeight`: Max dimensions
- `minWidth` / `minHeight`: Min dimensions
- `default` (slot): Content in an absolutely positioned layer over the image (full width/height)

## Usage

```vue
<SImage src="/photo.jpg" alt="A photo" />

<!-- 16:9 cover -->
<SImage src="/banner.jpg" :aspect-ratio="16/9" object-fit="cover" />

<!-- Square image (for a user avatar with an initials fallback, use SAvatar) -->
<SImage src="/avatar.jpg" :aspect-ratio="1" object-fit="cover" :width="80" />

<!-- Overlay -->
<SImage src="/photo.jpg" :aspect-ratio="4/3" object-fit="cover">
  <div class="caption">Caption text</div>
</SImage>
```

## Gotchas

- The wrapper defaults to `width: 100%; height: 100%` (`height: auto` when `aspect-ratio` is set). In a parent with no height, give it `aspect-ratio` or `height`.
- Use `object-fit="cover"` with `aspect-ratio` to avoid stretching.
- With `aspect-ratio` and no `height`, the wrapper uses `height: auto`, so the ratio sets its height even in a flex-column card (an equal-height grid). Older versions kept `height: 100%` there and the images in one row got different heights; on those, add `height="auto"`.
- Without a `src` the wrapper shows a neutral placeholder (the app background colour) instead of a blank gap, so a card with a missing image keeps its shape.

| ❌ | ✅ |
|----|----|
| `<SImage src="/hero.jpg" lazy-load="eager" />` to load eagerly | Not supported. Use a plain `<img loading="eager">` for above-the-fold images |
