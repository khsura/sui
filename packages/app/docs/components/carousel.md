# Carousel Components

**Import:** `import { SCarousel, SCarouselItem } from '@khsura/sui'`

Image/content slider with navigation dots, arrows, and auto-play.

---

## SCarousel

Root carousel container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| boolean` | `undefined` | Active slide's `value` (use `v-model`) |
| `cycle` | `boolean` | `true` | Auto-advance through slides — **on by default** |
| `interval` | `number` | `6000` | Auto-advance interval in ms |
| `height` | `number \| string` | `500` | Carousel height (number = px) |
| `color` | `string` | `undefined` | Active delimiter (dot) color |
| `hideDelimiters` | `boolean` | `false` | Hide navigation dots |
| `hideDelimiterBackground` | `boolean` | `false` | Hide dots background |
| `controlsBackgroundColor` | `string` | `'#0000004d'` | Background of the dots strip |
| `delimiterIcon` | `MaterialDesignIcon` | `'mdi-circle'` | Custom dot icon |
| `verticalDelimiters` | `boolean \| 'left' \| 'right'` | `false` | Stack dots vertically on the left/right edge |
| `hideArrows` | `boolean` | `false` | Hide prev/next arrows |
| `prevIcon` | `MaterialDesignIcon` | `'mdi-chevron-left'` | Previous arrow icon |
| `nextIcon` | `MaterialDesignIcon` | `'mdi-chevron-right'` | Next arrow icon |
| `touch` | `boolean \| TouchHandlers` | `true` | Enable swipe gestures |
| `noAnimation` | `boolean` | `false` | Disable slide transition |
| `selectedClass` | `string` | `undefined` | Class added to the active item |
| `tag` | `HtmlTagName` | `'div'` | Root HTML element |

The carousel always loops and always has one slide selected (`continuous` and `mandatory` are hard-wired). `continuous` and `disabled` exist on the type but have no effect on SCarousel.

### Model

`v-model` — the `value` of the active slide.

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | slide `value` | Active slide changed (arrows, dots, swipe, auto-play) |

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SCarouselItem` components |

There are no `prev`/`next` slots on SCarousel — use `prevIcon` / `nextIcon`.

---

## SCarouselItem

Individual slide. Each item renders an `SImage`; the default-slot content is drawn as an overlay on top of the image.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string \| null` | **required** | Image URL. Pass `:src="null"` for content-only slides |
| `value` | `string \| number \| boolean` | auto id | Slide identifier matched against the carousel model. Set it explicitly — the item's `:key` is not used |
| `alt` | `string \| null` | `undefined` | Image alt text |
| `objectFit` | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `undefined` | Image fit |
| `aspectRatio` | `number \| null` | `undefined` | Image aspect ratio |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Overlay content on top of the image |

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const slide = ref(0)

const slides = [
  { src: '/slide1.jpg', title: 'Slide 1' },
  { src: '/slide2.jpg', title: 'Slide 2' },
  { src: '/slide3.jpg', title: 'Slide 3' },
]
</script>

<template>
  <!-- Basic image carousel (auto-plays by default) -->
  <SCarousel v-model="slide" :height="400">
    <SCarouselItem v-for="(item, i) in slides" :key="i" :value="i" :src="item.src" object-fit="cover" />
  </SCarousel>

  <!-- Faster auto-play with overlay text -->
  <SCarousel v-model="slide" :interval="4000" :height="300">
    <SCarouselItem v-for="(item, i) in slides" :key="i" :value="i" :src="item.src" object-fit="cover">
      <div class="slide-content">{{ item.title }}</div>
    </SCarouselItem>
  </SCarousel>

  <!-- Static, hide arrows, show only dots -->
  <SCarousel v-model="slide" :cycle="false" hide-arrows :height="200">
    <SCarouselItem v-for="(item, i) in slides" :key="i" :value="i" :src="item.src" object-fit="cover" />
  </SCarousel>

  <!-- Vertical dots on right -->
  <SCarousel v-model="slide" vertical-delimiters="right" :height="400">
    <SCarouselItem v-for="(item, i) in slides" :key="i" :value="i" :src="item.src" object-fit="cover" />
  </SCarousel>

  <!-- Content-only slides, no animation -->
  <SCarousel v-model="slide" :cycle="false" no-animation>
    <SCarouselItem v-for="(item, i) in slides" :key="i" :value="i" :src="null">
      Content {{ i + 1 }}
    </SCarouselItem>
  </SCarousel>
</template>
```

## Notes

- `cycle` is `true` by default — pass `:cycle="false"` for a static slider.
- `height` defaults to `500`.
- On mount the carousel shows the slide whose `value` matches `v-model`; when the model names no slide, it selects the first slide and emits its `value`.
- Use the item's own `src` / `object-fit` props instead of nesting an `SImage`; `src` is required (use `:src="null"` for text slides).
- Swipe gestures are enabled by default (`touch`).
