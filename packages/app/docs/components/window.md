# Window Components

**Import:** `import { SWindow, SWindowItem } from '@khsura/sui'`

Slide-based content switcher — foundation for carousels, step wizards, and any sequential content display.

---

## SWindow

Root container managing the active item.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `any` | `undefined` | Active item's value |
| `nextIcon` | `MaterialDesignIcon` | `'mdi-chevron-right'` | Next navigation icon |
| `prevIcon` | `MaterialDesignIcon` | `'mdi-chevron-left'` | Previous navigation icon |
| `hideArrows` | `boolean` | `false` | Hide navigation arrows |
| `touch` | `boolean \| TouchHandlers` | `true` | Enable swipe gestures |
| `noAnimation` | `boolean` | `false` | Disable slide transition |
| `selectedClass` | `string` | `undefined` | CSS class applied to active item |
| `mandatory` | `boolean` | `false` | Always keep one item selected |
| `continuous` | `boolean` | `false` | Loop from last to first / first to last |
| `disabled` | `boolean` | `false` | Disable navigation |
| `color` | `string` | `undefined` | Navigation controls color |
| `tag` | `string` | `'div'` | Root HTML element |

### Model

`v-model` — value of the currently visible item.

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ items, selected, select }` | Rendered window items |
| `prev` | `{ attrs, on }` | Custom previous button |
| `next` | `{ attrs, on }` | Custom next button |

---

## SWindowItem

Individual slide/panel.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any` | `undefined` | Identifier matched against window model |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Item content |

---

## Usage

```vue
<script setup lang="ts">
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
    <template #prev="{ attrs, on }">
      <SButton variant="icon" v-bind="attrs" v-on="on" color="primary">
        <SIcon icon="mdi-arrow-left" />
      </SButton>
    </template>
    <SWindowItem v-for="n in 5" :key="n" :value="n">
      Content {{ n }}
    </SWindowItem>
    <template #next="{ attrs, on }">
      <SButton variant="icon" v-bind="attrs" v-on="on" color="primary">
        <SIcon icon="mdi-arrow-right" />
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
- `continuous` enables looping navigation; without it, navigation stops at the first/last item.
- `mandatory` ensures one item is always selected (prevents empty state).
- Use the `prev`/`next` slots to replace the default arrow buttons with custom controls.
