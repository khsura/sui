# SUI Directives

Directives are automatically registered when you call `app.use(createSUI())`.

---

## v-scroll

Attaches a scroll event listener to `window` (default) or a custom target element.

### Syntax

```html
v-scroll="handler"
v-scroll.self="handler"
v-scroll:[selector]="handler"
v-scroll="{ handler, options }"
```

### Modifiers

| Modifier | Description |
|----------|-------------|
| `.self` | Listen on the element itself instead of `window` |

### Argument

Pass a CSS selector string as the argument to listen on a specific scrollable container:

```html
v-scroll:['.my-container']="onScroll"
```

### Value

Either a plain handler function or an options object:

```typescript
// Plain function
v-scroll="(event: Event) => void"

// Options object
v-scroll="{ handler: (event) => void, options: AddEventListenerOptions }"
```

### Usage

```vue
<script setup lang="ts">
const onWindowScroll = (event: Event) => {
  console.log('scrollY:', window.scrollY)
}

const onSelfScroll = (event: Event) => {
  console.log('element scrollTop:', (event.target as HTMLElement).scrollTop)
}
</script>

<template>
  <!-- Listen on window scroll -->
  <div v-scroll="onWindowScroll">
    Page content
  </div>

  <!-- Listen on the element's own scroll (requires overflow: auto/scroll) -->
  <div
    v-scroll.self="onSelfScroll"
    style="height: 200px; overflow-y: auto;"
  >
    Scrollable content
  </div>

  <!-- Listen on a specific container by CSS selector -->
  <div v-scroll="'.sidebar'" @scroll="onScroll">...</div>

  <!-- With passive option (better performance for scroll-tracking) -->
  <div v-scroll="{ handler: onScroll, options: { passive: true } }">...</div>
</template>
```

### Notes

- The listener is automatically removed on component unmount.
- Uses `passive: true` by default for performance.
- When using `.self`, the element must have `overflow: auto` or `overflow: scroll` and a fixed height.

---

## v-resize

Attaches a resize event listener to `window`.

### Syntax

```html
v-resize="handler"
v-resize.quiet="handler"
v-resize.active="handler"
```

### Modifiers

| Modifier | Description |
|----------|-------------|
| `.quiet` | Do **not** call the handler immediately on mount (only on resize events) |
| `.active` | Use a non-passive listener (allows `preventDefault`) |

### Value

```typescript
v-resize="() => void"
```

### Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const windowWidth = ref(window.innerWidth)

const onResize = () => {
  windowWidth.value = window.innerWidth
}
</script>

<template>
  <!-- Called immediately on mount AND on every resize -->
  <div v-resize="onResize">
    Width: {{ windowWidth }}px
  </div>

  <!-- Only called on resize events (not on mount) -->
  <div v-resize.quiet="onResize">...</div>
</template>
```

### Notes

- By default, the handler is called once immediately on mount (without `.quiet`) — useful for initializing layout-dependent values.
- The listener is automatically removed on component unmount.
- Prefer the `useDisplay()` composable for breakpoint-aware logic instead of manually checking `window.innerWidth`.

---

## useScroll composable (Smooth Scroll)

Not a directive, but commonly used alongside scroll behavior. Provides smooth scroll helpers.

```typescript
import { useScroll } from '@khsura/sui'

const { smoothScrollTo, scrollIntoView, scrollX, scrollY } = useScroll()
```

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `smoothScrollTo` | `(selector: string, options?: ScrollIntoViewOptions) => void` | Smooth-scrolls to a CSS selector target |
| `scrollIntoView` | `(selector: string, options?: ScrollIntoViewOptions) => void` | Calls `element.scrollIntoView()` with options |

### Usage

```vue
<script setup lang="ts">
import { useScroll } from '@khsura/sui'

const { smoothScrollTo, scrollIntoView } = useScroll()
</script>

<template>
  <nav>
    <SButton @click="smoothScrollTo('#section-1', { behavior: 'smooth' })">
      Go to Section 1
    </SButton>
    <SButton @click="scrollIntoView('#section-2', { behavior: 'smooth', block: 'start' })">
      Go to Section 2
    </SButton>
  </nav>

  <section id="section-1">Section 1</section>
  <section id="section-2">Section 2</section>
</template>
```

---

## Registration

Directives are registered globally via the SUI plugin — no per-component import needed:

```typescript
// main.ts
import { createSUI } from '@khsura/sui'
app.use(createSUI())

// Now available everywhere:
// v-scroll, v-resize
```
