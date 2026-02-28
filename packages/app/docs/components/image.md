# SImage

**Import:** `import { SImage } from '@khsura/sui'`

Image component with lazy loading, aspect ratio control, and object-fit support.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string \| null` | **required** | Image URL |
| `alt` | `string` | `undefined` | Alt text for accessibility |
| `objectFit` | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `undefined` | CSS object-fit value |
| `aspectRatio` | `number` | `undefined` | Width-to-height ratio (e.g. `16/9`, `1`, `4/3`) |
| `lazyLoad` | `LazyLoad` | `undefined` | Lazy loading strategy |
| `width` | `string \| number` | `undefined` | Explicit width |
| `height` | `string \| number` | `undefined` | Explicit height |
| `maxWidth` | `string \| number` | `undefined` | Max width constraint |
| `maxHeight` | `string \| number` | `undefined` | Max height constraint |
| `minWidth` | `string \| number` | `undefined` | Min width constraint |
| `minHeight` | `string \| number` | `undefined` | Min height constraint |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Overlay content rendered on top of the image |

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

<!-- Lazy loaded -->
<SImage src="/large-photo.jpg" lazy-load :aspect-ratio="16/9" />

<!-- Constrained width -->
<SImage src="/photo.jpg" :max-width="400" object-fit="contain" />
```

## Notes

- Setting `aspect-ratio` creates a responsive placeholder that maintains the ratio before the image loads.
- `object-fit="cover"` is recommended when using `aspect-ratio` to prevent distortion.
