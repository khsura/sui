# SWindow (internal, not public)

> **Not exported, so it cannot be imported from `@khsura/sui`.** `SWindow` and `SWindowItem` exist inside the library only as the engine behind [SCarousel](./carousel.md). `import { SWindow, SWindowItem } from '@khsura/sui'` fails, and the package has no deep-import subpath for them.

## What to use instead

| Need | Use |
|------|-----|
| Image / content slideshow with arrows, dots, swipe | [SCarousel](./carousel.md) + `SCarouselItem` (set `:cycle="false"` for a manual slider) |
| Tab panels | [STabs](./tabs.md) + `v-if` / `v-show` on the tab value |
| Step-by-step wizard | [SStepper](./stepper.md) + `v-if` on the step number |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { STabs, STab } from '@khsura/sui'

const tab = ref<'one' | 'two'>('one')
</script>

<template>
  <STabs v-model="tab">
    <STab tab="one">First</STab>
    <STab tab="two">Second</STab>
  </STabs>

  <section v-if="tab === 'one'">Content one</section>
  <section v-else>Content two</section>
</template>
```

## Gotchas

- ❌ `import { SWindow, SWindowItem } from '@khsura/sui'`: not exported.
- ❌ `<STabs> + <SWindow>` pairing: use conditional rendering on the tab value instead.
- ✅ For a sliding transition between panels without auto-play, use `SCarousel` with `:cycle="false"`, `hide-delimiters` and `:src="null"` items.
