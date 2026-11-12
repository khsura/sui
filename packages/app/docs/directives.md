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

Pass a CSS selector as a dynamic argument to listen on a specific scrollable container. The selector is resolved with `document.querySelector` once, when the directive mounts — the target must already exist then (otherwise no listener is attached):

```html
<!-- script: const containerSelector = '.my-container' -->
v-scroll:[containerSelector]="onScroll"
```

### Value

A plain handler function, an `EventListenerObject` (`{ handleEvent }`, optionally with `options`), or an options object. A string value is not supported (it throws):

```typescript
// Plain function
v-scroll="(event: Event) => void"

// Options object
v-scroll="{ handler: (event) => void, options: AddEventListenerOptions }"
```

### Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const windowScrollY = ref(0)
const panelScrollTop = ref(0)
const sidebarSelector = '.sidebar'

const onWindowScroll = () => {
  windowScrollY.value = window.scrollY
}

const onSelfScroll = (event: Event) => {
  if (event.target instanceof HTMLElement) {
    panelScrollTop.value = event.target.scrollTop
  }
}

const onScroll = () => {
  // react to the sidebar's scroll
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

  <!-- Listen on a specific container by CSS selector (it must exist when this mounts) -->
  <div v-scroll:[sidebarSelector]="onScroll">...</div>

  <!-- With passive option (better performance for scroll-tracking) -->
  <div v-scroll="{ handler: onScroll, options: { passive: true } }">...</div>
</template>
```

### Notes

- The listener is automatically removed on component unmount.
- Uses `passive: true` when no `options` are given.
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

Not a directive, but commonly used alongside scroll behavior. Provides scroll helpers. It returns functions only — there are no reactive `scrollX` / `scrollY` values (read `window.scrollY` in a `v-scroll` handler instead).

```typescript
import { useScroll } from '@khsura/sui'

const { smoothScrollTo, scrollIntoView, smoothElementScroll, hasScrollFeature } = useScroll()
```

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `smoothScrollTo` | `(el: HTMLElement \| string \| null, options?: { offsetTop?: number }) => void` | Smooth-scrolls the window so the target (element or CSS selector) reaches the top, minus `offsetTop` px |
| `scrollIntoView` | `(el: HTMLElement \| string \| null, options?: ScrollToOptions) => void` | Calls `element.scrollIntoView(options)` on the element or CSS selector target. Does nothing when `hasScrollFeature()` is false |
| `smoothElementScroll` | `(element: HTMLElement \| null, options?: ScrollToOptions) => void` | Scrolls a scrollable element to `options.top` / `options.left` (animated polyfill on Safari) |
| `hasScrollFeature` | `() => boolean` | Whether the browser supports CSS `scroll-behavior` |

### Usage

```vue
<script setup lang="ts">
import { SButton, useScroll } from '@khsura/sui'

const { smoothScrollTo, scrollIntoView } = useScroll()
</script>

<template>
  <nav>
    <SButton @click="smoothScrollTo('#section-1', { offsetTop: 64 })">
      Go to Section 1
    </SButton>
    <SButton @click="scrollIntoView('#section-2', { behavior: 'smooth' })">
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
