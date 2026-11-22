# SCarousel

**Import:** `import { SCarousel, SCarouselItem } from '@khsura/sui'`

Image/content slider with delimiter dots, prev/next arrows, swipe and auto-play. **Auto-play is ON by default** (`cycle: true`) and the default height is `500`.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsCarousel.d.ts`, `propsCarouselItem.d.ts`

---

## SCarousel

<!-- generated:api:start SCarousel -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SCarousel props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `continuous` | `boolean` | — | no | — |
| `controlsBackgroundColor` | `string` | `"#0000004d"` | no | — |
| `cycle` | `boolean` | `true` | no | — |
| `delimiterIcon` | `string` | `"mdi-circle"` | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `height` | `number \| string` | `500` | no | — |
| `hideArrows` | `boolean` | — | no | — |
| `hideDelimiterBackground` | `boolean` | — | no | — |
| `hideDelimiters` | `boolean` | — | no | — |
| `interval` | `number` | `6000` | no | — |
| `modelValue` | `GroupItemValue` | — | no | — |
| `nextIcon` | `string` | `"mdi-chevron-right"` | no | — |
| `noAnimation` | `boolean` | `false` | no | — |
| `prevIcon` | `string` | `"mdi-chevron-left"` | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `selectedClass` | `string` | — | no | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |
| `touch` | `boolean \| TouchHandlers` | `true` | no | — |
| `verticalDelimiters` | `boolean \| "left" \| "right"` | — | no | — |

**SCarousel slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SCarousel events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: GroupItemValue \| undefined]` |

<!-- generated:api:end SCarousel -->

**SCarousel notes**

- `modelValue`: Active slide's `value` (use `v-model`)
- `cycle`: Auto-advance through slides
- `interval`: Auto-advance interval in ms
- `height`: Carousel height (number = px)
- `color`: Color of the active delimiter dot
- `hideDelimiters`: Hide the navigation dots
- `hideDelimiterBackground`: Hide the dots' background strip
- `controlsBackgroundColor`: Background of the dots strip
- `delimiterIcon`: Dot icon
- `verticalDelimiters`: Stack dots vertically on the left/right edge
- `hideArrows`: Hide prev/next arrows
- `prevIcon`: Previous arrow icon
- `nextIcon`: Next arrow icon
- `touch`: Swipe gestures
- `noAnimation`: Disable the slide transition
- `selectedClass`: Class for the active item
- `tag`: Root HTML element (default: `'div'`)
- `default` (slot): `SCarouselItem` components
- `update:modelValue` (event): Active slide changed (arrows, dots, swipe, auto-play)

Always looping and always one slide selected (`continuous` + `mandatory` are hard-wired). The `continuous` and `disabled` props exist in the type but have no effect on SCarousel.

### Slots

No `prev`/`next` slots on SCarousel.

---

## SCarouselItem

Each item renders an `SImage`. Your default-slot content is drawn as an overlay on top of the image.

<!-- generated:api:start SCarouselItem -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SCarouselItem props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activeClass` | `string \| null` | — | no | — |
| `alt` | `string \| null` | — | no | — |
| `aspectRatio` | `number \| null` | — | no | — |
| `height` | `number \| string \| null` | — | no | — |
| `lazyLoad` | `LazyLoad \| null` | — | no | — |
| `maxHeight` | `number \| string \| null` | — | no | — |
| `maxWidth` | `number \| string \| null` | — | no | — |
| `minHeight` | `number \| string \| null` | — | no | — |
| `minWidth` | `number \| string \| null` | — | no | — |
| `objectFit` | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down"` | — | no | `contain`, `cover`, `fill`, `none`, `scale-down` |
| `selected` | `boolean` | — | no | — |
| `src` | `string \| null` | — | yes | — |
| `value` | `boolean \| number \| string` | — | no | — |
| `width` | `number \| string \| null` | — | no | — |

**SCarouselItem slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SCarouselItem events**

None.

<!-- generated:api:end SCarouselItem -->

**SCarouselItem notes**

- `value`: Slide identifier matched against the carousel `v-model` (default: auto id)
- `src`: Image URL. Pass `:src="null"` for content-only slides (default: **required**)
- `alt`: Image alt text
- `objectFit`: Image fit
- `aspectRatio`: Image aspect ratio
- `default` (slot): Overlay content on top of the image

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SCarousel, SCarouselItem } from '@khsura/sui'

const slide = ref(0)
const slides = [
  { src: '/slide1.jpg', title: 'Slide 1' },
  { src: '/slide2.jpg', title: 'Slide 2' },
]
</script>

<template>
  <!-- Auto-plays by default -->
  <SCarousel v-model="slide" :height="400">
    <SCarouselItem v-for="(item, i) in slides" :key="i" :value="i" :src="item.src" object-fit="cover">
      <h2>{{ item.title }}</h2>
    </SCarouselItem>
  </SCarousel>

  <!-- Static carousel, dots on the right -->
  <SCarousel v-model="slide" :cycle="false" vertical-delimiters="right" hide-arrows>
    <SCarouselItem v-for="(item, i) in slides" :key="i" :value="i" :src="item.src" />
  </SCarousel>

  <!-- Content-only slides -->
  <SCarousel v-model="slide" :cycle="false" :height="200" no-animation>
    <SCarouselItem v-for="n in 3" :key="n" :value="n" :src="null">Content {{ n }}</SCarouselItem>
  </SCarousel>
</template>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SCarousel>` and expecting a static slider | Add `:cycle="false"`. Auto-play is on by default |
| Nesting `<SImage>` inside `SCarouselItem` | Use the item's own `src` / `object-fit` props |
| `<SCarouselItem>` without `src` | `src` is required. Use `:src="null"` for text slides |
| Relying on `:key` as the identifier | Set `:value` explicitly. The key is not forwarded to the inner item |
| `<template #prev>` on SCarousel | Not supported. Only `prevIcon` / `nextIcon` |
