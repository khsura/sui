# SImage

**Import:** `import { SImage } from '@khsura/sui'`

An `<img>` inside a wrapper `<div>`. Supports aspect ratio, object-fit, size limits, and an overlay slot. The image always uses native lazy loading (`loading="lazy"`).

Types: `node_modules/@khsura/sui/@types/definitions/props/propsImage.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string \| null` | **required** | Image URL. When it is falsy, no `<img>` is rendered (the slot still renders) |
| `alt` | `string \| null` | `''` | Alt text |
| `objectFit` | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `undefined` | CSS `object-fit` for the `<img>` |
| `aspectRatio` | `number` | `undefined` | Width/height ratio applied to the wrapper (e.g. `16/9`, `1`) |
| `lazyLoad` | `LazyLoad` (`'lazy' \| 'eager' \| 'auto'`) | `undefined` | Declared but **currently ignored**: `loading` is always `lazy` |
| `width` / `height` | `string \| number` | `undefined` | Wrapper dimensions (the wrapper is `100%` × `100%` otherwise) |
| `maxWidth` / `maxHeight` | `string \| number` | `undefined` | Max dimensions |
| `minWidth` / `minHeight` | `string \| number` | `undefined` | Min dimensions |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Content in an absolutely positioned layer over the image (full width/height) |

## Events

None.

## Usage

```vue
<SImage src="/photo.jpg" alt="A photo" />

<!-- 16:9 cover -->
<SImage src="/banner.jpg" :aspect-ratio="16/9" object-fit="cover" />

<!-- Square avatar -->
<SImage src="/avatar.jpg" :aspect-ratio="1" object-fit="cover" :width="80" />

<!-- Overlay -->
<SImage src="/photo.jpg" :aspect-ratio="4/3" object-fit="cover">
  <div class="caption">Caption text</div>
</SImage>
```

## Gotchas

- The wrapper defaults to `width: 100%; height: 100%`. In a parent with no height, give it `aspect-ratio` or `height`.
- Use `object-fit="cover"` with `aspect-ratio` to avoid stretching.

| ❌ | ✅ |
|----|----|
| `<SImage src="/hero.jpg" lazy-load="eager" />` to load eagerly | Not supported. Use a plain `<img loading="eager">` for above-the-fold images |
