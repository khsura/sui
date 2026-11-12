# Window Components

**Import:** `import { SWindow, SWindowItem } from '@khsura/sui'`

Slide-based content switcher — the foundation of `SCarousel`, usable directly for step wizards and any sequential content display.

---

## SWindow

Root container managing the active item.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| boolean \| symbol` | `undefined` | Active item's `value` (use `v-model`) |
| `nextIcon` | `MaterialDesignIcon` | `'mdi-chevron-right'` | Next navigation icon |
| `prevIcon` | `MaterialDesignIcon` | `'mdi-chevron-left'` | Previous navigation icon |
| `hideArrows` | `boolean` | `false` | Hide navigation arrows |
| `touch` | `boolean \| TouchHandlers` | `false` | `true` enables swipe left/right; an object supplies custom touch handlers |
| `noAnimation` | `boolean` | `false` | Disable slide transition |
| `selectedClass` | `string` | `undefined` | CSS class applied to the active item |
| `mandatory` | `boolean` | `false` | Always keep one item selected |
| `continuous` | `boolean` | `false` | Loop from last to first / first to last |
| `disabled` | `boolean` | `false` | Disable the built-in arrow buttons |
| `color` | `string` | `undefined` | Preset color class on the root |
| `tag` | `HtmlTagName` | `'div'` | Root HTML element |

### Model

`v-model` — `value` of the currently visible item.

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | item `value` | Active item changed |

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ items, selected, select }` | Window items. `select({ value })` or `select({ index })` activates an item |
| `prev` | `{ icon, click, disabled }` | Custom previous button (rendered only when moving back is possible) |
| `next` | `{ icon, click }` | Custom next button (rendered only when moving forward is possible) |

### Exposed methods

| Method | Description |
|--------|-------------|
| `goNext()` | Move to the next item |
| `goPrev()` | Move to the previous item |

---

## SWindowItem

Individual slide/panel.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number \| boolean` | vnode `key` | Identifier matched against the window model. Falls back to `:key`, then an auto-generated id |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Item content |

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const active = ref(0)
const slides = [
  { value: 0, content: 'Step 1: Account Setup' },
  { value: 1, content: 'Step 2: Personal Info' },
  { value: 2, content: 'Step 3: Confirmation' },
]
</script>

<template>
  <!-- Basic window -->
  <SWindow v-model="active" continuous mandatory>
    <SWindowItem v-for="slide in slides" :key="slide.value" :value="slide.value">
      <div class="s_pa__8">{{ slide.content }}</div>
    </SWindowItem>
  </SWindow>

  <!-- Navigation controls below -->
  <div class="s_d__flex s_justify__center s_mt__4">
    <SButton :disabled="active === 0" @click="active--">Back</SButton>
    <SButton :disabled="active === slides.length - 1" color="primary" @click="active++">
      Next
    </SButton>
  </div>

  <!-- Custom nav buttons -->
  <SWindow v-model="active">
    <template #prev="{ icon, click, disabled }">
      <SButton variant="icon" color="primary" :disabled="disabled" @click="click">
        <SIcon :icon="icon" />
      </SButton>
    </template>
    <SWindowItem v-for="n in 5" :key="n" :value="n">
      Content {{ n }}
    </SWindowItem>
    <template #next="{ icon, click }">
      <SButton variant="icon" color="primary" @click="click">
        <SIcon :icon="icon" />
      </SButton>
    </template>
  </SWindow>

  <!-- Without animations -->
  <SWindow v-model="active" no-animation hide-arrows>
    <SWindowItem :value="0">Panel A</SWindowItem>
    <SWindowItem :value="1">Panel B</SWindowItem>
  </SWindow>
</template>
```

## Notes

- `SCarousel` is built on top of `SWindow` — use `SCarousel` for image slideshows and `SWindow` for content/step wizards.
- On mount the window shows the item whose `value` matches `v-model`; when the model names no item, it selects the first item and emits its `value`.
- `continuous` enables looping navigation; without it the prev/next arrows disappear at the first/last item.
- `touch` is off by default on `SWindow` (SCarousel turns it on).
- Use the `prev`/`next` slots to replace the default arrow buttons with custom controls.
