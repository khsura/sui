# Carousel Components

**Import:** `import { SCarousel, SCarouselItem } from '@khsura/sui'`

Image/content slider with navigation dots, arrows, and auto-play.

---

## SCarousel

Root carousel container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cycle` | `boolean` | `false` | Auto-advance through slides |
| `interval` | `number` | `6000` | Auto-advance interval in ms |
| `height` | `number \| string` | `undefined` | Carousel height |
| `color` | `string` | `undefined` | Active delimiter color |
| `hideDelimiters` | `boolean` | `false` | Hide navigation dots |
| `hideDelimiterBackground` | `boolean` | `false` | Hide dots background |
| `delimiterIcon` | `MaterialDesignIcon` | `'mdi-circle'` | Custom dot icon |
| `verticalDelimiters` | `boolean \| 'left' \| 'right'` | `false` | Vertical dot placement |
| `hideArrows` | `boolean` | `false` | Hide prev/next arrows |
| `touch` | `boolean \| TouchHandlers` | `true` | Enable swipe gestures |
| `noAnimation` | `boolean` | `false` | Disable slide transition |
| `controlsBackgroundColor` | `string` | `undefined` | Controls overlay background |

### Model

`v-model` — index or value of the active slide.

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SCarouselItem` components |

---

## SCarouselItem

Individual slide.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any` | `undefined` | Slide identifier (matched against carousel model) |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Slide content |

---

## Usage

```vue
<script setup lang="ts">
const slide = ref(0)

const slides = [
  { id: 0, src: '/slide1.jpg', title: 'Slide 1' },
  { id: 1, src: '/slide2.jpg', title: 'Slide 2' },
  { id: 2, src: '/slide3.jpg', title: 'Slide 3' },
]
</script>

<template>
  <!-- Basic image carousel -->
  <SCarousel v-model="slide" height="400">
    <SCarouselItem v-for="item in slides" :key="item.id" :value="item.id">
      <SImage :src="item.src" object-fit="cover" height="400" />
    </SCarouselItem>
  </SCarousel>

  <!-- Auto-cycling carousel -->
  <SCarousel v-model="slide" cycle :interval="4000" height="300">
    <SCarouselItem v-for="item in slides" :key="item.id" :value="item.id">
      <div class="slide-content">{{ item.title }}</div>
    </SCarouselItem>
  </SCarousel>

  <!-- Hide arrows, show only dots -->
  <SCarousel v-model="slide" hide-arrows height="200">
    <SCarouselItem v-for="(item, i) in slides" :key="i" :value="i">
      <SImage :src="item.src" object-fit="cover" />
    </SCarouselItem>
  </SCarousel>

  <!-- Vertical dots on right -->
  <SCarousel v-model="slide" vertical-delimiters="right" height="400">
    <SCarouselItem v-for="(item, i) in slides" :key="i" :value="i">
      <SImage :src="item.src" object-fit="cover" />
    </SCarouselItem>
  </SCarousel>

  <!-- No animation -->
  <SCarousel v-model="slide" no-animation>
    <SCarouselItem v-for="(item, i) in slides" :key="i" :value="i">
      Content {{ i + 1 }}
    </SCarouselItem>
  </SCarousel>
</template>
```

## Notes

- `cycle` requires `interval` to be set (default 6000ms).
- Swipe gestures are enabled by default on touch devices.
- For full-width image carousels, set `height` and use `object-fit="cover"` on `SImage`.
