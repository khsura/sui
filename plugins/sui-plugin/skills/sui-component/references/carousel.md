# SCarousel

**Import:** `import { SCarousel, SCarouselItem } from '@khsura/sui'`

Image/content slider with delimiter dots, prev/next arrows, swipe and auto-play. **Auto-play is ON by default** (`cycle: true`) and the default height is `500`.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsCarousel.d.ts`, `propsCarouselItem.d.ts`

---

## SCarousel

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| boolean` | `undefined` | Active slide's `value` (use `v-model`) |
| `cycle` | `boolean` | `true` | Auto-advance through slides |
| `interval` | `number` | `6000` | Auto-advance interval in ms |
| `height` | `number \| string` | `500` | Carousel height (number = px) |
| `color` | `string` | `undefined` | Color of the active delimiter dot |
| `hideDelimiters` | `boolean` | `false` | Hide the navigation dots |
| `hideDelimiterBackground` | `boolean` | `false` | Hide the dots' background strip |
| `controlsBackgroundColor` | `string` | `'#0000004d'` | Background of the dots strip |
| `delimiterIcon` | `MaterialDesignIcon` | `'mdi-circle'` | Dot icon |
| `verticalDelimiters` | `boolean \| 'left' \| 'right'` | `undefined` | Stack dots vertically on the left/right edge |
| `hideArrows` | `boolean` | `false` | Hide prev/next arrows |
| `prevIcon` | `MaterialDesignIcon` | `'mdi-chevron-left'` | Previous arrow icon |
| `nextIcon` | `MaterialDesignIcon` | `'mdi-chevron-right'` | Next arrow icon |
| `touch` | `boolean \| TouchHandlers` | `true` | Swipe gestures |
| `noAnimation` | `boolean` | `false` | Disable the slide transition |
| `selectedClass` | `string` | `undefined` | Class for the active item |
| `tag` | `string` | `'div'` | Root HTML element |

Always looping and always one slide selected (`continuous` + `mandatory` are hard-wired). The `continuous` and `disabled` props exist in the type but have no effect on SCarousel.

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SCarouselItem` components |

No `prev`/`next` slots on SCarousel.

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | slide `value` | Active slide changed (arrows, dots, swipe, auto-play) |

---

## SCarouselItem

Each item renders an `SImage`. Your default-slot content is drawn as an overlay on top of the image.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number \| boolean` | auto id | Slide identifier matched against the carousel `v-model` |
| `src` | `string \| null` | **required** | Image URL. Pass `:src="null"` for content-only slides |
| `alt` | `string \| null` | `undefined` | Image alt text |
| `objectFit` | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `undefined` | Image fit |
| `aspectRatio` | `number \| null` | `undefined` | Image aspect ratio |

| Slot | Description |
|------|-------------|
| `default` | Overlay content on top of the image |

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
