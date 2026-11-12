# SImage

**Import:** `import { SImage } from '@khsura/sui'`

An `<img>` inside a wrapper `<div>`, with aspect ratio control, object-fit support and an overlay slot. The image always uses native lazy loading (`loading="lazy"`).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string \| null` | **required** | Image URL. When falsy, no `<img>` is rendered (the slot still renders) |
| `alt` | `string \| null` | `''` | Alt text for accessibility |
| `objectFit` | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `undefined` | CSS object-fit value |
| `aspectRatio` | `number` | `undefined` | Width-to-height ratio applied to the wrapper (e.g. `16/9`, `1`, `4/3`) |
| `lazyLoad` | `LazyLoad` (`'lazy' \| 'eager' \| 'auto'`) | `undefined` | Declared but **ignored** — `loading` is always `lazy` |
| `width` | `string \| number` | `undefined` | Wrapper width (`100%` otherwise) |
| `height` | `string \| number` | `undefined` | Wrapper height (`100%` otherwise) |
| `maxWidth` | `string \| number` | `undefined` | Max width constraint |
| `maxHeight` | `string \| number` | `undefined` | Max height constraint |
| `minWidth` | `string \| number` | `undefined` | Min width constraint |
| `minHeight` | `string \| number` | `undefined` | Min height constraint |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Content in an absolutely positioned layer over the image (full width/height) |

## Events

None.

## Usage

```vue
<!-- Basic -->
<SImage src="/photo.jpg" alt="A photo" />

<!-- With aspect ratio (16:9) -->
<SImage src="/banner.jpg" :aspect-ratio="16/9" object-fit="cover" />

<!-- Square avatar -->
<SImage src="/avatar.jpg" :aspect-ratio="1" object-fit="cover" :width="80" />

<!-- With overlay -->
<SImage src="/photo.jpg" :aspect-ratio="4/3">
  <div class="overlay">Caption text</div>
</SImage>

<!-- Constrained width -->
<SImage src="/photo.jpg" :max-width="400" object-fit="contain" />
```

## Notes

- Setting `aspect-ratio` sets the CSS `aspect-ratio` of the wrapper, so it keeps the ratio before the image loads.
- The wrapper defaults to `width: 100%; height: 100%`. In a parent with no height, give it `aspect-ratio` or `height`.
- `object-fit="cover"` is recommended when using `aspect-ratio` to prevent distortion.
- Every image is lazy-loaded; `lazyLoad` cannot switch it to eager. Use a plain `<img loading="eager">` for above-the-fold images.
